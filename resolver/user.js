const userService = require('../service/user');
const GraphqlError = require('../helper/GraphqlError');

async function signUp(root, {email, password, step, activation_code}, ctx, info) {
    return userService.signUp(email, password, step, activation_code);
}

async function signIn(root, {email, password}, ctx, info) {
    return userService.signIn(email, password);
}

async function change_password(root, {old_password, new_password}, ctx, info) {
    if (!ctx.user || !ctx.user.id) {
        throw new GraphqlError('Unauthorized', 401);
    }
    const userId = ctx.user.id;
    return userService.change_password(userId, old_password, new_password);
}

module.exports = {
    signUp: signUp,
    change_password: change_password,
    signIn: signIn
};
