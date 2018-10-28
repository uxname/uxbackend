const log = require('./logger').getLogger('job_scheduler');
const Agenda = require('agenda');
const Agendash = require('agendash');
const config = require('../config/config');

function getAgenda(expressServer = null, protectAccessMiddleware = null) {
    const agenda = new Agenda();
    agenda.database(`${config.mongodb.host}:${config.mongodb.port}/${config.job_scheduler.database_name}`, null, {
        useNewUrlParser: true
    });
    agenda.processEvery(config.job_scheduler.process_every);
    agenda.defaultLockLifetime(config.job_scheduler.timeout_in_ms);

    if (config.job_scheduler.enable_web_interface && expressServer) {
        expressServer.use(config.job_scheduler.web_interface_path, protectAccessMiddleware, Agendash(agenda));
    }

    addGracefulExitHandler(agenda);
    return agenda;
}

async function addGracefulExitHandler(agenda) {
    async function gracefulExit() {
        log.debug('Graceful agenda exit...');
        await agenda.stop();
        process.exit(0);
    }

    process.on('SIGTERM', gracefulExit);
    process.on('SIGINT', gracefulExit);
}


module.exports = {
    getAgenda: getAgenda
};
