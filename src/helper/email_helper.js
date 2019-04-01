'use strict';
const log = require('./logger').getLogger('email_helper');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const pug = require('pug');
const compiledLetterActivation = pug.compileFile(__dirname + '/../template/email_confirm_letter.pug');
const compiledLetterRestore = pug.compileFile(__dirname + '/../template/email_restore_letter.pug');
const prisma = require('./prisma_helper').prisma;
const GQLError = require('./GQLError');
const crypto = require('crypto');

let transporter = nodemailer.createTransport({
    host: config.mail_service.smtp_host,
    port: config.mail_service.smtp_port,
    secure: config.mail_service.secure,
    auth: {
        user: config.mail_service.username,
        pass: config.mail_service.password
    }
});

function generateNewCode() {
    const MAX = config.mail_service.activation_code.max_value;
    const MIN = config.mail_service.activation_code.min_value;

    function csprng(min, max) {
        const range = max - min;
        if (range >= Math.pow(2, 32))
            log.warn("Warning! Range is too large.");

        let tmp = range;
        let bitsNeeded = 0;
        let bytesNeeded = 0;
        let mask = 1;

        while (tmp > 0) {
            if (bitsNeeded % 8 === 0) bytesNeeded += 1;
            bitsNeeded += 1;
            mask = mask << 1 | 1;
            tmp = tmp >>> 1
        }

        const randomBytes = crypto.randomBytes(bytesNeeded);
        let randomValue = 0;

        for (let i = 0; i < bytesNeeded; i++) {
            randomValue |= randomBytes[i] << 8 * i
        }

        randomValue = randomValue & mask;

        if (randomValue <= range) {
            return min + randomValue
        } else {
            return csprng(min, max)
        }
    }

    const result = csprng(MIN, MAX);
    return result.toString();
}

async function generateActivationCode(email) {
    email = email.toLowerCase();

    const code = generateNewCode();

    const date = new Date();
    date.setMilliseconds(new Date().getMilliseconds() + config.mail_service.expiresInMs);

    log.trace(`generateActivationCode: email (${email}) code (${code}) date (${date.toISOString()})`);

    return await prisma.upsertActivationCode({
        where: {
            email: email
        },
        create: {
            email: email,
            code: code,
            valid_until: date
        },
        update: {
            code: code,
            valid_until: date,
            email: email
        }
    });
}

async function generateRestoreCode(email) {
    email = email.toLowerCase();

    const code = generateNewCode();

    const date = new Date();
    date.setMilliseconds(new Date().getMilliseconds() + config.mail_service.expiresInMs);

    log.trace(`generateRestoreCode: email (${email}) code (${code}) date (${date.toISOString()})`);

    return await prisma.upsertRestoreCode({
        where: {
            email: email
        },
        create: {
            email: email,
            code: code,
            valid_until: date
        },
        update: {
            code: code,
            valid_until: date,
            email: email
        }
    });
}

async function sendActivationEmail(email, code) {
    email = email.toLowerCase();

    return new Promise((resolve, reject) => {
        let mailOptions = {
            from: config.mail_service.from,
            to: email,
            subject: config.mail_service.subject,
            text: compiledLetterActivation({
                code: code
            }),
            html: compiledLetterActivation({
                code: code
            })
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                log.warn('Send email error', error);
                reject(error)
            } else {
                resolve(info)
            }
        });
    })
}

async function sendRestoreEmail(email, code) {
    email = email.toLowerCase();
    return new Promise((resolve, reject) => {
        let mailOptions = {
            from: config.mail_service.from,
            to: email,
            subject: config.mail_service.subject,
            text: compiledLetterRestore({
                code: code
            }),
            html: compiledLetterRestore({
                code: code
            })
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                log.warn('Send email error', error);
                reject(error)
            } else {
                resolve(info)
            }
        });
    })
}

async function verityActivationCode(email, code) {
    email = email.toLowerCase();

    const result = await prisma.activationCode({
        email: email
    });

    if (!result) throw new GQLError({message: 'Activation code was not generated', code: 404});

    if (new Date(result.valid_until) < new Date()) throw new GQLError({message: 'Activation code expired', code: 410});

    if (code === result.code) {
        await prisma.deleteActivationCode({
            email: email
        });

        return true
    } else {
        return false
    }
}

async function verityRestoreCode(email, code) {
    email = email.toLowerCase();

    const result = await prisma.restoreCode({
        email: email
    });

    if (!result) throw new GQLError({message: 'Restore code was not generated', code: 404});

    if (new Date(result.valid_until) < new Date()) throw new GQLError({message: 'Restore code expired', code: 410});

    if (code === result.code) {
        await prisma.deleteRestoreCode({
            email: email
        });

        return true
    } else {
        return false
    }
}

module.exports = {
    sendActivationEmail: sendActivationEmail,
    sendRestoreEmail: sendRestoreEmail,
    generateActivationCode: generateActivationCode,
    generateRestoreCode: generateRestoreCode,
    verityActivationCode: verityActivationCode,
    verityRestoreCode: verityRestoreCode,
};
