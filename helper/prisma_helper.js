const {Prisma} = require('prisma-binding');
const {forwardTo} = require('prisma-binding');

const prisma = new Prisma({
    // debug: true,
    typeDefs: 'generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT
});

module.exports = {
    prisma: prisma,
    forwardTo: forwardTo
};
