const crypto = require('crypto');
const argon2 = require('argon2');
const http = require('http');
const url = require('url');
const config = require('../config/config');
const log = require('./logger').getLogger('secure_mem_storage');

class Crypto {
    /**
     * Implmenetation of encrypt() and decrypt() taken from https://gist.github.com/AndiDittrich/4629e7db04819244e843,
     * which was recommended by @jaymode
     */
    constructor(opts) {

        _validateOpts(opts);
        const {encryptionKey} = opts;

        const IV_LENGTH_IN_BYTES = 12;
        const SALT_LENGTH_IN_BYTES = 64;
        const KEY_LENGTH_IN_BYTES = 32;
        const KEY_ITERATIONS = 10000;
        const KEY_DIGEST = 'sha512';
        const CIPHER_ALGORITHM = 'aes-256-gcm';
        const ENCRYPTION_RESULT_ENCODING = 'base64';

        function _validateOpts({encryptionKey}) {
            if (!encryptionKey) {
                throw new Error('encryptionKey is required');
            }
        }

        function _generateSalt() {
            return crypto.randomBytes(SALT_LENGTH_IN_BYTES);
        }

        function _generateIV() {
            return crypto.randomBytes(IV_LENGTH_IN_BYTES);
        }

        function _generateKey(encryptionKey, salt) {
            if (!Buffer.isBuffer(salt)) {
                salt = Buffer.from(salt, ENCRYPTION_RESULT_ENCODING);
            }

            return new Promise((resolve, reject) => {
                crypto.pbkdf2(encryptionKey, salt, KEY_ITERATIONS, KEY_LENGTH_IN_BYTES, KEY_DIGEST, (err, key) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (!Buffer.isBuffer(key)) {
                        key = Buffer.from(key, 'binary');
                    }

                    resolve(key);
                });
            });
        }

        function _serialize(obj) {
            return new Promise((resolve, reject) => {
                const serializedObj = JSON.stringify(obj);
                if (serializedObj === undefined) {
                    reject(new Error('Object to be encrypted must be serializable'));
                    return;
                }
                resolve(serializedObj);
            });
        }


        async function encrypt(input) {
            const salt = _generateSalt();

            return Promise.all([
                _serialize(input),
                _generateIV(),
                _generateKey(encryptionKey, salt)
            ])
                .then(results => {
                    const [serializedInput, iv, key] = results;
                    const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, key, iv);

                    const encrypted = Buffer.concat([cipher.update(serializedInput, 'utf8'), cipher.final()]);
                    const tag = cipher.getAuthTag();

                    return Buffer.concat([salt, iv, tag, encrypted]).toString(ENCRYPTION_RESULT_ENCODING);
                });
        }

        async function decrypt(output) {

            const outputBytes = Buffer.from(output, ENCRYPTION_RESULT_ENCODING);

            const salt = outputBytes.slice(0, SALT_LENGTH_IN_BYTES);
            const iv = outputBytes.slice(SALT_LENGTH_IN_BYTES, SALT_LENGTH_IN_BYTES + IV_LENGTH_IN_BYTES);
            const tag = outputBytes.slice(SALT_LENGTH_IN_BYTES + IV_LENGTH_IN_BYTES, SALT_LENGTH_IN_BYTES + IV_LENGTH_IN_BYTES + 16); // Auth tag is always 16 bytes long
            const text = outputBytes.slice(SALT_LENGTH_IN_BYTES + IV_LENGTH_IN_BYTES + 16);

            const key = await _generateKey(encryptionKey, salt);
            const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, key, iv);
            decipher.setAuthTag(tag);

            const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
            return JSON.parse(decrypted);
        }

        this.encrypt = encrypt;
        this.decrypt = decrypt;
    }
}

let secureMemStorage = {
    access_password_hash: undefined,
    dataMap: undefined,
    cryptor: undefined,
    salt: undefined
};

async function hashPassword(password) {
    return await argon2.hash(secureMemStorage.salt + password);
}

async function verifyHashPassword(hash, password) {
    return await argon2.verify(hash, secureMemStorage.salt + password);
}

function init({storage_password, access_password_hash, salt}) {
    if (!storage_password || !access_password_hash || !salt) {
        throw Error('Not enough parameters');
    }
    secureMemStorage = {
        access_password_hash: access_password_hash,
        dataMap: new Map(),
        salt: salt,
        cryptor: new Crypto({
            encryptionKey: storage_password
        })
    };
}

async function setValue(key, value, access_password) {
    if (!key || !value || !access_password) {
        throw new Error('Not enough parameters');
    }

    if (await verifyHashPassword(secureMemStorage.access_password_hash, access_password)) {
        const encrypted = await secureMemStorage.cryptor.encrypt(value);
        secureMemStorage.dataMap.set(key, encrypted);
    } else {
        throw Error('Wrong access password');
    }
}

function getKeys() {
    return Array.from(secureMemStorage.dataMap.keys());
}

async function getValue(key) {
    try {
        return await secureMemStorage.cryptor.decrypt(secureMemStorage.dataMap.get(key));
    } catch (err) {
        return null;
    }
}

function isLocalhost(url) {
    return url === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        url === '[::1]' || url === '::1' ||
        // 127.0.0.1/8 is considered localhost for IPv4.
        url.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        )
}

class SecureMemStorageServer {

    constructor({port, access_token = false}) {
        if (!port) {
            throw Error('Undefined port');
        }
        this.port = port;
        this.access_token = access_token;

        function delay(ms) {
            return new Promise(function (resolve, reject) {
                setTimeout(resolve, ms);
            });
        }

        this.httpServer = http.createServer(async (req, res) => {
            const processRequest = async function () {
                if (!isLocalhost(req.connection.remoteAddress)) {
                    return res.end('Only localhost accepted');
                }
                const request = url.parse(req.url, true);
                const {pathname, query} = request;
                if (pathname === '/set') {
                    const {key, value, access_password, access_token} = query;
                    if (this.access_token) {
                        if (this.access_token !== access_token) {
                            return res.end('Wrong access_token');
                        }
                    }
                    try {
                        await setValue(key, value, access_password);
                        res.end(`Key [${key}] set successful!`);
                    } catch (err) {
                        res.end(`Key [${key}] set error: ${err.message}`);
                    }
                } else {
                    res.end('Unknown command, please use "/set?key=abc&value=abc&access_password=abc[&access_token=abc]"')
                }
            }.bind(this);

            await delay(3000); //manual delay to prevent bruteforce
            await processRequest();
        });
    }

    start() {
        log.trace(`Starting SecureMemStorageServer at ${this.port} port`);
        this.httpServer.listen(this.port, '127.0.0.1');
    }

    stop() {
        log.trace(`Stopping SecureMemStorageServer at ${this.port} port`);
        this.httpServer.close();
    }

}

init({
    salt: config.secure_memory_storage.salt,
    storage_password: config.secure_memory_storage.storage_password,
    access_password_hash: config.secure_memory_storage.access_password_hash
});

module.exports = {
    SecureMemStorageServer: SecureMemStorageServer,
    init: init,
    getKeys: getKeys,
    getValue: getValue,
    setValue: setValue,
    hashPassword: hashPassword
};
