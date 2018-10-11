const {ApolloError} = require('apollo-server-express');
const rolesHelper = require('../helper/roles_helper');
const productController = require('../controller/product');

async function getProducts(root, args, ctx) {
    return productController.getProducts(args);
}

async function createProduct(root, {data}, ctx) {
    await rolesHelper.assertWrongRole(['ADMIN'], ctx.token);

    return productController.createProduct(data);
}

module.exports = {
    getProducts: getProducts,
    createProduct: createProduct
};
