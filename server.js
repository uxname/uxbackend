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

process.on('unhandledRejection', error => {
    log.warn('unhandledRejection', error);
});

const graphqlServer = new GraphQLServer({
    typeDefs: importSchema('schema.graphql'),
    resolvers: app.resolvers,
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

graphqlServer.express.use(limiter);

(async () => {
    await pg.connect();

    await graphqlServer.start({
        tracing: config.graphql.tracing,
        endpoint: config.graphql.endpoint_path,
        playground: config.graphql.playground,
        port: config.port,
        formatError: error => {
            log.warn('GraphQL error -> stacktrace:', error);
            return error;
        }
    });

    log.info(`🚀  Server "${pkg.name} - ${pkg.version}" ready at "${config.port}" port`);
})();
