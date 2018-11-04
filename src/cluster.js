const log = require('./helper/logger').getLogger('cluster');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // "START NEW INSTANCE" log
    log.trace('\n\n\n███████╗████████╗ █████╗ ██████╗ ████████╗    ███╗   ██╗███████╗██╗    ██╗    ██╗███╗   ██╗███████╗████████╗ █████╗ ███╗   ██╗ ██████╗███████╗\n██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝    ████╗  ██║██╔════╝██║    ██║    ██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗████╗  ██║██╔════╝██╔════╝\n███████╗   ██║   ███████║██████╔╝   ██║       ██╔██╗ ██║█████╗  ██║ █╗ ██║    ██║██╔██╗ ██║███████╗   ██║   ███████║██╔██╗ ██║██║     █████╗\n╚════██║   ██║   ██╔══██║██╔══██╗   ██║       ██║╚██╗██║██╔══╝  ██║███╗██║    ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║╚██╗██║██║     ██╔══╝\n███████║   ██║   ██║  ██║██║  ██║   ██║       ██║ ╚████║███████╗╚███╔███╔╝    ██║██║ ╚████║███████║   ██║   ██║  ██║██║ ╚████║╚██████╗███████╗\n╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═╝  ╚═══╝╚══════╝ ╚══╝╚══╝     ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝\n\n');

    log.info(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        log.info(`worker ${worker.process.pid} died`);
    });

    cluster.on('online', function (worker) {
        log.info('Worker ' + worker.process.pid + ' is online');
    });

} else {
    require('./server');
}
