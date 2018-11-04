const prisma = require('../helper/prisma_helper').prisma;
const GQLError = require('../helper/GQLError');
const rolesHelper = require('../helper/roles_helper');
const productCore = require('../core/product');

async function getProducts(root, args, ctx, info) {
    return productCore.getProducts(root, args, ctx, info);
}

async function createProduct(root, args, ctx, info) {
    if (!ctx.user) {
        throw new GQLError('Permission denied, please log in', 403)
    }

    await rolesHelper.assertWrongRoles(['ADMIN'], ctx.user.id);

    return await productCore.createProduct(root, args, ctx, info);
}

async function getProductCategories(root, args, ctx, info) {
    return prisma.product({
        id: root.id
    }).categories(args)
}

module.exports = {
    getProducts: getProducts,
    createProduct: createProduct,
    getProductCategories: getProductCategories
};
