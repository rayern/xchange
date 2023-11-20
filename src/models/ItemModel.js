const asyncWrapper = require("../middleware/async")
const BaseModel = require("../helpers/BaseModel.js")
const baseModel = new BaseModel();

const fetchAll = asyncWrapper( async (startIdx) => {
    baseModel.runSQL('select * from Items where ')
})
