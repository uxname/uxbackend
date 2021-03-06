const log = require('../helper/logger').getLogger('product_core');
const prisma = require('../helper/prisma_helper').prisma;
const agenda = require('../helper/job_scheduler').getAgenda();

(async () => {
    await agenda.start();

    agenda.define('product_created', async (job, done) => {
        log.info('Job -> product created:', job.attrs.data);
        function sleep(millis) {
            return new Promise(resolve => setTimeout(resolve, millis));
        }
        await sleep(15000);
        log.info('Sleep finished, job done');
        done();
    });
})();

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
    createProduct: createProduct
};
