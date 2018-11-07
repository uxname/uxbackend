const log = require('../helper/logger').getLogger('system_resolver');
const pkgjson = require('../../package.json');
const config = require('../config/config');
const os = require('os');
const moment = require('moment');
const prisma = require('../helper/prisma_helper').prisma;

let pool;

function init(pgPool) {
    pool = pgPool
}

async function systemInfo() {
    log.trace('systemInfo()');
    const used = process.memoryUsage();
    let node_mem_usage = [];
    for (let key in used) {
        // noinspection JSUnfilteredForInLoop
        node_mem_usage.push(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }

    const user_count = (await prisma.usersConnection().$fragment('{ aggregate { count } }')).aggregate.count;

    const uptime = moment.duration(process.uptime() * 1000);

    let activation_codes = await prisma.activationCodes().$fragment('{ email code }');

    return {
        title: `${pkgjson.name}`,
        version: pkgjson.version.toString(),
        uptime: `${uptime.years()} years, ${uptime.months()} months, ${uptime.days()} days, ${uptime.hours()} hours, ${uptime.minutes()} min, ${uptime.seconds()} sec`,
        node_mem_usage: node_mem_usage,
        platform: os.platform(),
        os_type: os.type(),
        cpu_count: os.cpus().length,
        os_total_mem: Math.round(os.totalmem() / 1024 / 1024) + ' MB',
        os_free_mem: Math.round(os.freemem() / 1024 / 1024) + ' MB',
        user_count: user_count,
        other_info: {
            'DDoS protection config': config.ddos_protection,
            'Activation codes': activation_codes
        }
    };
}

module.exports = {
    init: init,
    systemInfo: systemInfo
};
