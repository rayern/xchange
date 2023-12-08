CREATE TABLE `Address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` json NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT \'1\',
  `location` point NOT NULL,
  PRIMARY KEY (`id`),
  SPATIAL KEY `location` (`location`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3

CREATE TABLE `UserAddress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `address_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3

DROP PROCEDURE IF EXISTS UpsertAddress;
DELIMITER $$
CREATE PROCEDURE UpsertAddress(
    IN p_user_id INT,
    IN p_address JSON,
    IN p_latitude DECIMAL(9,6),
    IN p_longitude DECIMAL(9,6),
    OUT op_address_id INT
)
BEGIN
    DECLARE l_address_id INT;
    DECLARE point_geometry POINT;

    SET point_geometry = ST_GeomFromText(CONCAT('POINT(', p_latitude, ' ', p_longitude, ')'));

    SELECT a.id INTO l_address_id
    FROM Address AS a
    LEFT JOIN UserAddress AS u ON a.id = u.address_id
    WHERE u.user_id = p_user_id AND a.active = 1;

    IF l_address_id IS NULL THEN
        -- Insert a row
        INSERT INTO Address (address, location) VALUES (p_address, point_geometry);

        -- Get address id
        SET l_address_id = LAST_INSERT_ID();

        -- Insert user address relation
        INSERT INTO UserAddress (user_id, address_id) VALUES (p_user_id, l_address_id);
    ELSE
        -- Update address
        UPDATE Address SET address = p_address, location = point_geometry WHERE id = l_address_id;
    END IF;

    -- Set the output parameter
    SET op_address_id = l_address_id;

END$$
DELIMITER ;