"use strict";

const log = require('./helper/logger').getLogger('app');
const config = require('./config/config');
const productResolver = require('./resolver/product');
const categoryResolver = require('./resolver/category');
const userResolver = require('./resolver/user');
const prisma = require('./helper/prisma_helper').prisma;
const roleHelper = require('./helper/roles_helper');
const {rule, shield, and, or, not} = require('graphql-shield');
const systemResolver = require('./resolver/system_resolver');
const redis = require('redis');
const redisClient = redis.createClient(config.redis);
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
    },
    Node: { // to remove warning "Type "Node" is missing a "__resolveType" resolver. Pass false into "resolverValidationOptions.requireResolversForResolveType" to disable this warning."
        __resolveType() {
            return null;
        }
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

