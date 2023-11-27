import pool from "../helpers/pool.js"

export const fetchEnums = async (startIdx) => {
    let idx = startIdx === undefined || isNaN(startIdx) ? 0 : Number(startIdx);
    const params = {
        sql: 'select * from EnumConst order by enum_type',
        timeout: 30000, // 30s
        values: [idx]
    };
    return pool.query(params);
};
