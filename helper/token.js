const jwt = require('jsonwebtoken');
const config = require('../config/config');

function createToken(user) {
    return jwt.sign(user, config.token_secret, {expiresIn: config.token_expiresIn});
}

function validateToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.token_secret, function (err, decoded) {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    })
}

module.exports = {
    createToken: createToken,
    validateToken: validateToken
};
