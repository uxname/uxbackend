'use strict';
const log = require('./logger').getLogger('email_helper');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const pug = require('pug');
const compiledLetter = pug.compileFile(__dirname + '/../template/email_confirm_letter.pug');
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
            console.log("Warning! Range is too large.");

        var tmp = range;
        var bitsNeeded = 0;
        var bytesNeeded = 0;
        var mask = 1;

        while (tmp > 0) {
            if (bitsNeeded % 8 === 0) bytesNeeded += 1;
            bitsNeeded += 1;
            mask = mask << 1 | 1;
            tmp = tmp >>> 1
        }
        const randomBytes = crypto.randomBytes(bytesNeeded);
        var randomValue = 0;

        for (var i = 0; i < bytesNeeded; i++) {
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
    const code = generateNewCode();

    const date = new Date();
    date.setMilliseconds(new Date().getMilliseconds() + config.mail_service.expiresInMs);

    return await prisma.upsertActivationCode({
        where: {
            email: email
        },
        create: {
            email: email,
            code: code,
            valid_until: date.toISOString()
        },
        update: {
            code: code
        }
    });
}

async function sendActivationEmail(email, code) {
    return new Promise((resolve, reject) => {
        let mailOptions = {
            from: config.mail_service.from,
            to: email,
            subject: config.mail_service.subject,
            text: compiledLetter({
                code: code
            }),
            html: compiledLetter({
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

module.exports = {
    sendActivationEmail: sendActivationEmail,
    generateActivationCode: generateActivationCode,
    verityActivationCode: verityActivationCode
};
