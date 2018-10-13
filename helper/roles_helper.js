const log = require('../helper/logger').getLogger('role_asserter');
const {ApolloError} = require('apollo-server-express');
const prisma = require('../helper/prisma_helper').prisma;

async function userHasRole(rolesForCheck, userId) {
    const foundUser = await prisma.user({
        id: userId
    });

    if (!foundUser || !foundUser.roles || foundUser.roles.length <= 0) {
        log.info("Check user role, user or user's roles not found");
        return false;
    }

    let result = false;

    foundUser.roles.forEach(foundUserRole => {
        rolesForCheck.forEach(role => {
            if (role.toLowerCase().trim() === foundUserRole.toLowerCase().trim()) {
                result = true;
            }
        })
    });


    return result;
}

async function assertWrongRole(rolesForCheck, userId) {
    const result = await userHasRole(rolesForCheck, userId);
    if (!result) {
        throw new ApolloError('Permission denied', 403);
    }
}

module.exports = {
    assertWrongRole: assertWrongRole,
    userHasRole: userHasRole
};
