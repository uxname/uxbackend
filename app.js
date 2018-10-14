const log = require('./helper/logger').getLogger('app');
const productsResolver = require('./resolver/product');
const userResolver = require('./resolver/user');
const prisma = require('./helper/prisma_helper').prisma;
const roleHelper = require('./helper/roles_helper');
const {rule, shield, and, or, not} = require('graphql-shield');

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

const isAdmin = rule()(async (parent, args, ctx, info) => {
    if (!ctx.user || !ctx.user.id) {
        log.error('isAdmin false, ctx:', ctx);
        return false;
    }
    return await roleHelper.userHasRoles(['ADMIN'], ctx.user.id);
});

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
    if (!ctx.user || !ctx.user.id) {
        log.error('isAuthenticated false, ctx:', ctx);
        return false;
    }
    return await prisma.exists.User({
        id: ctx.user.id
    });
});


const permissions = shield({
    Query: {
        products: isAuthenticated
    },
    Product: {
        title: isAdmin
    }
});

module.exports = {
    resolvers: resolvers,
    permissions: permissions
};

//todo remove me
const token = require('./helper/token');
(async () => {
    const user = await prisma.query.user({
        where: {
            email: 'admin@admin.com'
        }
    });

    log.error("REMOVE ME. Admin user's token:\n", `{"token":"${token.createToken(user)}"}`);
})();


