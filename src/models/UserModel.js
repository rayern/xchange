import APIError from "../errors/APIError.js";
import BaseModel from "../helpers/BaseModel.js";
import "dotenv/config";

class User extends BaseModel {
	constructor() {
		super()
		this.table = "users"
	}

	async create({ email, first_name, last_name, role_id, firebase_id }) {
		const status = await this.callProcedure("addUser", [
			first_name,
			last_name,
			firebase_id,
			email,
			role_id,
		]);
		if (!status) {
			throw new APIError(
				"User creation has failed. Please try again",
				400
			);
		}
		return status;
	}

	async update({
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
	}) {
		const status = await this.callProcedure("updateUser", [
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
		]);
		if (!status) {
			throw new APIError(
				"User updation has failed. Please try again",
				400
			);
		}
		return status;
	}

	async getByFirebaseId(firebase_id){
		const rows = await this.runSQL(
			`SELECT * FROM ${this.table} WHERE firebase_id = ?`,
			firebase_id
		);
		return rows[0];
	}

	async fetchProfilePic(user){
		if(user.profile_pic == ''){
			user.profile_pic = process.env.API_URL
		}
		return user.profile_pic
	}
}

export default User
