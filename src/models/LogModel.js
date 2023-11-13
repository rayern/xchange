import BaseModel from "../helpers/BaseModel.js";

class Log extends BaseModel {
	constructor() {
		super();
		this.table = "logs";
	}
}

export default new Log();
