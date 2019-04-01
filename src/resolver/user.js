const log = require('../helper/logger').getLogger('user_resolver');
const prisma = require('../helper/prisma_helper').prisma;
const userCore = require('../core/user');
const GQLError = require('../helper/GQLError');
const emailHelper = require('../helper/email_helper');
const password_helper = require('../helper/password_helper');
const token = require('../helper/token');

async function signUp(root, {email, password, step, activation_code}, ctx, info) {
    return userCore.signUp(email, password, step, activation_code);
}

async function signIn(root, {email, password}, ctx, info) {
    return userCore.signIn(email, password);
}

async function change_password(root, {old_password, new_password}, ctx, info) {
    if (!ctx.user || !ctx.user.id) {
        throw new GQLError({message: 'Unauthorized', code: 401});
    }
    const userId = ctx.user.id;
    return userCore.change_password(userId, old_password, new_password);
}

async function restore_password(root, {email, restore_code, new_password, step}, ctx, info) {
    const userExists = await prisma.$exists.user({
        email: email
    });

    if (!userExists) {
        throw new GQLError({message: 'User not found', code: 404});
    }

    if (step === 'GENERATE_RESTORE_CODE') {
        const result = await emailHelper.generateRestoreCode(email);

        await emailHelper.sendRestoreEmail(email, result.code);

        return {
            status: 'ok'
        };
    } else if (step === 'CHECK_RESTORE_CODE') {
        if (!new_password) {
            throw new GQLError({message: 'Password is required', code: 400});
        }

        const email_verified = await emailHelper.verityRestoreCode(email, restore_code);
        if (!email_verified) {
            throw new GQLError({message: 'Wrong restore code', code: 403});
        } else {
            const user = await prisma.user({email: email});

            const password_hash = await password_helper.hashPassword(new_password, user.password_salt);

            const result = await prisma.updateUser({
                where: {email: email},
                data: {password_hash: password_hash}
            }).$fragment(`
                {
                    id
                    createdAt
                    updatedAt
                    email
                    roles
                    avatar
                    last_login_date
                }
            `);

            return {
                token: token.createToken(result),
                user: result
            };
        }
    } else {
        return false;
    }
}

module.exports = {
    signUp: signUp,
    change_password: change_password,
    restore_password: restore_password,
    signIn: signIn
};
