import dbJSON from "../config/database.json" assert { type: "json" };
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import createUserModel from "./User.js";
dotenv.config();
const dbConfig = dbJSON[process.env.DATABASE]

console.log(dbConfig)
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    operatorsAliases: false
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