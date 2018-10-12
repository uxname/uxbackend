const log = require('../helper/logger').getLogger('user_service');
const prisma = require('../prisma-client').prisma;
const password_helper = require('../helper/password_helper');
const token = require('../helper/token');
const {ApolloError} = require('apollo-server-express');
const validator = require('validator');

function safeUser(userObject) {
    if (!userObject) return null;

    const newUser = userObject;
    delete newUser.password_hash;
    delete newUser.password_salt;
    return newUser;
}

async function signUp(email, password) {
    if (!email || !password) {
        throw new ApolloError('Email and password required', 400);
    }

    log.error('email', email, 'password', password);

    if (!validator.isEmail(email)) {
        throw new ApolloError('Wrong email format', 400);
    }

    const salt = password_helper.getSecureRandomString();

    const password_hash = await password_helper.hashPassword(password, salt);

    const newUser = await prisma.createUser({
        email: email,
        password_hash: password_hash,
        password_salt: salt,
        role: "USER"
    });

    log.trace('User created: ', newUser.email);

    return {
        token: token.createToken(safeUser(newUser)),
        user: newUser
    };
}

async function signIn(email, password) {
    if (!email || !password) {
        throw new ApolloError('Email and password required', 400);
    }

    if (!validator.isEmail(email)) {
        throw new ApolloError('Wrong email format', 400);
    }

    const user = await prisma.user({
        email: email
    });

    log.trace('Login attempt: ', user.email);

    const result = await password_helper.verifyHashPassword(user.password_hash, password, user.password_salt);

    if (!result) {
        throw new ApolloError('Wrong password', 403)
    } else {
        await prisma.updateUser({
            where: {
                id: user.id
            },
            data: {
                last_login_date: new Date().toISOString()
            }
        });
        return {
            token: token.createToken(safeUser(user)),
            user: safeUser(user)
        };
    }
}

module.exports = {
    signUp: signUp,
    signIn: signIn
};
