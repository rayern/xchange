import { Sequelize, DataTypes } from "sequelize"
import dotenv from "dotenv"
import createUserModel from "./user.js"

dotenv.config();
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
});

sequelize.authenticate().then(() => {
    console.log('Database connected')
}).catch(err => {
    console.log('Database error: '+ err)
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = createUserModel(sequelize, DataTypes);

db.sequelize.sync({force: false}).then(() => {
    console.log('Sync is complete')
})

export default db