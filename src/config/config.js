const production = process.env.NODE_ENV === 'production';

const config = {
    token_secret: "123",
    token_expiresIn: 30 * 24 * 60 * 60, // 30 days in seconds
    logger_config: {
        appenders: {
            out: {
                type: "stdout"
            },
            fileOut: {
                type: 'file',
                filename: './logs/logs.log',
                maxLogSize: 10 * 1024 * 1024, // maximum size (in bytes) for the log file.
                backups: 50,
                compress: true
            },
            telegramAlert: {
                type: __dirname + '/../helper/log4js_telegram_appender',
                silentAlertLevel: 'error',
                audioAlertLevel: 'error',
                bottoken: '123',
                botchatid: 0 // Use @myidbot bot to get dialog id
            },
            telegramAlertDebug: {
                type: __dirname + '/../helper/log4js_telegram_appender',
                silentAlertLevel: 'debug',
                audioAlertLevel: 'error',
                bottoken: '123',
                botchatid: 0 // Use @myidbot bot to get dialog id
            }
        },
        categories: {
            default: {
                appenders: [
                    'out',
                    'fileOut',
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
        database: process.env.POSTGRES_DB || "prisma",
        port: process.env.POSTGRES_PORT || 5445,
        pool_settings: {
            max: 50,
            min: 4,
            idleTimeoutMillis: 1000
        }
    },
    redis: {
        host: production ? 'redis' : 'localhost',
        port: 6379
    },
    mongodb: {
        host: process.env.MONGODB_HOST || "localhost",
        port: process.env.MONGODB_PORT || 27017
    },
    job_scheduler: {
        database_name: 'agenda',
        process_every: '10 seconds',
        timeout_in_ms: 3 * 60 * 1000,
        enable_web_interface: true,
        web_interface_path: '/jobs_dashboard'
    },
    graphql: {
        endpoint_path: "/api",
        playground: "/api", // string or false
        tracing: true,
        maximumCost: 100,
        defaultCost: 1,
        mocks: false,
    },
    ddos_protection: {
        windowMs: 1000 * 60 * 15,
        max: 100000,
        message: '{ "error": "Too many requests" }'
    },
    mail_service: {
        secure: false, // true for 465, false for other ports
        activation_code: {
            min_value: 111111,
            max_value: 999999
        },
        subject: "Your activation code",
        expiresInMs: 1000 * 60 * 60, //1h
        smtp_host: 'smtp.ethereal.email',
        smtp_port: 587,
        username: 'zbrgubnaqs2hp2oy@ethereal.email',
        password: 'JxQugxEYhWfeeGc7jM'
    },
    uploads: {
        max_user_avatar_size_in_bytes: 250 * 1024 // 250 KB
    },
    maintenance_mode: {
        maintenance_mode_enabled: true,
        message: 'Sorry, we are down for maintenance',
        allowed_hosts: [
            '127.1.0.1',
            '::1',
            '::ffff:127.0.0.1'
        ]
    },
    compression: {
        level: -1 // https://github.com/expressjs/compression#level
    }
};

module.exports = config;
