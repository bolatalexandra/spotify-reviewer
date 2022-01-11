const dotEnv = require('dotenv');

dotEnv.config();

const env = {
    SCS: {
        NAME: `[${process.env.SERVICE_NAME}]`,
        // [SAS]

        HOSTNAME: process.env.SERVICE_HOSTNAME,
        // http://localhost

        PORT: process.env.PORT,
        // 3000

        REST_PATH: process.env.SERVICE_REST_PATH,
        // /api/scs

        URI: `${process.env.SERVICE_HOSTNAME}:${process.env.PORT + process.env.SERVICE_REST_PATH}`,
        // http://localhost:3000/api/sas

        SESS: {
            NAME: process.env.SESS_NAME,
            SECRET: process.env.SESS_SECRET
        }
    }
};

env.SCS.SPOTIFY = {
    CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    STATE_KEY: process.env.SPOTIFY_STATE_KEY,
};

env.USM = {
    URI: `${process.env.UMS_HOSTNAME}:${process.env.UMS_PORT + process.env.UMS_REST_PATH}`
};

env.log = (method, uri, data, received) => {
    console.log(`${env.SCS.NAME} ${method} ${uri}`);

    if (received === true) {
        process.stdout.write('⤶ ');
    } else if (received === false) {
        process.stdout.write('⤷ ');
    }

    if (data) {
        console.log(data);
    }
};

env.message = (message, data) => {
    process.stdout.write(`${env.SCS.NAME} ${message}`);

    if (data) {
        console.log(data);
    } else {
        console.log();
    }
};

module.exports = env;

