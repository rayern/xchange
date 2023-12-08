import pool from "../helpers/pool.js";
import { fetchLatLon } from "../service/smartyStreetsService.js";

export const getAddressByUserId = async (user) => {
	const params = {
		sql: "SELECT a.* FROM Address as a left join UserAddress as u on a.id = u.address_id WHERE u.user_id = ? and a.active = 1",
		timeout: 30000, // 30s
		values: [user.id],
	};
	const [rows] = await pool.query(params);
	return rows[0]
};

export const updateAddress = async (user, address) => {
	const { latitude, longitude } = await fetchLatLon(address);
	address.latitude = latitude
	address.longitude = longitude
	const params = {
		sql: "call UpsertAddress(?, ?, @addressId)",
		timeout: 30000, // 30s
		values: [user.id, JSON.stringify(address)],
	};
	pool.query(params)
};
