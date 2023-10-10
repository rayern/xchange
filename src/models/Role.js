import BaseModel from "../helpers/BaseModel.js"

class Role extends BaseModel{
    static table = 'users'
    static fields = {
        name: {
            type: 'VARCHAR(255)',
            insert: true
        },
        is_active: {
            type: 'TINY_INT(1)',
            allowNull: false,
            defaultValue: true 
        }
    }
}