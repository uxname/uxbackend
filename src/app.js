"use strict";

const log = require('./helper/logger').getLogger('app');
const config = require('./config/config');
const productResolver = require('./resolver/product');
const categoryResolver = require('./resolver/category');
const userResolver = require('./resolver/user');
const prisma = require('./helper/prisma_helper').prisma;
const roleHelper = require('./helper/roles_helper');
const {rule, shield, and, or, not, allow, deny} = require('graphql-shield');
const systemResolver = require('./resolver/system_resolver');
const redis = require('redis');
const redisClient = redis.createClient(config.redis);
const _ = require('lodash');
const fetch = require('node-fetch');
const {
    makeRemoteExecutableSchema,
    addResolveFunctionsToSchema,
    introspectSchema,
    mergeSchemas,
    transformSchema,
    makeExecutableSchema,
    FilterRootFields,
} = require('graphql-tools');
const {importSchema} = require('graphql-import');
const {createHttpLink} = require('apollo-link-http');


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

        activationCode: isAuthenticated,
        activationCodes: isAuthenticated,
        activationCodesConnection: isAuthenticated,
        category: isAuthenticated,
        categories: isAuthenticated,
        categoriesConnection: isAuthenticated,
        product: isAuthenticated,
        products: isAuthenticated,
        productsConnection: isAuthenticated,
        user: isAuthenticated,
        users: isAuthenticated,
        usersConnection: isAuthenticated,
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
});

async function getSchema() {
    const makeDatabaseServiceLink = () => createHttpLink({
        uri: `${process.env["PRISMA_ENDPOINT"]}`,
        fetch
    });

    const introspected_schema = await introspectSchema(makeDatabaseServiceLink());

    const transformed_schema = transformSchema(introspected_schema, [
        new FilterRootFields(
            (from, to) => {
                // noinspection RedundantIfStatementJS
                if (to === 'node') { // exclude query "node" from Query
                    return false;
                } else {
                    return true;
                }
            }
        )
    ]);

    const remoteExecutableSchema = makeRemoteExecutableSchema({
        schema: transformed_schema,
        link: makeDatabaseServiceLink()
    });

    const app_schema = makeExecutableSchema({
        typeDefs: importSchema(__dirname + '/../src/schema/schema.graphql')
    });

    const merged_schema = mergeSchemas({
        schemas: [
            remoteExecutableSchema,
            app_schema
        ]
    });

    addResolveFunctionsToSchema({
        schema: merged_schema,
        resolvers: resolvers
    });

    return merged_schema;
}


module.exports = {
    getSchema: getSchema,
    permissions: permissions,
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
