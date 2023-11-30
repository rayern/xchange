import pool from "../helpers/pool.js";
import "dotenv/config";

export const createUser = async ({
	email,
	first_name,
	last_name,
	role_id,
	firebase_id,
}) => {
	const params = {
		sql: "call addUser(?, ?, ?, ?, ?)",
		timeout: 30000, // 30s
		values: [first_name, last_name, firebase_id, email, role_id],
	};
	const [rows] = await pool.query(params);
	return rows[0]
};

export const updateUser = async ({
	id,
	email = null,
	first_name = null,
	last_name = null,
	profile_pic = null,
	role_id = null,
	firebase_id = null,
	first_login = null,
	last_login = null,
	is_active = null,
}) => {
	const params = {
		sql: "call updateUser(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		timeout: 30000, // 30s
		values: [
			id,
			first_name,
			last_name,
			firebase_id,
			email,
			profile_pic,
			role_id,
			first_login,
			last_login,
			is_active,
		],
	};
	pool.query(params);
};

export const getUserByFirebaseId = async (firebase_id) => {
	const params = {
		sql: "SELECT * FROM users WHERE firebase_id = ?",
		timeout: 30000, // 30s
		values: [firebase_id],
	};
	const [rows] = await pool.query(params);
	return rows[0]
};

export const getUserById = async (id) => {
	const params = {
		sql: "SELECT * FROM users WHERE id = ?",
		timeout: 30000, // 30s
		values: [id],
	};
	const [rows] = await pool.query(params);
	return rows[0]
};

export const upsertPasswordReset = async ({
	id = null,
	user_id = null,
	is_used = null,
}) => {
	const params = {
		sql: "call UpsertPasswordReset(?, ?, ?, @passwordResetId)",
		timeout: 30000, // 30s
		values: [
			id,
			user_id,
			is_used,
		],
	};
	const [rows] = await pool.query(params);
	return rows[0]
};
export const getPasswordResetById = async (id) => {
	const params = {
		sql: "SELECT * FROM password_reset WHERE id = ?",
		timeout: 30000, // 30s
		values: [id],
	};
	const [rows] = await pool.query(params);
	return rows[0]
};

export const fetchProfilePic = async (user) => {
	if (user.profile_pic == "") {
	}
	return user.profile_pic;
};
