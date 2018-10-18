const log = require('../helper/logger').getLogger('product_service');
const prisma = require('../helper/prisma_helper').prisma;
const agenda = require('../helper/job_scheduler').getAgenda();

(async () => {
    await agenda.start();

    agenda.define('product_created', (job, done) => {
        log.info('Job -> product created:', job.attrs.data);
        done();
    });
})();

async function getProducts(root, args, ctx, info) {
    return await prisma.products(args);
}

async function createProduct(root, args, ctx, info) {
    const result = await prisma.createProduct(args.data);

    // send test job: notice system about product created
    await agenda.schedule('10 seconds', 'product_created', {
        event: 'product created 10 seconds ago',
        product: result
    });

    return result;
}

module.exports = {
    getProducts: getProducts,
    createProduct: createProduct
};
