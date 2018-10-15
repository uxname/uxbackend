const log = require('../helper/logger').getLogger('user_router');
const prisma = require('../helper/prisma_helper').prisma;
const token = require('../helper/token');
const multer = require('multer');
const router = require('express').Router();
const upload = multer({
    dest: './uploads/user_avatars'
});

//todo add check for file max size

//todo add check for upload error (ex.: file is undefined). Add check for userId is specified
router.post('/avatar', upload.single('avatar'), async function (req, res) {
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
        const result = await prisma.mutation.updateUser({
            data: {avatar: req.file.filename},
            where: {id: userId}
        });
    } catch (e) {
        res.status(404).json({
            result: 'User not found'
        });
        return;
    }

    res.status(200).json({
        result: 'ok'
    });
});

module.exports = {
    router: router,
    path: '/user'
};
