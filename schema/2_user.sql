CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `firebase_id` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT \'1\',
  `first_login` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `firebase_id` (`firebase_id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb3;

CREATE TABLE `Roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT \'0\',
  `is_active` tinyint(1) NOT NULL DEFAULT \'1\',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

CREATE TABLE `PasswordReset` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT \'0\',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

DROP PROCEDURE IF EXISTS AddUser;
DELIMITER $$
CREATE PROCEDURE AddUser (
    IN p_first_name VARCHAR(255),
    IN p_last_name VARCHAR(255),
    IN p_firebase_id VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_role VARCHAR(255)
)
BEGIN 
    DECLARE l_role_id INT;

    -- Get role ID
    SELECT id INTO l_role_id
    FROM Roles 
    WHERE name = lower(p_role) AND is_active = 1;

    -- Check if role exists
    IF l_role_id IS NOT NULL THEN
        -- Check if user already exists
        IF NOT EXISTS (SELECT * FROM `Users` WHERE firebase_id = p_firebase_id) THEN 
            -- Insert new user
            INSERT INTO `Users` (first_name, last_name, firebase_id, email, role_id) 
            VALUES (p_first_name, p_last_name, p_firebase_id, p_email, l_role_id);
            SELECT * FROM `Users` WHERE firebase_id = p_firebase_id;
        ELSE
            -- User already exists
            SELECT 1 as error, 403 as statusCode, 'User already exists' as message;
        END IF;
    ELSE
        -- Role not found or not active
        SELECT 1 as error, 404 as statusCode, 'Role not found or not active' as message;
    END IF;
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS UpdateUser;
DELIMITER $$
CREATE PROCEDURE UpdateUser(
    IN p_id INT,
    IN p_first_name VARCHAR(255),
    IN p_last_name VARCHAR(255),
    IN p_firebase_id VARCHAR(255),
    IN p_email VARCHAR(255), 
    IN p_profile_pic VARCHAR(255),
    IN p_role_id INT,
    IN p_first_login DATE,
    IN p_last_login DATE,
    IN p_is_active TINYINT(1)
)
BEGIN
    DECLARE userCount INT;
    SELECT COUNT(*) INTO userCount FROM Users WHERE id = p_id;

    IF userCount > 0 THEN
        IF p_first_name IS NOT NULL THEN
            UPDATE Users SET first_name = p_first_name WHERE id = p_id;
        END IF;

        IF p_last_name IS NOT NULL THEN
            UPDATE Users SET last_name = p_last_name WHERE id = p_id;
        END IF;

        IF p_email IS NOT NULL THEN
            UPDATE Users SET email = p_email WHERE id = p_id;
        END IF;

        IF p_profile_pic IS NOT NULL THEN
            UPDATE Users SET profile_pic = p_profile_pic WHERE id = p_id;
        END IF;

        IF p_firebase_id IS NOT NULL THEN
            UPDATE Users SET firebase_id = p_firebase_id WHERE id = p_id;
        END IF;

        IF p_role_id IS NOT NULL THEN
            UPDATE Users SET role_id = p_role_id WHERE id = p_id;
        END IF;

        IF p_first_login IS NOT NULL THEN
            UPDATE Users SET first_login = p_first_login WHERE id = p_id;
        END IF;

        IF p_last_login IS NOT NULL THEN
            UPDATE Users SET last_login = p_last_login WHERE id = p_id;
        END IF;

        IF p_is_active IS NOT NULL THEN
            UPDATE Users SET is_active = p_is_active WHERE id = p_id;
        END IF;

    ELSE
        SELECT 1 as error, 403 as statusCode, 'User not found' as message;
    END IF;

END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS UpsertPasswordReset;
DELIMITER $$
CREATE PROCEDURE UpsertPasswordReset(
    IN p_id INT,
    IN p_user_id INT,
    IN p_is_used TINYINT,
    OUT op_password_reset_id INT
)
BEGIN
    DECLARE l_password_reset_id INT;

    IF p_id IS NULL THEN
        -- Insert a row
        INSERT INTO PasswordReset (user_id) VALUES (p_user_id);

        -- Get address id
        SET l_password_reset_id = LAST_INSERT_ID();
    ELSE
        -- Update address
        UPDATE PasswordReset SET is_used = p_is_used WHERE id = p_id;
        SET l_password_reset_id = p_id;
    END IF;

    -- Set the output parameter
    SET op_password_reset_id = l_password_reset_id;

END$$
DELIMITER ;

