const prisma = require('../prisma-client').prisma;

function getProducts(args) {
    return prisma.products(args)
}

function createProduct(data) {
    return prisma.createProduct(data);
}

module.exports = {
    getProducts: getProducts,
    createProduct: createProduct
};
