const prisma = require('../helper/prisma_helper').prisma;

async function getProducts(args) {
    return await prisma.products(args);
}

function createProduct(data) {
    return prisma.createProduct(data);
}

module.exports = {
    getProducts: getProducts,
    createProduct: createProduct
};
