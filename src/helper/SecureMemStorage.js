const crypto = require('crypto');
const http = require('http');
const url = require('url');
const log = require('./logger').getLogger('secure_mem_storage');
const request = require('request');

function isLocalhost(url) {
    return url === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        url === '[::1]' || url === '::1' ||
        // 127.0.0.1/8 is considered localhost for IPv4.
        url.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        )
}

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

class SecureMemStorage {
    constructor({master_password}) {
        if (!master_password) throw Error('Master password is required');

        this.master_password = master_password;
        this.crypto = new Crypto({encryptionKey: this.master_password});
        this.dataMap = new Map();
    }

    async setValue(key, value, master_password) {
        if (this.master_password !== master_password) throw new Error('Wrong master_password');
        this.dataMap.set(key, await this.crypto.encrypt(value));
    }

    async getValue(key, master_password) {
        if (this.master_password !== master_password) throw new Error('Wrong master_password');
        if (!this.dataMap.get(key)) throw new Error(`Key doesn't exists`);
        return await this.crypto.decrypt(this.dataMap.get(key));
    }
}

class SecureMemStorageServer {
    constructor({port}) {
        const thisLink = this;
        this.port = port;
        this.httpServer = http.createServer(async (req, res) => {
            if (!isLocalhost(req.connection.remoteAddress)) return res.end('Only localhost accepted');
            const request = url.parse(req.url, true);
            const {pathname, query} = request;

            const {master_password, key, value} = query;

            switch (pathname) {
                case '/init':
                    if (!master_password) {
                        res.end('master_password is required');
                    } else {
                        thisLink.sms = new SecureMemStorage({master_password});
                        res.end('ok');
                    }
                    break;
                case '/set':
                    if (!thisLink.sms) {
                        res.end('Secure memory storage was not initialized');
                    } else {
                        try {
                            await thisLink.sms.setValue(key, value, master_password);
                            res.end('ok');
                        } catch (e) {
                            res.end('error');
                        }
                    }
                    break;
                case '/get':
                    if (!thisLink.sms) {
                        res.end('Secure memory storage was not initialized');
                    } else {
                        try {
                            res.end(await thisLink.sms.getValue(key, master_password));
                        } catch (e) {
                            res.end('error');
                        }
                    }
                    break;
                default:
                    res.end('Unknown command');
                    break;
            }
        });
    }

    start() {
        this.httpServer.listen(this.port, '127.0.0.1');
    }

    stop() {
        this.httpServer.close();
    }
}

class SecureMemStorageServerWrapper {
    constructor({port}) {
        this.port = port;
    }

    async init(master_password) {
        request({url: `http://127.0.0.1:${this.port}/init`, qs: {master_password}}, (err, res, body) => {
            if (err) throw new Error(err.message);
            return body;
        })
    }

    async setValue(key, value, master_password) {
        return new Promise((resolve, reject) => {
            request({url: `http://127.0.0.1:${this.port}/set`, qs: {key, value, master_password}}, (err, res, body) => {
                if (err) return reject(err);
                resolve(body);
            })
        });
    }

    async getValue(key, master_password) {
        return new Promise((resolve, reject) => {
            request({url: `http://127.0.0.1:${this.port}/get`, qs: {key, master_password}}, (err, res, body) => {
                if (err) return reject(err);
                resolve(body);
            })
        });
    }
}

module.exports = {
    SecureMemStorageServerWrapper,
    SecureMemStorageServer
};
