'use strict';

module.exports = {
    environment: process.env.NODE_ENV || "local",
    winston: {
        level: "debug",
        fileName: "loganalytics.log"
    },
    postgres: {
        url: 'postgres://loguser:loguser@localhost:5432/logparser',
        tableName: process.env.LOGIN_DATABASE_TABLE_NAME || 'hostconnections'
    },
    analytics: {
        crond: process.env.ANALYTICS_CROND || '*/1 * * * *',
        starthost : 'quark',
        endhost : 'garak'
    }
    
};
