import APIError from "../errors/APIError.js";
import BaseModel from "../helpers/BaseModel.js";

class User extends BaseModel {
	constructor() {
		super()
		this.table = "users"
	}

	static async role() {
		//return $this->belongsTo(User::class, 'owner_id', 'id');
	}

	static getFields({ type = false, variable = false }) {
		let fieldStr = "";
		for (const key in this.db.fields) {
			if (this.db.fields[key].insert == true) {
				if (fieldStr != "") {
					fieldStr += ",";
				}
				field = variable ? "p_" + key : key;
				fieldStr += field;
				if (type) {
					fieldStr += " " + this.db.fields[key].type;
				}
			}
		}
		return fieldStr;
	}

	static async createProcedures() {
		const insertProcedure = `
        DELIMITER //
        DROP PROCEDURE IF EXISTS addUser;
        CREATE PROCEDURE addUser(${this.getFields({
			type: true,
			variable: true,
		})})
        BEGIN 
            IF NOT EXISTS (SELECT 'X' FROM ${
				this.table
			} WHERE firebase_id = firebase_id) THEN 
            BEGIN
                INSERT INTO ${
					this.db.table
				}(${this.getFields()}) VALUES (${this.getFields({
			variable: true,
		})});
                SELECT 200 as statusCode, 'success' as message;
            END
            ELSE
            BEGIN 
                SELECT 403 as statusCode, 'User already exists' as message;
            END
            ENDIF
        END//
        DELIMITER ;        
        `;
		await this.runSQL(insertProcedure);
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

	async save() {
		const newProperties = {};
		for (const key in this) {
			if (key !== "db" && this.hasOwnProperty(key)) {
				newProperties[key] = this[key];
			}
		}
		return this.update(newProperties);
	}

	async getByFirebaseId(firebase_id){
		const rows = await this.runSQL(
			`SELECT * FROM ${this.table} WHERE firebase_id = ?`,
			firebase_id
		);
		return rows[0];
	}
}

export default User
