const userService = require('../service/user');

async function signUp(root, {email, password, step, activation_code}, ctx, info) {
    return userService.signUp(email, password, step, activation_code);
}

async function signIn(root, {email, password}, ctx, info) {
    return userService.signIn(email, password);
}

module.exports = {
    signUp: signUp,
    signIn: signIn
};
