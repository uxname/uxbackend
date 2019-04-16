const log = require('../helper/logger').getLogger('user_router');
const fs = require('fs');
const path = require('path');
const prisma = require('../helper/prisma_helper').prisma;
const config = require('../config/config');
const token = require('../helper/token');
const multer = require('multer');
const router = require('express').Router();

const UPLOADS_DIR = `${__dirname}/../../uploads/user_avatars`;

const upload = multer({
    dest: UPLOADS_DIR,
    limits: {
        fileSize: config.uploads.max_user_avatar_size_in_bytes,
        files: 1
    }
});

//todo fix multer error sending to client

router.post('/avatar', upload.single('avatar'), async function (req, res) {
    if (!req.file) {
        res.status(401).json({
            result: 'Avatar in body parameter "avatar" is required'
        });
        return;
    }

    let user;
    try {
        user = await token.validateToken(req.body.token);
    } catch (e) {
        res.status(401).json({
            result: 'Token in body parameter "token" is required'
        });
        return;
    }
    const userId = user.id;
    log.trace('Change user avatar request', {user_id: user.id});

    try {
        const result = await prisma.updateUser({
            where: {id: userId},
            data: {avatar: `/user/avatar?file_id=${req.file.filename}`}
        });
    } catch (e) {
        res.status(404).json({
            result: 'User not found'
        });
        try {
            fs.unlinkSync(`./uploads/user_avatars/${req.file.filename}`);
        } catch (e) {
            log.warn(`Can't delete file:`, e);
        }
        return;
    }

    res.status(200).json({
        result: 'ok',
        file_url: `/user/avatar?file_id=${req.file.filename}`
    });
});

router.get('/avatar', function (req, res) {
    const file_id = req.query.file_id.replace(/([^a-z0-9\s]+)/gi, '_');

    const fn = path.normalize(`${UPLOADS_DIR}/${file_id}`);

    if (!fs.existsSync(fn) || !fs.lstatSync(fn).isFile()) {
        return res.status(404).json({
            message: 'File not found'
        });
    }

    res.sendFile(
        fn,
        {
            headers: {
                'Content-Type': 'image/jpeg'
            }
        }
    );
});

module.exports = {
    router: router,
    path: '/user'
};
