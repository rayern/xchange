import APIError from "../errors/APIError.js";
import BaseModel from "../helpers/BaseModel.js";

class PasswordReset extends BaseModel {
	constructor() {
		super()
		this.table = "password_reset"
	}
}

export default PasswordReset