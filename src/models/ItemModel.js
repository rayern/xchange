import pool from "../helpers/pool.js";
import { getAddressByUser } from "./AddressModel.js";


export const fetchItems = async (startIdx, user) => {
	let idx = startIdx === undefined || isNaN(startIdx) ? 0 : Number(startIdx);
	let params = null
	if (user) {
        const address = await getAddressByUser(user)
		params = {
			sql: 
				"select item_data, owner_id from Items i, ItemOwner o, Address a, UserAddress ua where i.id = o.item_id and o.owner_id = ua.user_id and ua.address_id = a.id and ST_Distance(a.location, Point(?, ?)) <= ? order by o.updated desc limit ?",
			timeout: 30000, // 30s
			values: [address.location.x, address.location.y, 10000, idx],
		};
	} else {
		params = {
			sql:
				"select item_data, owner_id from Items i, ItemOwner o where i.id = o.item_id " +
				"order by o.updated desc limit ?",
			timeout: 30000, // 30s
			values: [idx],
		};
	}
	return pool.query(params);
};

export const saveNewItem = async (owner, item) => {
	const params = {
		sql: "call UpsertItem(?, ?, ?, @itemId)",
		timeout: 30000, // 30s
		values: [owner.id, 0, JSON.stringify(item)],
	};

	pool.query(params)
		.then((data) => {
			console.log("Query returned");
		})
		.catch((err) => {
			console.error(err);
			throw err;
		});
};
