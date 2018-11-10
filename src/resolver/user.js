const userCore = require('../core/user');
const GQLError = require('../helper/GQLError');

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

module.exports = {
    signUp: signUp,
    change_password: change_password,
    signIn: signIn
};
