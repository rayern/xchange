import { Sequelize, DataTypes } from "sequelize"
import dotenv from "dotenv"
import createUserModel from "./User.js"
import createLogModel from "./Log.js"
import createRoleModel from "./Role.js"

dotenv.config()
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
})

sequelize.authenticate().then(() => {
    console.log('Database connected')
}).catch(err => {
    console.log('Database error: '+ err)
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = createUserModel(sequelize, DataTypes)
db.log = createLogModel(sequelize, DataTypes)
db.role = createRoleModel(sequelize, DataTypes)

db.role.hasMany(db.user)
db.user.belongsTo(db.role)
db.log.belongsTo(db.user)

db.sequelize.sync({force: false}).then(() => {
    console.log('Sync is complete')
})

export default db