const {ApolloError} = require('apollo-server-express');
const rolesHelper = require('../helper/roles_helper');
const productService = require('../service/product');

async function getProducts(root, args, ctx, info) {
    return productService.getProducts(args);
}

async function createProduct(root, {data}, ctx) {
    if (!ctx.user) {
        throw new ApolloError('Permission denied, please log in', 403)
    }

    await rolesHelper.assertWrongRole(['ADMIN'], ctx.user.id);

    return await productService.createProduct(data);
}

module.exports = {
    getProducts: getProducts,
    createProduct: createProduct
};
