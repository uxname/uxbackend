const express = require('express');
const router = express.Router();

router.use('/', express.static(__dirname + '/games/platformer'));

module.exports = {
    router: router,
    path: '/game'
};
