const log = require('./helper/logger').getLogger('server');
const pkg = require('./package');
log.info(`Starting "${pkg.name} - ${pkg.version}" server...`);
const config = require('./config/config');
if (process.env.IS_DOCKER !== 'true') {
    process.env.PRISMA_ENDPOINT = 'http://localhost:4466'
}
log.debug('Prisma endpoint:', process.env.PRISMA_ENDPOINT);
const {GraphQLServer} = require('graphql-yoga');
const {importSchema} = require('graphql-import');
const rateLimit = require("express-rate-limit");
const token = require('./helper/token');
const app = require('./app');
const pg = require('./helper/db');
const job_scheduler = require('./helper/job_scheduler');

process.on('unhandledRejection', error => {
    log.warn('unhandledRejection', error);
});

const graphqlServer = new GraphQLServer({
    typeDefs: importSchema('schema.graphql'),
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
    message: config.ddos_protection.message || '{ "error": "Too many requests" }'
});

// Maintenance mode handler
graphqlServer.express.use((req, res, next) => {
    if (!config.maintenance_mode.maintenance_mode_enabled) {
        next();
        return;
    }
    const ip = req.connection.remoteAddress;

    if (config.maintenance_mode.allowed_hosts.indexOf(ip) >= 0) {
        log.info(`Maintenance mode enabled. Got request from: "${ip}"`);
        next();
    } else {
        res.status(503).json({
            status: 'Sorry we are down for maintenance'
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
        port: config.port,
        formatError: error => {
            log.info('GraphQL error -> stacktrace:', error);
            return error;
        }
    });
    log.debug('GraphQL server started successful');

    await agenda.start();
    log.debug('Job scheduler started successful');

    log.info(`🚀  Server "${pkg.name} - ${pkg.version}" ready at "${config.port}" port`);
})();
