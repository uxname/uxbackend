'use strict';

const request = require("request");

// This is the function that generates an appender function
function stdoutAppender(layout, levels, config) {

    const silentLevel = levels.getLevel(config.silentAlertLevel);
    const audioLevel = levels.getLevel(config.audioAlertLevel);

    const botchat_params = {
        method: "GET",
        uri: "https://api.telegram.org/bot" + config.bottoken + "/sendMessage",
        qs: {
            chat_id: config.botchatid,
            parse_mode: "markdown"
        }
    };
    // This is the appender function itself
    // noinspection UnnecessaryLocalVariableJS
    const appender = (loggingEvent) => {
        const params = JSON.parse(JSON.stringify(botchat_params));
        if (silentLevel.isLessThanOrEqualTo(loggingEvent.level.levelStr)) {
            //console.log(`===== silentAlertLevel is less than loggingEvent level.`);
            if (audioLevel.isLessThanOrEqualTo(loggingEvent.level.levelStr)) {
                //console.log(`===== log telegram with sound`);

                Object.assign(params.qs, {
                    text: layout(loggingEvent),
                    disable_notification: false
                });
                request(params, (error, response, body) => {
                    if (error) {
                        console.log("Error sending to telegram:");
                        console.log(error);
                    }
                    /* else {
                                           console.log("Message sent to telegram:");
                                           console.log(body);
                                       }*/
                });
            } else {
                //console.log(`===== log telegram quietly`);
                Object.assign(params.qs, {
                    text: layout(loggingEvent),
                    disable_notification: true
                });
                request(params, (error, response, body) => {
                    if (error) {
                        console.log("Error sending to telegram:");
                        console.log(error);
                    }
                    /* else {
                                           console.log("Message sent to telegram:");
                                           console.log(body);
                                       } */
                });
            }
        }
        /* else {
                   console.log(`===== silentAlertLevel is greater than or equal to loggingEvent level.\n===== don't log telegram`);
               } */

        //process.stdout.write(`test: ${layout(loggingEvent)}\n`);
    };

    // add a shutdown function.
    /*
    appender.shutdown = (done) => {
        process.stdout.write('appender shutdown', done);
    };
    */

    return appender;
}

function configure(config, layouts, findAppender, levels) {

    // the default custom layout for this appender, not using the layouts module
    const layout = function (loggingEvent) {
        const header = `${loggingEvent.categoryName}: *${loggingEvent.level}*\n`;
        const timestamp = `*[${loggingEvent.startTime.toISOString().replace(/T/, ' ').replace(/\..+/, '')}]*\n`;
        const body = '```\n' + loggingEvent.data.map(d => {
            if (d)
                return d.toString();
            else if (d === null) {
                return 'null';
            } else if (d === undefined) {
                return 'undefined';
            } else {
                return 'undefined, or null, or other, please check logs in stdout';
            }
        }).join("\n") + '\n```';
        return header + timestamp + body;
    };

    //create a new appender instance
    return stdoutAppender(layout, levels, config);
}

//export the only function needed
exports.configure = configure;


