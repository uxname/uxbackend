const assert = require('assert');
process.env.PRISMA_ENDPOINT = 'http://localhost:4466';
const prisma = require('../helper/prisma_helper').prisma;

describe('Prisma db test', async () => {

    it('Should add product, fetch it, and remove without exceptions', async () => {
        const all_products_a = await prisma.products();

        const created_product = await prisma.createProduct({
            title: (Math.random()).toString(),
            description: (Math.random()).toString(),
        });

        const all_products_b = await prisma.products();

        const deleted_product = await prisma.deleteProduct({
            id: created_product.id
        });

        const all_products_c = await prisma.products();

        console.log(
            'All products count (step A):',
            all_products_a.length,
            'Created product:\n\n',
            created_product,
            '\n\nAll products count (step B):',
            all_products_b.length,
            '\n\nDeleted product',
            deleted_product,
            '\n\nAll products count (step C):',
            all_products_c.length
        );

    });
});
