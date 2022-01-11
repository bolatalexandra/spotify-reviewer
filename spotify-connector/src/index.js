const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const env = require('./environment');
const router = require('./routes');

console.log(env);

const app = express();

app.use(cors())
   .use(cookieParser())
   .use(express.json())
   .use(expressSession({
        name: env.SCS.SESS.NAME,
        secret: env.SCS.SESS.SECRET,
        resave : false,
        saveUninitialized : true,
        cookie: { secure: false }
   }))
   .use(env.SCS.REST_PATH, router);

app.listen(env.SCS.PORT, () => {
    env.message('Listening on port ', env.SCS.PORT);
});