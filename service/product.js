const prisma = require('../helper/prisma_helper').prisma;

async function getProducts(root, args, ctx, info) {
    return await prisma.query.products(args, info);
}

function createProduct(data) {
    return prisma.mutation.createProduct(data);
}

module.exports = {
    getProducts: getProducts,
    createProduct: createProduct
};
