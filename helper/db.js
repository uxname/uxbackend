const log = require('../helper/logger').getLogger('db');
const pg = require('pg');
const config = require('../config/config');

const pgPool = new pg.Pool({
    host: config.database.host,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port,
    max: config.database.pool_settings.max, // set pool max size
    min: config.database.pool_settings.min, // set min pool size
    idleTimeoutMillis: config.database.pool_settings.idleTimeoutMillis, // close idle clients after N second
});

async function connect() {
    log.debug('Connection to database...');
    const result = await pgPool.connect();
    const res = await pgPool.query('SELECT datname FROM pg_database');
    log.debug('Connected -> Databases:\n', res.rows);
    return result;
}

module.exports = {
    pgPool: pgPool,
    connect: connect
};

