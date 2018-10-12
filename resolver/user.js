const {ApolloError} = require('apollo-server-express');
const userService = require('../service/user');

async function signUp(root, {email, password}) {
    return userService.signUp(email, password);
}

async function signIn(root, {email, password}) {
    return userService.signIn(email, password);
}

module.exports = {
    signUp: signUp,
    signIn: signIn
};
