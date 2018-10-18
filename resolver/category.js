const prisma = require('../helper/prisma_helper').prisma;
const GraphqlError = require('../helper/GraphqlError');
const rolesHelper = require('../helper/roles_helper');
const productService = require('../service/product');

async function getSubcategories(root, args, ctx, info) {
    return prisma.category({
        id: root.id
    }).subcategories(args);
}

module.exports = {
    getSubcategories: getSubcategories
};
