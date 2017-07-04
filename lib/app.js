const fslogger = require('../modules/logger')
const config = require('../config/env');
const moment = require('moment-timezone');
const logindao = require('../lib/dao/logindao');
const schedule = require('node-schedule');
const app = module.exports;
var logger;



module.exports = {
    start: start,
};

function start() {
    configureLogger();

    //alerta de errores
    let job = schedule.scheduleJob(config.analytics.crond, printAnalytics);
};



function printAnalytics() {

    let date = moment(new Date()).tz('Europe/Madrid').format('YYYY-MM-DD HH:mm:SS');
    app.logger.log('info', 'Analytics: time ' + date);
    logindao.hostNamesConnectedTo(config.analytics.endhost).then((data) => {
        let response = 'Analytics: list of hostnames connected to ' + config.analytics.endhost + ' in last hour: ';
        if (!data || data.rowCount === 0) {
            app.logger.log('info', response + ' NO DATA');
        } else {
            let listhosts = '';
            data.rows.forEach((row) => {
                listhosts += row.starthost + ' ';
            });
            app.logger.log('info', response + listhosts);
        }


    }).catch((err) => {
        app.logger.log('error', 'error procesing query: ' + err);
    });
    logindao.hostNamesConnectionsFrom(config.analytics.starthost).then((data) => {
        let response = 'Analytics: hostnames connections from ' + config.analytics.starthost + ' in last hour: ';

        if (!data || data.rowCount === 0 || ~~data.rows[0].count === 0)
            app.logger.log('info', response + ' NO DATA');
        else
            app.logger.log('info', response + data.rows[0].count);



    }).catch((err) => {
        app.logger.log('error', 'error procesing query: ' + err);
    });
    logindao.hostNameMostConnected().then((data) => {
        let response = 'Analytics: hostname most connected in last hour: ';
        if (!data || data.rowCount === 0 || ~~data.rows[0].count === 0)
            app.logger.log('info', response + ' NO DATA');
        else
            app.logger.log('info', response + ' hostname: ' + data.rows[0].starthost + ', count: ' + data.rows[0].count);


    }).catch((err) => {
        app.logger.log('error', 'error procesing query: ' + err);
    });
};



function configureLogger() {
    logger = fslogger.configureLogger();
    app.logger = logger;
    logger.log('info', 'Initializing app analytics!');
}





