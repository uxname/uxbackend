const prisma = require('../helper/prisma_helper').prisma;

async function getProducts(root, args, ctx, info) {
    return await prisma.products(args);
}

async function createProduct(root, args, ctx, info) {
    return await prisma.createProduct(args.data);
}

module.exports = {
    getProducts: getProducts,
    createProduct: createProduct
};
