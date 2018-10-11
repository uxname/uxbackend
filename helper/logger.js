const log4js = require('log4js');
const config = require('../config/config');
const pkg = require('../package');

log4js.configure(config.logger_config);

/**
 * Returns log4js object.
 * @example
 * const logger = require('./logger').getLogger('cheese');
 * logger.trace('Entering cheese testing');
 * logger.debug('Got cheese.');
 * logger.info('Cheese is Comté.');
 * logger.warn('Cheese is quite smelly.');
 * logger.error('Cheese is too ripe!');
 * logger.fatal('Cheese was breeding ground for listeria.');
 *
 * @type {Logger}
 */

function getLogger(name) {
    return log4js.getLogger(pkg.name + '.' + name)
}

module.exports.getLogger = getLogger;
module.exports.log4js = log4js;
