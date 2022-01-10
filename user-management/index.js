const express = require('express');
const md5 = require('md5');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');

dotEnv.config();

const { generateToken, logRequest: log } = require('./utils')

const app = express();
const router = express.Router();

const REST_PATH = process.env.SERVICE_REST_PATH || '/api/ums';
const PORT = process.env.PORT || 4000;

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_SCHEMA
});

connection.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.post(REST_PATH + '/register', (req, res) => {
    log('POST', `${REST_PATH}` + '/register');

    const email = req.body.email;
    const password = md5(req.body.password);
    const token = generateToken(email, password);

    const sql = `INSERT INTO users (user_token, email, password) VALUES ('${token}', '${email}', '${password}')`;
    connection.query(sql, (err) => {
        if (err) {
            return res.status(404).send({ error: "Something went wrong!" });
        }
        return res.status(200).send({ success: "You have been registered!" });
    });
});

router.post(REST_PATH + '/login', (req, res) => {
    log('POST', `${REST_PATH}` + '/login');

    const email = req.body.email;
    const password = req.body.password;

    connection.query(
        'SELECT * FROM users WHERE email = ?', [ email ],
        (error, results) => {
            if (results && results.length === 1) {
                if (md5(password) === results[0].password) {
                    res.json({
                        token: results[0].user_token,
                        spotify_token: results[0].spotify_token
                    });
                } else {
                    res.json({
                        "message": "Incorrect password"
                    });
                }
            } else {
                res.status(404).json({
                    message: 'Email or password is incorrect!'
                });
            }
        });
});

router.put(REST_PATH + '/token/spotify', (req, res) => {
    log('PUT', `${REST_PATH}` + '/update-spotify-token');

    const spotify_token = req.body.spotify_token;
    const user_token = req.body.user_token;

    let sql = 'UPDATE users set spotify_token=? WHERE user_token=?';
    let data = [ spotify_token, user_token ];

    connection.

    connection.query(sql, data, (error, results) => {
        if (results.affectedRows === 0) {
            return res.status(404).send({ message: "Token incorrect!" });
        }

        res.status(200).send({ message: "Token updated!" });
    });
});

app.use('/', router);

app.listen(PORT, () => {
    console.log(`[User Management] Listening on port ${PORT}`);
});
