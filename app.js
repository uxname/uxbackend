const log = require('./helper/logger').getLogger('app');
const productsResolver = require('./resolver/product');
const userResolver = require('./resolver/user');

const resolvers = {
    Query: {
        sign_in: userResolver.signIn,
        products: productsResolver.getProducts
    },
    Mutation: {
        sign_up: userResolver.signUp,
        createProduct: productsResolver.createProduct
    }
};

const mocks = {
    Int: () => Math.round(0.5 + Math.random() * 1000),
    Float: () => 0.5 + Math.random() * 1000,
    String: () => 'String placeholder. Random = ' + (Math.round(0.5 + Math.random() * 1000)).toString(),
    Date: () => (new Date(Math.random() * new Date().getTime())).toString(),
    DateTime: () => (new Date(Math.random() * new Date().getTime())).toString(),
    UUID: () => (0.5 + Math.random() * 1000).toString()
};

module.exports = {
    resolvers: resolvers,
    mocks: mocks,
};

//todo remove me
const prisma = require('./prisma-client').prisma;
const token = require('./helper/token');
(async () => {
    const user = await prisma.user({
        email: 'admin@admin.com'
    });

    log.debug("Admin user's token:\n", `{"token":"${token.createToken(user)}"}`);
})();


