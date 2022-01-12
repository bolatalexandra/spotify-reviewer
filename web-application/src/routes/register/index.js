/* path: /register */
const router = require("express").Router();
const request = require("request");

const env = require("../../environment");

router.get("/", (req, res) => {
  env.log("GET", `${env.WA.URI}/register`);
  res.render("register");
});

router.post("/", (req, res) => {
  env.log("POST", `${env.WA.URI}/register`);

  const redirectUri = `${env.WA.URI}/login`;
  const requestUri = `${env.UMS.URI}/register`;

  const email = req.body.email;
  const password = req.body.password;
  const repeatPassword = req.body["repeat-password"];

  if (password !== repeatPassword) {
    res.status(404).send("Wrong password combination");

    return;
  }

  if (password.length < 8) {
    res.status(404).send("Password too short!");

    return;
  }

  request.post(
    requestUri,
    {
      json: { email, password },
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        env.log("POST", requestUri, { email, password, repeatPassword }, false);
        res.redirect(redirectUri);
      } else {
        env.log("POST", requestUri, JSON.stringify(error), false);
        res.status(400).send("Error encountered. Contact the admin!");
      }
    }
  );
});

module.exports = router;
