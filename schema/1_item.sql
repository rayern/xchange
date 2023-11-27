CREATE TABLE `Items`
(
    `id`        bigint    NOT NULL AUTO_INCREMENT,
    `item_data` json      NOT NULL,
    `created`   datetime  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated`   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ItemOwner`
(
    `id`       bigint    NOT NULL AUTO_INCREMENT,
    `owner_id` int       NOT NULL,
    `item_id`  bigint    NOT NULL,
    `created`  datetime  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated`  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP IF EXISTS PROCEDURE `UpsertItem`;

DELIMITER $$
CREATE PROCEDURE `UpsertItem`(
IN p_owner_id INT,
IN p_item_id BIGINT,
IN p_item JSON,
OUT op_item_id BIGINT
)
BEGIN
	declare l_item_id INT DEFAULT 0;
    declare l_owner_id INT DEFAULT 0;
    declare new_json JSON;

	if p_item_id = 0
    then
		-- insert a row
		insert into Items (item_data) values (p_item);

        -- get account id
		set l_item_id = LAST_INSERT_ID();

        -- update json with id
        set @new_json = (select json_set((select item_data from Items where id = l_item_id), '$.id', l_item_id));
        update Items set item_data = @new_json where id = l_item_id;

        -- insert ownsership
        insert into ItemOwner (owner_id, item_id) values (p_owner_id, l_item_id);
        select op_item_id = l_item_id;
    else
		-- update item
        set @new_json = (select json_set(p_item_data, '$.id', p_item_id));
		update Items set item_data = @new_json where id = p_item_id;

        -- update ownership
        select owner_id as l_owner_id from ItemOwner where item_id = p_item_id order by updated desc limit 1;

        if (l_owner_id <> p_owner_id)
        then
			-- update ownsership
			update ItemOwner set owner_id = p_owner_id where item_id = p_item_id;
        end if;
    end if;
    select op_item_id = p_item_id;
END$$
DELIMITER ;
