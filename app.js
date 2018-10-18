const log = require('./helper/logger').getLogger('app');
const productResolver = require('./resolver/product');
const categoryResolver = require('./resolver/category');
const userResolver = require('./resolver/user');
const prisma = require('./helper/prisma_helper').prisma;
const roleHelper = require('./helper/roles_helper');
const {rule, shield, and, or, not} = require('graphql-shield');
const systemResolver = require('./resolver/system_resolver');

const resolvers = {
    Query: {
        systemInfo: systemResolver.systemInfo,
        sign_in: userResolver.signIn,
        products: productResolver.getProducts
    },
    Product: {
        categories: productResolver.getProductCategories
    },
    Category: {
        subcategories: categoryResolver.getSubcategories
    },
    Mutation: {
        sign_up: userResolver.signUp,
        change_password: userResolver.change_password,
        createProduct: productResolver.createProduct
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
    return await prisma.$exists.user({
        id: ctx.user.id
    });
});


const permissions = shield({
    Query: {
        products: isAuthenticated
    },
    Mutation: {
        change_password: isAuthenticated
    },
    Product: {
        title: isAdmin
    }
});

module.exports = {
    resolvers: resolvers,
    permissions: permissions
};

// todo remove me
// const token = require('./helper/token');
// (async () => {
//     const user = await prisma.query.user({
//         where: {
//             email: 'admin@admin.com'
//         }
//     });
//
//     log.error("REMOVE ME. Admin user's token:\n", `{"token":"${token.createToken(user)}"}`);
// })();
//

