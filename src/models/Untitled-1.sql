DELIMITER $$

DROP PROCEDURE IF EXISTS addUser $$
CREATE PROCEDURE addUser (
    IN p_first_name VARCHAR(255),
    IN p_last_name VARCHAR(255),
    IN p_firebase_id VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_role_id INT(11)
)
BEGIN 
    IF NOT EXISTS (SELECT * FROM `users` WHERE firebase_id = p_firebase_id) THEN 
        INSERT INTO `users` (first_name, last_name, firebase_id, email, role_id) 
        VALUES (p_first_name, p_last_name, p_firebase_id, p_email, p_role_id);
        SELECT * FROM `users` WHERE firebase_id = p_firebase_id;
    ELSE
        SELECT 1 as error, 403 as statusCode, 'User already exists' as message;
    END IF;
END $$

DELIMITER ;


CALL addUser('John', 'Doe', 'johndoe123', 'john@example.com', 1);

-----------------------------------------------------------------------------------------

DELIMITER //
DROP PROCEDURE IF EXISTS updateUser //
CREATE PROCEDURE updateUser(
    IN p_id INT,
    IN p_first_name VARCHAR(255),
    IN p_last_name VARCHAR(255),
    IN p_firebase_id VARCHAR(255),
    IN p_email VARCHAR(255), 
    IN p_role_id INT,
    IN p_first_login DATE,
    IN p_last_login DATE,
    IN p_is_active TINYINT(1)
)
BEGIN
    DECLARE userCount INT;
    SELECT COUNT(*) INTO userCount FROM users WHERE id = p_id;

    IF userCount > 0 THEN
        IF p_first_name IS NOT NULL THEN
            UPDATE users SET first_name = p_first_name WHERE id = p_id;
        END IF;

        IF p_last_name IS NOT NULL THEN
            UPDATE users SET last_name = p_last_name WHERE id = p_id;
        END IF;

        IF p_email IS NOT NULL THEN
            UPDATE users SET email = p_email WHERE id = p_id;
        END IF;

        IF p_firebase_id IS NOT NULL THEN
            UPDATE users SET firebase_id = p_firebase_id WHERE id = p_id;
        END IF;

        IF p_role_id IS NOT NULL THEN
            UPDATE users SET role_id = p_role_id WHERE id = p_id;
        END IF;

        IF p_first_login IS NOT NULL THEN
            UPDATE users SET first_login = p_first_login WHERE id = p_id;
        END IF;

        IF p_last_login IS NOT NULL THEN
            UPDATE users SET last_login = p_last_login WHERE id = p_id;
        END IF;

        IF p_is_active IS NOT NULL THEN
            UPDATE users SET is_active = p_is_active WHERE id = p_id;
        END IF;

    ELSE
        SELECT 1 as error, 403 as statusCode, 'User not found' as message;
    END IF;

END //

DELIMITER ;