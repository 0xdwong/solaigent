import * as log4js from 'log4js';
import { LoggerService } from '@nestjs/common';

let config = {
    appenders: {
        console: {
            type: 'console',
        },
        file: {
            type: 'dateFile',
            filename: 'logs/log',
            pattern: '.yyyy-MM-dd',
            numBackups: 30, //保留1个月
        },
    },
    categories: {
        default: {
            appenders: ['console', 'file'],
            level: process.env.LOGGER_LEVEL || 'debug',
        },
    },
    pm2: true
};

export class MyLogger implements LoggerService {
    logger: log4js.Logger;

    constructor() {
        let x = log4js;
        log4js.configure(config);
        this.logger = log4js.getLogger();
        this.logger.level = process.env.LOGGER_LEVEL || 'debug';
    }

    log(message: any, ...optionalParams: any[]) {
        this.logger.info(message, ...optionalParams);
    }

    error(message: any, ...optionalParams: any[]) {
        this.logger.error(message, ...optionalParams);
    }

    warn(message: any, ...optionalParams: any[]) {
        this.logger.warn(message, ...optionalParams);
    }

    debug?(message: any, ...optionalParams: any[]) {
        this.logger.debug(message, ...optionalParams);
    }

    verbose?(message: any, ...optionalParams: any[]) {
        this.logger.trace(message, ...optionalParams);
    }
}