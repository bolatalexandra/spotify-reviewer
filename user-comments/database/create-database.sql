DROP DATABASE IF EXISTS `user_comments`;
CREATE DATABASE `user_comments` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

DROP TABLE IF EXISTS user_comments.users;
CREATE TABLE user_comments.users (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS user_comments.songs;
CREATE TABLE user_comments.songs (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_song` varchar(45) NOT NULL,
  `id_user` int(11) NOT NULL,
  `comment` varchar(500) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `id_idx` (`id_user`),
  CONSTRAINT `id` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;


DROP procedure IF EXISTS user_comments.sp_insert_song;
DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE user_comments.sp_insert_song(
	IN p_id_song varchar(45),
	IN p_id_user int,
    IN p_comment varchar(500)
)
BEGIN
    INSERT INTO songs (id_song, id_user, comment)
	VALUES(p_id_song, p_id_user, p_comment);

    SELECT id FROM songs order by id desc limit 1;
END$$
DELIMITER ;

DROP procedure IF EXISTS user_comments.get_comments;
DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE user_comments.get_comments(
IN p_id_song varchar(45)
)
BEGIN
    SELECT s.id, s.comment, u.email, u.name, u.picture, s.timestamp FROM user_comments.songs s
	INNER JOIN user_comments.users u
	ON u.id = s.id_user
    where s.id_song = p_id_song
    ORDER BY s.timestamp ASC;
END$$
DELIMITER ;

DROP procedure IF EXISTS user_comments.sp_insert_user;
DELIMITER $
CREATE DEFINER=`root`@`%` PROCEDURE user_comments.sp_insert_user(
	IN p_email varchar(100),
	IN p_name varchar(45),
    IN p_picture varchar(255)
)
BEGIN
    INSERT INTO users (email, name, picture)
	VALUES(p_email, p_name, p_picture);
END$$
DELIMITER ;

DROP procedure IF EXISTS user_comments.sp_delete_song;
DELIMITER $
CREATE DEFINER=`root`@`%` PROCEDURE user_comments.sp_delete_song(
 p_id int,
	IN p_email varchar(100),
    IN p_id_song varchar(45)
)
BEGIN
    DELETE s.* FROM user_comments.songs s
	INNER JOIN user_comments.users u
	ON (u.id = s.id_user and u.email = p_email and s.id = p_id)
    where s.id_song = p_id_song;
END$

DELIMITER ;