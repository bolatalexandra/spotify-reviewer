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
        name: env.UCS.SESS.NAME,
        secret: env.UCS.SESS.SECRET,
        resave : false,
        saveUninitialized : true,
        cookie: { secure: false }
   }))
   .use(env.UCS.REST_PATH, router);

app.listen(env.UCS.PORT, () => {
    env.message('Listening on port ', env.UCS.PORT);
});