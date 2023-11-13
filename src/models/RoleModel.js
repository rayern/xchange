import BaseModel from "../helpers/BaseModel.js";

class Role extends BaseModel {
	constructor() {
		super();
		this.table = "roles";
	}
}
