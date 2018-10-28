"use strict";

const log = require('./helper/logger').getLogger('server');
const pkg = require('../package');
log.info(`\n\n\nStarting server: [${pkg.name} - ${pkg.version}]...`);
const config = require('./config/config');
if (process.env.NODE_ENV !== 'production') {
    process.env.PRISMA_ENDPOINT = 'http://localhost:4466'
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

process.on('unhandledRejection', error => {
    log.warn('unhandledRejection', error);
});

const graphqlServer = new GraphQLServer({
    mocks: config.graphql.mocks,
    typeDefs: importSchema(__dirname + '/../src/schema.graphql'),
    resolvers: app.resolvers,
    middlewares: [app.permissions],
    context: async ({request}) => {
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

// DDOS protection
const limiter = rateLimit({
    windowMs: config.ddos_protection.windowMs || 1000,
    max: config.ddos_protection.max || 1000000, // limit each IP to 'max' requests per windowMs
    message: config.ddos_protection.message || '{ "message": "Too many requests" }'
});

// Log ip
graphqlServer.express.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    let log_string = 'Request IP: [' + ip.toString() + ']';
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

const roles_helper = require('./helper/roles_helper');

const agenda = job_scheduler.getAgenda(graphqlServer.express,
    async (req, res, next) => { // Admin only access
        try {
            const user = await token.validateToken(req.headers.token);
            await roles_helper.userHasRoles(['ADMIN'], user.id);
            next();
        } catch (e) {
            log.debug('Job scheduler dashboard access error', e.message);
            res.status(401).json({
                result: 'Access denied'
            });
        }
    });

var routers = require(__dirname + '/router');

if (routers && routers.length > 0) {
    routers.forEach(function (router) {
        if (router.router && router.path) graphqlServer.express.use(router.path, router.router);
    });
}

(async () => {
    await pg.connect();

    await graphqlServer.start({
        tracing: config.graphql.tracing,
        endpoint: config.graphql.endpoint_path,
        playground: config.graphql.playground,
        cacheControl: true,
        port: config.port,
        validationRules: (req) => [
            costAnalysis({
                variables: req.query.variables,
                maximumCost: config.graphql.maximumCost,
                defaultCost: config.graphql.defaultCost,
                onComplete(cost) {
                    log.trace(`Cost analysis score: ${cost}`)
                },
            })
        ],
        formatError: error => {
            log.info('GraphQL error -> stacktrace:', error);
            return error;
        }
    });
    log.debug('GraphQL server started successful');

    await agenda.start();
    log.debug('Job scheduler started successful');

    log.info(`Server [ "${pkg.name} - ${pkg.version}" ] started successful (${config.port} port)`);
})();
