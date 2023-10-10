import APIError from "../errors/APIError.js"
import BaseModel from "../helpers/BaseModel.js"

class User extends BaseModel{
    constructor(){
        super();
        this.getDatabase().table = 'users',
        this.getDatabase().fields = {
            first_name: {
                type: 'VARCHAR(255)',
                insert: true
            },
            last_name: {
                type: 'VARCHAR(255)',
                insert: true
            },
            firebase_id: {
                type: 'VARCHAR(255)',
                allowNull: false,
                insert: true,
                unique: true,
                validate:{
                    notEmpty: true
                }
            },
            email: {
                type: 'VARCHAR(255)',
                allowNull: false,
                insert: true,
                unique: true,
                validate:{
                    notEmpty: true
                }
            },
            is_active: {
                type: 'TINY_INT(1)',
                allowNull: false,
                defaultValue: true 
            },
            first_login: {
                type: 'DATETIME'
            },
            last_login: {
                type: 'DATETIME'
            }
        }
        this.getDatabase().relations = {
            role_id:{
                type: 'belongsTo'
            }
        }
    }

    static async role(){
        //return $this->belongsTo(User::class, 'owner_id', 'id');
    }

    static getFields({type = false, variable = false}){
        let fieldStr = ''
        for (const key in this.getDatabase().fields) {
            if(this.getDatabase().fields[key].insert == true){
                if(fieldStr != ''){
                    fieldStr += ','
                }
                field = (variable) ? 'p_' + key : key
                fieldStr += field 
                if(type){
                    fieldStr += ' ' + this.getDatabase().fields[key].type
                }
            }
        }
        return fieldStr
    }

    static async createProcedures(){
        const insertProcedure = `
        DELIMITER //
        DROP PROCEDURE IF EXISTS addUser;
        CREATE PROCEDURE addUser(${this.getFields({type: true, variable: true})})
        BEGIN 
            IF NOT EXISTS (SELECT 'X' FROM ${this.table} WHERE firebase_id = firebase_id) THEN 
            BEGIN
                INSERT INTO ${this.getDatabase().table}(${this.getFields()}) VALUES (${this.getFields({variable: true})});
                SELECT 200 as statusCode, 'success' as message;
            END
            ELSE
            BEGIN 
                SELECT 403 as statusCode, 'User already exists' as message;
            END
            ENDIF
        END//
        DELIMITER ;        
        `;
        await this.runSQL(insertProcedure)
    }

    async create({email, first_name, last_name, role_id, firebase_id}){
        const status = await this.callProcedure('addUser',[first_name, last_name, firebase_id, email, role_id])
        if(!status){
            throw new APIError('User creation has failed. Please try again', 400)
        }
        return status
    }

    async update({id, email = null, first_name = null, last_name = null, role_id = null, firebase_id = null, first_login = null, last_login = null, is_active = null}){
        const status = await this.callProcedure('updateUser',[id, first_name, last_name, firebase_id, email, role_id, first_login, last_login, is_active])
        if(!status){
            throw new APIError('User updation has failed. Please try again', 400)
        }
        return status
    }

    async save(){
        const { database, ...restOfProperties } = this;
        return this.update(restOfProperties)
    }
}

export default new User