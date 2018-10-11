const {ApolloError} = require('apollo-server-express');
const rolesHelper = require('../helper/roles_helper');
const productController = require('../controller/product');

async function getProducts(root, args, ctx) {
    return productController.getProducts(args);
}

async function createProduct(root, {data}, ctx) {
    if (!ctx.user) {
        throw new ApolloError('Permission denied, please log in', 403)
    }

    await rolesHelper.assertWrongRole(['ADMIN'], ctx.user.id);

    return await productController.createProduct(data);
}

module.exports = {
    getProducts: getProducts,
    createProduct: createProduct
};
