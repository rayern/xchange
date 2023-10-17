import BaseModel from "../helpers/BaseModel.js";

class Role extends BaseModel {
	constructor() {
		super();
		this.database.table = "roles";
		this.database.fields = {
			name: {
				type: "VARCHAR(255)",
				insert: true,
			},
			is_active: {
				type: "TINY_INT(1)",
				allowNull: false,
				defaultValue: true,
			},
		};
	}
}
