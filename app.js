const log = require('./helper/logger').getLogger('app');
const pkg = require('./package');

log.info(`Starting "${pkg.name} - ${pkg.version}" server...`);

const config = require('./config/config');

if (process.env.IS_DOCKER !== 'true') {
    process.env.PRISMA_ENDPOINT = 'http://localhost:4466'
}
log.trace('Prisma endpoint:', process.env.PRISMA_ENDPOINT);

const {ApolloServer, ApolloError} = require('apollo-server-express');
const express = require('express');
const app = express();

const schema = require('./schema_api').typeDefs;
const productsResolver = require('./resolver/product');

const rateLimit = require("express-rate-limit");

const resolvers = {
    Query: {
        products: productsResolver.getProducts
    },
    Mutation: {
        createProduct: productsResolver.createProduct
    }
};

app.use(function (err, req, res, next) {
    if (err) {
        log.warn('Middleware error:', err);
        req.middlewareError = err;
    }
    next();
});

const mocks = {
    Int: () => Math.round(0.5 + Math.random() * 1000),
    Float: () => 0.5 + Math.random() * 1000,
    String: () => 'String placeholder. Random = ' + (Math.round(0.5 + Math.random() * 1000)).toString(),
    Date: () => (new Date(Math.random() * new Date().getTime())).toString(),
    DateTime: () => (new Date(Math.random() * new Date().getTime())).toString(),
    UUID: () => (0.5 + Math.random() * 1000).toString()
};

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
app.use(limiter);

//todo remove me
log.error('Test user:', require('./helper/token').createToken(
    {
        "id": "cjn4ni9sz000r0a93y5a92iw4",
        "username": "odmin"
    }
));

// todo remove mocks in prod
const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers,
    mocks: mocks,
    mockEntireSchema: false,
    tracing: config.graphql.tracing,
    context: ({req}) => {
        return {
            token: req.headers.token,
            middlewareError: req.middlewareError
        }
    },

    formatError: error => {
        log.warn('GraphQL error -> stacktrace:', error.extensions.exception.stacktrace);
        return error;
    },
    playground: config.graphql.playground
});

server.applyMiddleware({app: app, path: config.graphql.endpoint_path});

(async () => {
    app.listen({port: config.port}, () => {
        log.info(`🚀  Server ready at ${config.port} port`);
    });
})();
