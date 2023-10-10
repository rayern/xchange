import pool from './pool.js'
import {rtrim} from './utils.js'

class BaseModel{
    #database = {
        params: []
    }
    async runSQL(sql){
        const [rows] = await pool.query(sql, this.#database.params)
        this.#database.params = []
        return rows
    }
    decodeWhere(where){
        let whereStr = ''
        if(where != ''){
            whereStr = ' WHERE '
            for (const key in where) {
                if(typeof where[key] === 'object'){
                    for (const operator in where[key]) {
                        switch(operator){
                            case 'lt': 
                                whereStr += key + ' < ?,'
                                this.#database.params.push(where[key][operator])
                            break;
                            case 'gt': 
                                whereStr += key + ' > ?,'
                                this.#database.params.push(where[key][operator])
                            break;
                            case 'lte': 
                                whereStr += key + ' <= ?,'
                                this.#database.params.push(where[key][operator])
                            break;
                            case 'gte': 
                                whereStr += key + ' >= ?,'
                                this.#database.params.push(where[key][operator])
                            break;
                            case 'like': 
                                whereStr += key + ' like ?,'
                                this.#database.params.push(where[key][operator])
                            break;
                            case 'contains': 
                                whereStr += key + ' like %?%,'
                                this.#database.params.push(where[key][operator])
                            break;
                            case 'startsWith': 
                                whereStr += key + ' like ?%,'
                                this.#database.params.push(where[key][operator])
                            break;
                            case 'endsWith': 
                                whereStr += key + ' like %?,'
                                this.#database.params.push(where[key][operator])
                            break;
                            case 'between': 
                                whereStr += key + ' between ? and ?,'
                                this.#database.params.push(where[key][operator][0])
                                this.#database.params.push(where[key][operator][1])
                            break;
                        }
                    }
                }
                else{
                    whereStr += key + ' = ?,'
                    this.#database.params.push(where[key])
                }
            }
        }
        else{
            whereStr = where
        }
        return rtrim(whereStr, ',')
    }

    async find({select = '*', where = '', group = '', order = ''}){
        const orderStr = '', groupStr = ''
        const whereStr = this.decodeWhere(where)
        if(order != ''){
            orderStr = ' ORDER BY ' + order
        }
        if(group != ''){
            groupStr = ' GROUP BY ' + group
        }
        const rows = await this.runSQL(`SELECT ${select} FROM ${this.#database.table}${whereStr}${groupStr}${orderStr};`)
        return rows
    }

    async findOne({select = '*', where = '', group = '', order = ''}){
        const rows = await this.find({select, where, group, order})
        if (rows.length === 0) {
            return null;
        }
        Object.assign(this, rows[0]);
        return this
    }

    async create(props){
        let columns = '', values = ''
        for (const key in props) {
            if(columns != ''){
                columns += ','
                values += ','
            }
            columns += key
            values += '?'
        }
        this.#database.params = Object.values(props)
        const rows = await this.runSQL(`INSERT INTO ${this.#database.table} (${columns}) VALUES (${values})`) 
        return rows.insertId
    }

    async delete({where}){
        const {whereStr} = decodeWhere(where)
        if(whereStr){
            const rows = await this.runSQL(`DELETE FROM ${this.#database.table}${whereStr}`)
        }
        return rows
    }

    async update(props, {where}){
        let values = ''
        for (const key in props) {
            if(values != ''){
                values += ','
            }
            values += key + ' = ?'
            this.#database.params.push(props[key])
        }
        const {whereStr} = decodeWhere(where)
        const rows = await this.runSQL(`UPDATE ${this.#database.table} SET ${values}${whereStr}`)
        return rows.affectedRows
    }

    async callProcedure(name, params){
        this.#database.params = params
        const binds = Array.from({ length: params.length }, () => '?').join(',');
        const response = await this.runSQL(`CALL ${name}(${binds})`)
        return response?.[0]?.[0] || (response?.affectedRows > 0);
    }
    
    getDatabase() {
        return this.#database;
    }
}

export default BaseModel