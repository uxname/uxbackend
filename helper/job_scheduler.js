const Agenda = require('agenda');
const Agendash = require('agendash');
const config = require('../config/config');

function getAgenda(expressServer = null, protectAccessMiddleware = null) {
    const agenda = new Agenda();
    agenda.database(`${config.mongodb.host}:${config.mongodb.port}/${config.job_scheduler.database_name}`);
    agenda.processEvery(config.job_scheduler.process_every);

    if (config.job_scheduler.enable_web_interface && expressServer) {
        expressServer.use(config.job_scheduler.web_interface_path, protectAccessMiddleware, Agendash(agenda));
    }

    return agenda;
}

module.exports = {
    getAgenda: getAgenda
};
