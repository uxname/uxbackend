const GraphqlError = require('../helper/GraphqlError');
const rolesHelper = require('../helper/roles_helper');
const productService = require('../service/product');

async function getProducts(root, args, ctx, info) {
    return productService.getProducts(root, args, ctx, info);
}

async function createProduct(root, args, ctx, info) {
    if (!ctx.user) {
        throw new GraphqlError('Permission denied, please log in', 403)
    }

    await rolesHelper.assertWrongRoles(['ADMIN'], ctx.user.id);

    return await productService.createProduct(root, args, ctx, info);
}

module.exports = {
    getProducts: getProducts,
    createProduct: createProduct
};
