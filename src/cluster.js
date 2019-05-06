const log = require('./helper/logger').getLogger('cluster');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const {SecureMemStorageServer, SecureMemStorageServerWrapper} = require('./helper/SecureMemStorage');
const config = require('./config/config');

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

    (async () => {
        const smss = new SecureMemStorageServer({port: config.secure_memory_storage.secure_memory_storage_server.port});
        const smssw = new SecureMemStorageServerWrapper({port: config.secure_memory_storage.secure_memory_storage_server.port});
        await smssw.init(config.secure_memory_storage.master_password);

        smss.start();
    })()

} else {
    require('./server');
}
