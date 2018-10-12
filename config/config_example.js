const config = {
    token_secret: "123",
    token_expiresIn: 30 * 24 * 60 * 60, //30 days in seconds
    logger_config: {
        appenders: {
            out: {
                type: "stdout"
            },
            telegramAlert: {
                type: './helper/log4js_telegram_appender',
                silentAlertLevel: 'error',
                audioAlertLevel: 'error',
                bottoken: '123',
                botchatid: 0 // Use @myidbot bot to get dialog id
            },
            telegramAlertDebug: {
                type: './helper/log4js_telegram_appender',
                silentAlertLevel: 'info',
                audioAlertLevel: 'error',
                bottoken: '123',
                botchatid: 0 // Use @myidbot bot to get dialog id
            }
        },
        categories: {
            default: {
                appenders: [
                    'out',
                    'telegramAlert',
                    'telegramAlertDebug'
                ],
                level: "trace"
            }
        }
    },
    port: 4000,
    database: {
        host: process.env.POSTGRES_HOST || "localhost",
        user: process.env.POSTGRES_USER || "postgres",
        password: process.env.POSTGRES_PASSWORD || "postgres",
        database: process.env.POSTGRES_DB || "uxbackend",
        port: process.env.POSTGRES_PORT || 5432,
        pool_settings: {
            max: 50,
            min: 4,
            idleTimeoutMillis: 1000
        }
    },
    graphql: {
        endpoint_path: "/api",
        tracing: true,
        playground: {
            settings: {
                "editor.cursorShape": "line",
                "editor.theme": "light",
                "tracing.hideTracingResponse": false
            }
        }
    },
    ddos_protection: {
        windowMs: 1000 * 60 * 15,
        max: 100000,
        message: '{ "error": "Too many requests" }'
    },
    mail_service: {
        
    }
};

module.exports = config;
