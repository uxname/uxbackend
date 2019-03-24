"use strict";

const log = require('./helper/logger').getLogger('server');
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
require('dotenv').config();

const machineId = require('./helper/machine_id');
log.info(`Starting server [Machine ID: ${machineId.shortMachineId}]...`);
const config = require('./config/config');

const production = process.env.NODE_ENV === 'production';

if (!production) {
    // Set or override prisma endpoint
    process.env.PRISMA_ENDPOINT = 'http://localhost:4466';
}
log.debug(`Prisma endpoint: [ ${process.env.PRISMA_ENDPOINT} ]`);

const {GraphQLServer} = require('graphql-yoga');
const {importSchema} = require('graphql-import');
const rateLimit = require("express-rate-limit");
const token = require('./helper/token');
const app = require('./app');
const pg = require('./helper/db');
const job_scheduler = require('./helper/job_scheduler');
const {default: costAnalysis} = require('graphql-cost-analysis');
const GraphqlRequestLogger = require('./helper/GraphqlRequestLogger');
const compression = require('compression');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');
const redisClient = redis.createClient(config.redis);
const GQLError = require('./helper/GQLError');
const express = require('express');
const basicAuth = require('express-basic-auth');

process.on('unhandledRejection', (reason, p) => {
    log.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', function (error) {
    log.error('uncaughtException :', error);
});


(async () => {
    const graphqlServer = new GraphQLServer({
        mocks: config.graphql.mocks,
        typeDefs: importSchema(__dirname + '/../src/schema/schema.graphql'),
        resolvers: app.resolvers,
        middlewares: [app.permissions],
        context: async ({request}) => {
            GraphqlRequestLogger.log(request);

            let user = null;
            try {
                user = await token.validateToken(request.headers.token);
            } catch (e) {
                log.trace("Can't get user from token:", e.message)
            }

            return {
                user: user,
                token: request.headers.token,
                pgPool: pg.pgPool,
                middlewareError: request.middlewareError
            }
        }
    });

    /*
    Important, for using `res.write` or similar functions - please
    use `res.flush()` function: https://github.com/expressjs/compression#server-sent-events
     */
    graphqlServer.express.use(compression(config.compression));

    // DDoS protection
    const limiter = rateLimit({
        store: new RedisStore({
            expiry: config.ddos_protection.windowMs / 1000 || 1, // in seconds
            prefix: 'rate_limit:',
            client: redisClient
        }),
        windowMs: config.ddos_protection.windowMs || 1000 * 60 * 15,
        max: config.ddos_protection.max || 1000000, // limit each IP to 'max' requests per windowMs
        message: config.ddos_protection.message || '{ "message": "Too many requests" }',
        onLimitReached: (req, res, options) => {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            log.error(`HTTP Request limit reached. IP: [${ip}]`);
        }
    });

    // Log ip
    graphqlServer.express.use((req, res, next) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const requestedUrl = req.protocol + '://' + req.get('Host') + req.url;

        let log_string = `Request IP: [${ip.toString()}] - ${req.method} ${requestedUrl}`;

        if (req.headers['x-forwarded-for']) {
            log_string += ' (from header "x-forwarded-for")';
        }
        log.trace(log_string);

        next();
    });

    // Maintenance mode handler
    graphqlServer.express.use((req, res, next) => {
        if (!config.maintenance_mode.maintenance_mode_enabled) {
            next();
            return;
        }
        const ip = req.connection.remoteAddress;

        if (config.maintenance_mode.allowed_hosts.indexOf(ip) >= 0) {
            log.info(`Maintenance mode enabled. Disable it in config. Got request from: [${ip}]`);
            next();
        } else {
            res.status(503).json({
                status: config.maintenance_mode.message
            });
        }
    });
    graphqlServer.express.use(limiter);

    const agenda = job_scheduler.getAgenda(graphqlServer.express,
        basicAuth({
            authorizer: (username, password) => {
                return password === config.job_scheduler.access_token;
            },
            challenge: true,
            realm: machineId.machineId
        }));

    graphqlServer.express.get('/', (req, res) => {
        res.status(404).json({
            message: 'Welcome'
        });
    });

    if (config.logs_web_panel.enabled) {
        const serveIndex = require('serve-index');

        graphqlServer.express.use(config.logs_web_panel.path, basicAuth({
            authorizer: (username, password) => {
                return password === config.logs_web_panel.access_token;
            },
            challenge: true,
            realm: machineId.machineId
        }));

        graphqlServer.express.use(config.logs_web_panel.path, express.static('./logs'), serveIndex('./logs', {'icons': true}));
    }

    const routers = require(__dirname + '/router');

    if (routers && routers.length > 0) {
        routers.forEach(function (router) {
            if (router.router && router.path) graphqlServer.express.use(router.path, router.router);
        });
    }

    await pg.connect();

    await graphqlServer.start({
        tracing: config.graphql.tracing,
        endpoint: config.graphql.endpoint_path,
        playground: config.graphql.playground,
        cacheControl: true,
        port: config.port,
        validationRules: (req) => [
            costAnalysis({
                variables: req.body.variables,
                maximumCost: config.graphql.maximumCost,
                defaultCost: config.graphql.defaultCost,
                onComplete(cost) {
                    log.trace(`Cost analysis score: ${cost}`)
                },
            })
        ],
        formatError: error => {
            log.debug('GraphQL error -> stacktrace:', error);
            return GQLError.formatError(error);
        }
    });
    log.info('GraphQL server started successful');

    await agenda.start();
    log.info('Job scheduler started successful');

    log.info(`Server started successful (${config.port} port).`);
})();
