"use strict";

const log = require('./helper/logger').getLogger('app');
const config = require('./config/config');
const userResolver = require('./resolver/user');
const prisma = require('./helper/prisma_helper').prisma;
const roleHelper = require('./helper/roles_helper');
const {rule, shield, and, or, not, allow, deny} = require('graphql-shield');
const systemResolver = require('./resolver/system_resolver');
const redis = require('redis');
const redisClient = redis.createClient(config.redis);
const GQLError = require('./helper/GQLError');
const product_core = require('./core/product');
const _ = require('lodash');

const CACHED_RESPONSE_REDIS_PREFIX = 'cached:';
const CACHED_RESPONSE_REDIS_EXPIRE_SEC = 10;

const resolvers = {
    Query: {
        cachedResponse: (root, {id}) => {
            return new Promise((resolve, reject) => {
                redisClient.get(CACHED_RESPONSE_REDIS_PREFIX + id, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    if (result !== null) {
                        return resolve(result);
                    } else {

                        const nonCachedObject = `This is cached (for ${CACHED_RESPONSE_REDIS_EXPIRE_SEC} sec.) string: ${Math.random()}`;

                        redisClient.set(CACHED_RESPONSE_REDIS_PREFIX + id, nonCachedObject, 'EX', CACHED_RESPONSE_REDIS_EXPIRE_SEC, (err, res) => {
                            if (err) {
                                return reject(err);
                            }

                            _.delay(() => {
                                resolve(nonCachedObject);
                            }, 2000); // Manual delay for first request
                        });
                    }
                });
            })
        },
        clearCachedResponse: (root, {id}) => {
            return new Promise((resolve, reject) => {
                redisClient.del(CACHED_RESPONSE_REDIS_PREFIX + id, (err, deletedCount) => {
                    if (err) {
                        return reject(err);
                    }

                    if (deletedCount >= 1) {
                        resolve(true);
                    } else {
                        reject('Cache not found');
                    }
                });
            });
        },
        systemInfo: systemResolver.systemInfo,
        sign_in: userResolver.signIn,

        activationCode: (root, {where}) => prisma.activationCode(where),
        activationCodes: (root, args) => prisma.activationCodes(args),

        category: (root, {where}) => prisma.category(where),
        categories: (root, args) => prisma.categories(args),

        product: (root, {where}) => prisma.product(where),
        products: (root, args) => prisma.products(args),

        user: (root, {where}) => prisma.user(where),
        users: (root, args) => prisma.users(args),
    },
    Mutation: {
        sign_up: userResolver.signUp,
        change_password: userResolver.change_password,

        createActivationCode: (root, args) => prisma.createActivationCode(args.data),
        updateActivationCode: (root, args) => prisma.updateActivationCode(args),
        updateManyActivationCodes: (root, args) => prisma.updateManyActivationCodes(args),
        upsertActivationCode: (root, args) => prisma.upsertActivationCode(args),
        deleteActivationCode: (root, args) => prisma.deleteActivationCode(args.where),
        deleteManyActivationCodes: (root, args) => prisma.deleteManyActivationCodes(args.where),

        createCategory: (root, args) => prisma.createCategory(args.data),
        updateCategory: (root, args) => prisma.updateCategory(args),
        updateManyCategories: (root, args) => prisma.updateManyCategories(args),
        upsertCategory: (root, args) => prisma.upsertCategory(args),
        deleteCategory: (root, args) => prisma.deleteCategory(args.where),
        deleteManyCategories: (root, args) => prisma.deleteManyCategories(args.where),

        createProduct: (root, args, ctx, info) => product_core.createProduct(root, args, ctx, info),
        updateProduct: (root, args) => prisma.updateProduct(args.data),
        updateManyProducts: (root, args) => prisma.updateManyProducts(args),
        upsertProduct: (root, args) => prisma.upsertProduct(args),
        deleteProduct: (root, args) => prisma.deleteProduct(args.where),
        deleteManyProducts: (root, args) => prisma.deleteManyProducts(args.where),

        createUser: (root, args) => prisma.createUser(args.data),
        updateUser: (root, args) => prisma.updateUser(args),
        updateManyUsers: (root, args) => prisma.updateManyUsers(args),
        upsertUser: (root, args) => prisma.upsertUser(args),
        deleteUser: (root, args) => prisma.deleteUser(args.where),
        deleteManyUsers: (root, args) => prisma.deleteManyUsers(args.where),
    },
    Category: {
        subcategories: root => prisma.category({id: root.id}).subcategories(),
        products: root => prisma.category({id: root.id}).products(),
    },
    Product: {
        categories: root => prisma.product({id: root.id}).categories(),
    },
    Node: { // to remove warning "Type "Node" is missing a "__resolveType" resolver. Pass false into "resolverValidationOptions.requireResolversForResolveType" to disable this warning."
        __resolveType() {
            return null;
        }
    }
};

