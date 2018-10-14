const log = require('../helper/logger').getLogger('user_service');
const prisma = require('../helper/prisma_helper').prisma;
const password_helper = require('../helper/password_helper');
const token = require('../helper/token');
const GraphqlError = require('../helper/GraphqlError');
const validator = require('validator');
const emailHelper = require('../helper/email_helper');

function safeUser(userObject) {
    if (!userObject) return null;

    const newUser = userObject;
    delete newUser.password_hash;
    delete newUser.password_salt;
    return newUser;
}

async function signUp(email, password, step, activation_code) {
    if (!email) {
        throw new GraphqlError('Email is required', 400);
    }

    if (!validator.isEmail(email)) {
        throw new GraphqlError('Wrong email format', 400);
    }

    if (step === 'GENERATE_ACTIVATION_CODE') {
        const result = await emailHelper.generateActivationCode(email);

        await emailHelper.sendActivationEmail(email, result.code);
        return {
            status: 'ok'
        };
    } else if (step === 'CHECK_ACTIVATION_CODE') {
        const result = await emailHelper.verityActivationCode(email, activation_code);
        if (!result) {
            throw new GraphqlError('Wrong activation code', 403);
        } else {
            if (!password) {
                throw new GraphqlError('Password is required', 400);
            }

            const salt = password_helper.getSecureRandomString();

            const password_hash = await password_helper.hashPassword(password, salt);

            let newUser = null;
            try {
                newUser = await prisma.mutation.createUser({
                    data: {
                        email: email,
                        password_hash: password_hash,
                        password_salt: salt,
                        roles: {
                            set: ["USER"]
                        }
                    }
                }, `{ id email roles password_hash password_salt last_login_date }`);
            } catch (e) {
                log.trace(e);
                throw new GraphqlError(`User '${email}' already exists`, 409)
            }

            log.trace('User created: ', newUser.email);

            return {
                token: token.createToken(safeUser(newUser)),
                user: newUser
            };
        }
    }
}

async function signIn(email, password) {
    if (!email || !password) {
        throw new GraphqlError('Email and password required', 400);
    }

    if (!validator.isEmail(email)) {
        throw new GraphqlError('Wrong email format', 400);
    }

    const user = await prisma.query.user({
        where: {
            email: email
        }
    }, `{ id email roles password_hash password_salt last_login_date }`);

    log.trace('Login attempt: ', user.email);

    const result = await password_helper.verifyHashPassword(user.password_hash, password, user.password_salt);

    if (!result) {
        throw new GraphqlError('Wrong password', 403)
    } else {
        const res = await prisma.mutation.updateUser({
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
