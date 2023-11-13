import pool from "./pool.js";
import { rtrim } from "./utils.js";

class BaseModel {
	async runSQL(sql, params) {
		const [rows] = await pool.query(sql, params);
		return rows;
	}
	
	async create(props) {
		let columns = "",
			values = "";
		for (const key in props) {
			if (columns != "") {
				columns += ",";
				values += ",";
			}
			columns += key;
			values += "?";
		}
		const rows = await this.runSQL(
			`INSERT INTO ${this.table} (${columns}) VALUES (${values})`,
			Object.values(props)
		);
		return rows.insertId;
	}

	async delete({ where }) {
		const { whereStr, params } = this.decodeWhere(where);
		if (whereStr) {
			const rows = await this.runSQL(
				`DELETE FROM ${this.table}${whereStr}`,
				params
			);
		}
		return rows;
	}

	async update(props, id) {
		let values = "";
		let parameters = [];
		for (const key in props) {
			if (values != "") {
				values += ",";
			}
			values += key + " = ?";
			parameters.push(props[key]);
		}
		if (parameters.length < 1) return false;
		const rows = await this.runSQL(
			`UPDATE ${this.table} SET ${values} WHERE id = ?`,
			[...parameters, id]
		);
		return rows.affectedRows;
	}

	async callProcedure(name, params) {
		const binds = Array.from({ length: params.length }, () => "?").join(
			","
		);
		const response = await this.runSQL(`CALL ${name}(${binds})`, params);
		if (response && response[0] && response[0][0]) {
			return response[0][0];
		} else if (response && response.affectedRows > 0) {
			return true;
		} else {
			return false;
		}
	}

	async getById(id){
		const rows = await this.runSQL(
			`SELECT * FROM ${this.table} WHERE id = ?`,
			id
		);
		return rows[0];
	}
}

export default BaseModel;
