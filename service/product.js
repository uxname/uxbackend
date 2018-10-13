const prisma = require('../helper/prisma_helper').prisma;

async function getProducts(args) {
    return await prisma.query.products(null);
}

function createProduct(data) {
    return prisma.mutation.createProduct(data);
}

module.exports = {
    getProducts: getProducts,
    createProduct: createProduct
};
