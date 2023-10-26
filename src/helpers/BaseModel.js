import pool from "./pool.js";
import { rtrim } from "./utils.js";

class BaseModel {
	async runSQL(sql, params) {
		const [rows] = await pool.query(sql, params);
		return rows;
	}
	decodeWhere(where) {
		let whereStr = "";
		let params = []
		if (where != "") {
			whereStr = " WHERE ";
			for (const key in where) {
				if (typeof where[key] === "object") {
					for (const operator in where[key]) {
						switch (operator) {
							case "lt":
								whereStr += key + " < ?,";
								params.push(where[key][operator]);
								break;
							case "gt":
								whereStr += key + " > ?,";
								params.push(where[key][operator]);
								break;
							case "lte":
								whereStr += key + " <= ?,";
								params.push(where[key][operator]);
								break;
							case "gte":
								whereStr += key + " >= ?,";
								params.push(where[key][operator]);
								break;
							case "like":
								whereStr += key + " like ?,";
								params.push(where[key][operator]);
								break;
							case "contains":
								whereStr += key + " like %?%,";
								params.push(where[key][operator]);
								break;
							case "startsWith":
								whereStr += key + " like ?%,";
								params.push(where[key][operator]);
								break;
							case "endsWith":
								whereStr += key + " like %?,";
								params.push(where[key][operator]);
								break;
							case "between":
								whereStr += key + " between ? and ?,";
								params.push(
									where[key][operator][0]
								);
								params.push(
									where[key][operator][1]
								);
								break;
						}
					}
				} else {
					whereStr += key + " = ?,";
					params.push(where[key]);
				}
			}
		} else {
			whereStr = where;
		}
		return {whereStr: rtrim(whereStr, ","), params};
	}

	async find({ select = "*", where = "", group = "", order = "" }) {
		const orderStr = "",
			groupStr = "";
		const {whereStr, params} = this.decodeWhere(where);
		if (order != "") {
			orderStr = " ORDER BY " + order;
		}
		if (group != "") {
			groupStr = " GROUP BY " + group;
		}
		const rows = await this.runSQL(
			`SELECT ${select} FROM ${this.table}${whereStr}${groupStr}${orderStr};`, params
		);
		return rows;
	}

	async findOne({ select = "*", where = "", group = "", order = "" }) {
		const rows = await this.find({ select, where, group, order });
		if (rows.length === 0) {
			return null;
		}
		Object.assign(this, rows[0]);
		return this;
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
			`INSERT INTO ${this.table} (${columns}) VALUES (${values})`, Object.values(props)
		);
		return rows.insertId;
	}

	async delete({ where }) {
		const { whereStr, params } = decodeWhere(where);
		if (whereStr) {
			const rows = await this.runSQL(
				`DELETE FROM ${this.table}${whereStr}`, params
			);
		}
		return rows;
	}

	async update(props, { where }) {
		let values = "";
		let parameters = []
		for (const key in props) {
			if (values != "") {
				values += ",";
			}
			values += key + " = ?";
			parameters.push(props[key]);
		}
		const { whereStr, params } = decodeWhere(where);
		const rows = await this.runSQL(
			`UPDATE ${this.table} SET ${values}${whereStr}`, [...parameters,...params]
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

	getDatabase() {
		return this.db;
	}
}

export default BaseModel;
