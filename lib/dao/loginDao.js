const Pool = require('pg').Pool;
const url = require('url');
const config = require('../../config/env/').postgres;
const conn = setPGConnection(config);
const pool = new Pool(conn);
const app = require('../../lib/app');

module.exports = {
    hostNamesConnectedTo: hostNamesConnectedTo,
    hostNamesConnectionsFrom: hostNamesConnectionsFrom,
    hostNameMostConnected: hostNameMostConnected
};

pool.on('error', (error, client) => {
    app.logger.log('error', 'error in postgres pool: ' + error);
});

//Parse url to PS config
function setPGConnection(options) {
    const params = url.parse(options.url);
    const auth = params.auth.split(':');
    const dbase = params.pathname.split('/')[1];

    if (!params || !auth || !dbase) {
        app.logger.log('error', 'error in postgres URL: ' + options.url);
        throw Error("Error in postgres URL");
    }

    const config = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: dbase,
    };


    return config;
}

//Get hostnames connected to config endhost
function hostNamesConnectedTo(endhost) {
    return new Promise((fullfil, reject) => {
        pool.query('SELECT DISTINCT starthost FROM hostconnections WHERE endhost = $1 AND conndate BETWEEN now() - interval \'1 hour\' and now();', [endhost],
            function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    fullfil(result);
                }
            });

    });
}
//Get hostnamees connections from starthost
function hostNamesConnectionsFrom(starthost) {
    return new Promise((fullfil, reject) => {
        pool.query('SELECT COUNT(*) FROM hostconnections WHERE starthost = $1 AND conndate BETWEEN now() - interval \'1 hour\' AND now();', [starthost],
            function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    fullfil(result);
                }
            });

    });
}

//Get the host most connected in las hour
function hostNameMostConnected() {
    return new Promise((fullfil, reject) => {
        pool.query('SELECT starthost, COUNT(*) AS count FROM hostconnections WHERE conndate BETWEEN now() - interval \'1 hour\' AND now() GROUP BY starthost ORDER BY count DESC LIMIT 1;',
            function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    fullfil(result);
                }
            });

    });
}
