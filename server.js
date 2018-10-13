const log = require('./helper/logger').getLogger('server');
const pkg = require('./package');

log.info(`Starting "${pkg.name} - ${pkg.version}" server...`);

const config = require('./config/config');

if (process.env.IS_DOCKER !== 'true') {
    process.env.PRISMA_ENDPOINT = 'http://localhost:4466'
}
log.debug('Prisma endpoint:', process.env.PRISMA_ENDPOINT);

const ApolloServer = require('apollo-server-express').ApolloServer;
const express = require('express');
const expressServer = express();

const {importSchema} = require('graphql-import');

const rateLimit = require("express-rate-limit");
const token = require('./helper/token');

const app = require('./app');

const pg = require('./helper/db');

process.on('unhandledRejection', error => {
    log.warn('unhandledRejection', error);
});

expressServer.use(function (err, req, res, next) {
    if (err) {
        log.warn('Middleware error:', err);
        req.middlewareError = err;
    }
    next();
});

// DDOS protection
if (!config.ddos_protection) {
    config.ddos_protection = {}
}

const limiter = rateLimit({
    windowMs: config.ddos_protection.windowMs || 1000 * 60 * 15,
    max: config.ddos_protection || 1000000, // limit each IP to 'max' requests per windowMs
    message: config.ddos_protection.message || '{ "error": "Too many requests" }'
});

//  apply to all requests
expressServer.use(limiter);

// todo remove mocks in production
const apolloServer = new ApolloServer({
    typeDefs: importSchema('schema.graphql'),
    resolvers: app.resolvers,
    mocks: app.mocks,
    mockEntireSchema: false,
    tracing: config.graphql.tracing,
    context: async ({req}) => {
        let user = null;
        try {
            user = await token.validateToken(req.headers.token);
        } catch (e) {
            log.trace("Can't get user from token: ", e.message)
        }

        return {
            user: user,
            token: req.headers.token,
            pgPool: pg.pgPool,
            middlewareError: req.middlewareError
        }
    },

    formatError: error => {
        log.warn('GraphQL error -> stacktrace:', error.extensions.exception.stacktrace);
        return error;
    },
    playground: config.graphql.playground
});

apolloServer.applyMiddleware({app: expressServer, path: config.graphql.endpoint_path});

(async () => {
    await pg.connect();

    expressServer.listen({port: config.port}, () => {
        log.info(`🚀  Server "${pkg.name} - ${pkg.version}" ready at "${config.port}" port`);
    });
})();
