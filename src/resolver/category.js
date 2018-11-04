const prisma = require('../helper/prisma_helper').prisma;

async function getSubcategories(root, args, ctx, info) {
    return prisma.category({
        id: root.id
    }).subcategories(args);
}

module.exports = {
    getSubcategories: getSubcategories
};
