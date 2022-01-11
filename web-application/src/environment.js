const dotEnv = require('dotenv');

dotEnv.config();

const env = {
    WA: {
        NAME: `[${process.env.SERVICE_NAME}]`,

        HOSTNAME: process.env.SERVICE_HOSTNAME,
        // http://localhost

        PORT: process.env.PORT,
        // 8080

        URI: `${process.env.SERVICE_HOSTNAME}:${process.env.PORT}`,
        // http://localhost:8080

        SESS: {
            NAME: process.env.SESS_NAME,
            SECRET: process.env.SESS_SECRET
        }
    },

    UMS: {
        URI: `${process.env.UMS_HOSTNAME}:${process.env.UMS_PORT + process.env.UMS_REST_PATH}`
        // http://localhost:4000/api/ums
    },

    UCS: {
        URI: `${process.env.UCS_HOSTNAME}:${process.env.UCS_PORT + process.env.UCS_REST_PATH}`
        // http://localhost:5000/api/ucs
    },

    SCS: {
        URI: `${process.env.SCS_HOSTNAME}:${process.env.SCS_PORT + process.env.SCS_REST_PATH}`,
        // http://localhost:3000/api/scs
    },
};

env.log = (method, uri, data, received) => {
    console.log(`${env.WA.NAME} ${method} ${uri}`);

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
    process.stdout.write(`${env.WA.NAME} ${message}`);

    if (data) {
        console.log(data);
    } else {
        console.log();
    }
};

module.exports = env;