const log = require('../helper/logger').getLogger('role_asserter');
const {ApolloError} = require('apollo-server-express');
const token = require('../helper/token');
const prisma = require('../prisma-client').prisma;

async function userHasRole(rolesForCheck, userId) {
    const foundUser = await prisma.user({
        id: userId
    });

    console.log('userID', foundUser);
    if (!foundUser || !foundUser.roles || foundUser.roles.length <= 0) {
        log.info("Check user role, user or user's roles not found");
        return false;
    }

    let result = false;

    foundUser.roles.forEach(foundUserRole => {
        rolesForCheck.forEach(role => {
            console.log(role.toLowerCase().trim(), foundUserRole.toLowerCase().trim());
            if (role.toLowerCase().trim() === foundUserRole.toLowerCase().trim()) {
                result = true;
                console.log(role.toLowerCase().trim(), foundUserRole.toLowerCase().trim());
            }
        })
    });


    return result;
}

async function assertWrongRole(rolesForCheck, jwtToken) {
    function error() {
        throw new ApolloError('Permission denied', 403);
    }

    try {
        const user = await token.validateToken(jwtToken);

        if (!user || !user.id) {
            error()
        }

        if (!(await userHasRole(rolesForCheck, user.id))) {
            error()
        }

    } catch (e) {
        error();
    }

}

module.exports = {
    assertWrongRole: assertWrongRole,
    userHasRole: userHasRole
};
