DROP PROCEDURE IF EXISTS AddUser;
DELIMITER $$
CREATE PROCEDURE AddUser (
    IN p_first_name VARCHAR(255),
    IN p_last_name VARCHAR(255),
    IN p_firebase_id VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_role_id INT(11)
)
BEGIN 
    IF NOT EXISTS (SELECT * FROM `Users` WHERE firebase_id = p_firebase_id) THEN 
        INSERT INTO `Users` (first_name, last_name, firebase_id, email, role_id) 
        VALUES (p_first_name, p_last_name, p_firebase_id, p_email, p_role_id);
        SELECT * FROM `Users` WHERE firebase_id = p_firebase_id;
    ELSE
        SELECT 1 as error, 403 as statusCode, 'User already exists' as message;
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

DROP PROCEDURE IF EXISTS UpsertAddress;
DELIMITER $$
CREATE PROCEDURE UpsertAddress(
    IN p_user_id INT,
    IN p_address JSON,
    OUT op_address_id INT
)
BEGIN
    DECLARE l_address_id INT;

    SELECT a.id INTO l_address_id
    FROM Address AS a
    LEFT JOIN UserAddress AS u ON a.id = u.address_id
    WHERE u.user_id = p_user_id AND a.active = 1;

    IF l_address_id IS NULL THEN
        -- Insert a row
        INSERT INTO Address (address) VALUES (p_address);

        -- Get address id
        SET l_address_id = LAST_INSERT_ID();

        -- Insert user address relation
        INSERT INTO UserAddress (user_id, address_id) VALUES (p_user_id, l_address_id);
    ELSE
        -- Update address
        UPDATE Address SET address = p_address WHERE id = l_address_id;
    END IF;

    -- Set the output parameter
    SET op_address_id = l_address_id;

END$$
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

