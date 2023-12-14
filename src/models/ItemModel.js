import pool from "../helpers/pool.js";

export const fetchItems = async ({ fromIdx, toIdx, limit, ids, userId }) => {
	let idx = fromIdx === undefined || isNaN(fromIdx) ? 0 : Number(fromIdx);
	let values = [];
	let sql =
		"select item_data, owner_id from Items i, ItemOwner o where i.id = o.item_id";
	if (userId) {
		sql += " and o.owner_id = ?";
		values.push(userId);
	}
	if (ids) {
		const placeholders = ids.map(() => "?").join(", ");
		sql += ` and i.id in (${placeholders})`;
		values.push(ids.map(Number));
	}
	sql += " and i.id >= ?";
	values.push(idx);
	if (toIdx) {
		sql += " and i.id <= ?";
		values.push(Number(toIdx));
	}
	sql += " order by o.updated desc";
	if (limit) {
		sql += " limit ?";
		values.push(limit);
	}
	return pool.query({
		sql: sql,
		timeout: 30000, // 30s
		values: values,
	});
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
