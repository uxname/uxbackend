const prisma = require('../helper/prisma_helper').prisma;

async function getProducts(root, args, ctx, info) {
    return await prisma.query.products(args, info);
}

async function createProduct(root, args, ctx, info) {
    return await prisma.mutation.createProduct(args, info);
}

module.exports = {
    getProducts: getProducts,
    createProduct: createProduct
};
