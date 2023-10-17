import BaseModel from "../helpers/BaseModel.js";

class Log extends BaseModel {
	constructor() {
		super();
		this.database.table = "logs";
		this.database.fields = {
			api_endpoint: {
				type: "VARCHAR(255)",
				insert: true,
			},
			ip_address: {
				type: "VARCHAR(255)",
			},
			request: {
				type: "TEXT",
			},
			message: {
				type: "TEXT",
			},
			details: {
				type: "TEXT",
			},
		};
	}
}

export default new Log();
