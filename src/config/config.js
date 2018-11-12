const production = process.env.NODE_ENV === 'production';

const config = {
    token_secret: "123",
    token_expiresIn: 30 * 24 * 60 * 60, // 30 days in seconds
    logger_config: {
        appenders: {
            out: {
                type: "stdout"
            },
            file_out_all: {
                type: 'file',
                filename: './logs/all/logs_all.log',
                maxLogSize: 10 * 1024 * 1024, // maximum size (in bytes) for the log file.
                backups: 50,
                compress: true
            },
            file_out_all_filter: {
                type: 'logLevelFilter',
                level: 'trace',
                appender: 'file_out_all'
            },
            file_out_trace: {
                type: 'file',
                filename: './logs/trace/logs_trace.log',
                maxLogSize: 10 * 1024 * 1024, // maximum size (in bytes) for the log file.
                backups: 50,
                compress: true
            },
            file_out_trace_filter: {
                type: 'logLevelFilter',
                level: 'trace',
                maxLevel: 'trace',
                appender: 'file_out_trace'
            },
            file_out_debug: {
                type: 'file',
                filename: './logs/debug/logs_debug.log',
                maxLogSize: 10 * 1024 * 1024, // maximum size (in bytes) for the log file.
                backups: 50,
                compress: true
            },
            file_out_debug_filter: {
                type: 'logLevelFilter',
                level: 'debug',
                maxLevel: 'debug',
                appender: 'file_out_debug'
            },
            file_out_info: {
                type: 'file',
                filename: './logs/info/logs_info.log',
                maxLogSize: 10 * 1024 * 1024, // maximum size (in bytes) for the log file.
                backups: 50,
                compress: true
            },
            file_out_info_filter: {
                type: 'logLevelFilter',
                level: 'info',
                maxLevel: 'info',
                appender: 'file_out_info'
            },
            file_out_warn: {
                type: 'file',
                filename: './logs/warn/logs_warn.log',
                maxLogSize: 10 * 1024 * 1024, // maximum size (in bytes) for the log file.
                backups: 50,
                compress: true
            },
            file_out_warn_filter: {
                type: 'logLevelFilter',
                level: 'warn',
                maxLevel: 'warn',
                appender: 'file_out_warn'
            },
            file_out_error: {
                type: 'file',
                filename: './logs/error/logs_error.log',
                maxLogSize: 10 * 1024 * 1024, // maximum size (in bytes) for the log file.
                backups: 50,
                compress: true
            },
            file_out_error_filter: {
                type: 'logLevelFilter',
                level: 'error',
                maxLevel: 'error',
                appender: 'file_out_error'
            },
            file_out_fatal: {
                type: 'file',
                filename: './logs/fatal/logs_fatal.log',
                maxLogSize: 10 * 1024 * 1024, // maximum size (in bytes) for the log file.
                backups: 50,
                compress: true
            },
            file_out_fatal_filter: {
                type: 'logLevelFilter',
                level: 'fatal',
                maxLevel: 'fatal',
                appender: 'file_out_fatal'
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
                    'file_out_all_filter',
                    'file_out_trace_filter',
                    'file_out_debug_filter',
                    'file_out_info_filter',
                    'file_out_warn_filter',
                    'file_out_error_filter',
                    'file_out_fatal_filter',
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
        mocks: false, // boolean or object
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
        from: 'zbrgubnaqs2hp2oy@ethereal.email',
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
    secure_memory_storage: {
        salt: 'wgEMdHhvzKfTGvEpXe9NExH9dS4rZT82nLyKe53sJQUWTYjh4UtpGzcD83USq223HuUU7Rc3ovr4oU97Af',
        storage_password: 'z3yoRJrLcQa3NfIq3aiHkMvWKrWuaiXFU3T8gh8tW5PeKEMjNziVu4yQtPnWWFD9uqyjSR553mMuqQqXgDKs6KT',
        // default access password is: precise-camera-afterlife-excavator-attentive-residence-imperfect
        access_password_hash: '$argon2i$v=19$m=4096,t=3,p=1$AKvnGjLpkRsgIHXYXdVxpw$Ik8DsudInTYtJ6v+H1zrAKiHRgfvrsNm72qCp5lqwbY',
        secure_memory_storage_server: {
            port: 9191,
            access_token: false //string or false
        }
    },
    compression: {
        level: -1 // https://github.com/expressjs/compression#level
    }
};

module.exports = config;
