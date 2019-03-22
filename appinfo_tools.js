process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const log = require('./src/helper/logger').getLogger('appinfo');
const appinfo = require('./appinfo');
const fs = require('fs');
const path = require('path');
const arg = process.argv[2] === 'app_services.js' ? process.argv[3] : process.argv[2];
const appinfo_filename = path.normalize(__dirname + '/appinfo.json');

function saveAppInfo(appInfoObject) {
    fs.writeFileSync(appinfo_filename, JSON.stringify(appInfoObject, null, 2), 'utf-8');
}

function showAppInfo(appinfo, pretty_format = true) {
    const data = pretty_format ? JSON.stringify(appinfo, null, 2) : JSON.stringify(appinfo);
    log.debug(data);
}

switch (arg) {
    case 'show':
        showAppInfo(appinfo);
        break;
    case 'update':
        if (process.env.NODE_ENV !== 'development') {
            log.debug(`AppInfo update: skip (process.env.NODE_ENV is not 'development')`);
            return;
        }
        appinfo.build.number += 1;
        appinfo.build.date = new Date().toUTCString();
        saveAppInfo(appinfo);
        log.debug('AppInfo updated:');
        showAppInfo(appinfo, false);
        break;
    default:
        log.debug(`Allowed commands: show, update.\n\tYou entered: "${arg}"`);
        break;
}
