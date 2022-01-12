const { Router } = require("express");
const mysql = require("mysql2");
const router = require("express").Router();

const env = require("../environment");

const connection = mysql.createConnection({
  host: env.DB.HOST,
  user: env.DB.USER,
  password: env.DB.PASSWORD,
  database: env.DB.SCHEMA,
  port: env.DB.PORT,
});

connection.connect();

async function query(connection, command) {
  return new Promise((resolve, reject) => {
    connection.query(command.sql, command.params, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

router.post("/", async (req, res) => {
  env.log("POST", `${env.UCS.URI}/comment`);

  /*
    user: {
        email: <YOUR_EMAIL>,
        name: <YOUR_NAME>,
        profile: <YOUR_AVATAR_URL>
    },
    song: { id: <SPOTIFY_SONG_ID> },
    comment: <COMMENT_STRING>
    */

  const data = req.body;

  const commands = [
    {
      sql: `SELECT id, email FROM users WHERE email = ? LIMIT 1`,
      params: [data.user.email],
    },
    {
      sql: `CALL sp_insert_user(?,?,?)`,
      params: [data.user.email, data.user.name, data.user.profile],
    },
    {
      sql: `CALL sp_insert_song(?,?,?)`,
      params: [data.song.id, undefined, data.comment],
    },
  ];

  let user;

  const getUser = async () => {
    const results = await query(connection, commands[0]);

    if (results.length > 0) {
      return results[0];
    }

    return undefined;
  };

  try {
    // select user
    user = await getUser();
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error while verifing user existence!" });
  }

  if (!user) {
    try {
      // insert user
      await query(connection, commands[1]);
      user = await getUser();
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error while inserting a new user!" });
    }
  }

  commands[2].params[1] = user.id;

  try {
    // insert comment
    const [data] = await query(connection, commands[2]);
    return res.status(201).json({ message: "Ok!", commentId: data[0].id });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error while inserting a new comment!" });
  }
});

router.delete("/", async (req, res) => {
  env.log("DELETE", `${env.UCS.URI}/comment`);

  /*
    user: { email: <YOUR_EMAIL> },
    song: { id: <SPOTIFY_SONG_ID> },
    comment: { id: <COMMENT_ID> }
    */

  const data = req.body;

  try {
    // delete comment
    await query(connection, {
      sql: `CALL sp_delete_song(?,?,?)`,
      params: [data.comment.id, data.user.email, data.song.id],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error while deleting a comment!" });
  }

  return res.status(200).json({ message: "Ok!" });
});

router.get("/:songId", async (req, res) => {
  env.log("GET", `${env.UCS.URI}/comment/${req.params.songId}`);

  const songId = req.params.songId;

  try {
    // get comments
    const [comments] = await query(connection, {
      sql: `CALL get_comments(?)`,
      params: [songId],
    });
    return res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    return res.status(500).json([]);
  }
});

module.exports = router;
