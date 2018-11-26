const argon2 = require('argon2');
const crypto = require('crypto');

function getSecureRandomString() {
    return crypto.randomBytes(32).toString('hex');
}

async function hashPassword(password, salt) {
    return await argon2.hash(salt + password);
}

async function verifyHashPassword(hash, password, salt) {
    return await argon2.verify(hash, salt + password);
}

module.exports = {
    hashPassword: hashPassword,
    verifyHashPassword: verifyHashPassword,
    getSecureRandomString: getSecureRandomString
};
