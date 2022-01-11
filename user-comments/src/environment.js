const dotEnv = require('dotenv');

dotEnv.config();

const env = {
    UCS: {
        NAME: `[${process.env.SERVICE_NAME}]`,

        HOSTNAME: process.env.SERVICE_HOSTNAME,
        // http://localhost

        PORT: process.env.PORT,
        // 5000

        REST_PATH: process.env.SERVICE_REST_PATH,
        // /api/ucs

        URI: `${process.env.SERVICE_HOSTNAME}:${process.env.PORT + process.env.SERVICE_REST_PATH}`,
        // http://localhost:5000/api/ucs

        SESS: {
            NAME: process.env.SESS_NAME,
            SECRET: process.env.SESS_SECRET
        }
    }
};

env.DB = {
    HOST: process.env.DATABASE_HOST,
    USER: process.env.DATABASE_USER,
    PASSWORD: process.env.DATABASE_PASSWORD,
    SCHEMA: process.env.DATABASE_SCHEMA,
    PORT: process.env.DATABASE_PORT
}

env.USM = {
    URI: `${process.env.UMS_HOSTNAME}:${process.env.UMS_PORT + process.env.UMS_REST_PATH}`
};

env.log = (method, uri, data, received) => {
    console.log(`${env.UCS.NAME} ${method} ${uri}`);

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
    process.stdout.write(`${env.UCS.NAME} ${message}`);

    if (data) {
        console.log(data);
    } else {
        console.log();
    }
};

module.exports = env;