const isAdmin = rule({cache: 'no_cache'})(async (parent, args, ctx, info) => {
    if (!ctx.user || !ctx.user.id) {
        log.error('isAdmin false, ctx:', ctx);
        return false;
    }
    return await roleHelper.userHasRoles(['ADMIN'], ctx.user.id);
});

const isAuthenticated = rule({cache: 'no_cache'})(async (parent, args, ctx, info) => {
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
        systemInfo: and(isAuthenticated, isAdmin),
        cachedResponse: allow,
        clearCachedResponse: allow,

        activationCode: and(isAuthenticated, isAdmin),
        activationCodes: and(isAuthenticated, isAdmin),

        category: isAuthenticated,
        categories: isAuthenticated,

        product: isAuthenticated,
        products: isAuthenticated,

        user: isAuthenticated,
        users: isAuthenticated,
    },
    Mutation: {
        change_password: isAuthenticated,

        createActivationCode: and(isAuthenticated, isAdmin),
        updateActivationCode: and(isAuthenticated, isAdmin),
        updateManyActivationCodes: and(isAuthenticated, isAdmin),
        upsertActivationCode: and(isAuthenticated, isAdmin),
        deleteActivationCode: and(isAuthenticated, isAdmin),
        deleteManyActivationCodes: and(isAuthenticated, isAdmin),

        createCategory: and(isAuthenticated, isAdmin),
        updateCategory: and(isAuthenticated, isAdmin),
        updateManyCategories: and(isAuthenticated, isAdmin),
        upsertCategory: and(isAuthenticated, isAdmin),
        deleteCategory: and(isAuthenticated, isAdmin),
        deleteManyCategories: and(isAuthenticated, isAdmin),

        createProduct: and(isAuthenticated, isAdmin),
        updateProduct: and(isAuthenticated, isAdmin),
        updateManyProducts: and(isAuthenticated, isAdmin),
        upsertProduct: and(isAuthenticated, isAdmin),
        deleteProduct: and(isAuthenticated, isAdmin),
        deleteManyProducts: and(isAuthenticated, isAdmin),

        createUser: and(isAuthenticated, isAdmin),
        updateUser: and(isAuthenticated, isAdmin),
        updateManyUsers: and(isAuthenticated, isAdmin),
        upsertUser: and(isAuthenticated, isAdmin),
        deleteUser: and(isAuthenticated, isAdmin),
        deleteManyUsers: and(isAuthenticated, isAdmin),
    },
    User: {
        id: allow,
        createdAt: allow,
        updatedAt: allow,
        email: allow,
        roles: allow,
        avatar: allow,
        last_login_date: allow,
    },
    Product: {
        id: allow,
        createdAt: allow,
        updatedAt: allow,
        title: allow,
        description: allow,
        categories: allow,
    },
    Category: {
        id: allow,
        createdAt: allow,
        updatedAt: allow,
        title: allow,
        description: allow,
        subcategories: allow,
        products: allow,
    }
}, {
    fallbackError: new GQLError({message: 'Permission denied!', code: 403}),
});

module.exports = {
    resolvers: resolvers,
    permissions: permissions
};

// todo remove me
/*
const token = require('./helper/token');
(async () => {
    const user = await prisma.user({
        email: 'admin@admin.com'
    });

    console.log({user});
    log.error("REMOVE ME. Admin user's token:\n", `{"token":"${token.createToken(user)}"}`);
})();
*/
