const log = require('../helper/logger').getLogger('role_asserter');
const GraphqlError = require('../helper/GraphqlError');
const prisma = require('../helper/prisma_helper').prisma;

async function userHasRoles(rolesForCheck, userId) {
    const foundUser = await prisma.user({
        id: userId
    }).$fragment('{id, roles}');

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

async function assertWrongRoles(rolesForCheck, userId) {
    const result = await userHasRoles(rolesForCheck, userId);
    if (!result) {
        throw new GraphqlError('Permission denied', 403);
    }
}

module.exports = {
    assertWrongRoles: assertWrongRoles,
    userHasRoles: userHasRoles
};
