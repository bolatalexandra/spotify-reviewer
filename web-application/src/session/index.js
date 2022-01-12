const env = require("../environment");
const request = require("request");
const LocalStorage = require("node-localstorage").LocalStorage;
const storage = new LocalStorage("./storage");

const isAuthorized = (req, res, next) => {
  if (req.session.wa && req.session.user) {
    next();
  } else if (req.body && req.body.wa) {
    const key = req.body.wa.token;
    const data = JSON.parse(storage.getItem(key));
    if (data) {
      req.session.wa = data.wa;
      req.session.user = data.user;
      storage.removeItem(key);
    }
    next();
  } else if (req.query.wa) {
    const key = req.query.wa;
    const data = JSON.parse(storage.getItem(key));
    if (data) {
      req.session.wa = data.wa;
      req.session.user = data.user;
      storage.removeItem(key);
    }
    next();
  } else {
    res.redirect("/login");
  }
};

const isSpotifyAuthorized = (req, res, next) => {
  const TOKEN_URI = "http://localhost:8080/connect/spotify/token";

  request.post(
    TOKEN_URI,
    {
      json: { refresh_token: req.session.user.spotify.refresh_token },
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        req.session.user.spotify.token = body.token;
        return next();
      }
      return res.redirect("/");
    }
  );
};

module.exports = { isAuthorized, isSpotifyAuthorized, storage };
