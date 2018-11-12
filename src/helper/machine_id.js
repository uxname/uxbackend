const os = require('os');
const crypto = require('crypto');

function getMachineId() {
    let machineIdString = '';

    // mac addresses
    const interfaces = os.networkInterfaces();
    const interfaceNames = Object.keys(interfaces);
    const macAddresses = new Set();

    for (const interfaceName of interfaceNames) {
        for (const iface of interfaces[interfaceName]) {
            macAddresses.add(iface.mac);
        }
    }

    machineIdString += [...macAddresses.values()].sort().join('/') + '|';

    // memory
    machineIdString += os.totalmem() + '|';

    // cpu info
    const cpuInfo = os.cpus();
    machineIdString += cpuInfo[0].model + '/' + cpuInfo.length;

    return crypto.createHash('sha1').update(machineIdString).digest("hex");
}

function getShortMachineId() {
    const mid = getMachineId();
    return mid.substring(0, 4) + '-' + mid.substring(mid.length - 4, mid.length);
}

module.exports.machineId = getMachineId();
module.exports.shortMachineId = getShortMachineId();

