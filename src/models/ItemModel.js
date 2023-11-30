import pool from "../helpers/pool.js"

export const fetchItems = async (startIdx) => {
    let idx = startIdx === undefined || isNaN(startIdx) ? 0 : Number(startIdx);
    const params = {
        sql: 'select item_data, owner_id from Items i, ItemOwner o where i.id = o.item_id ' +
            'order by o.updated desc limit ? ,18446744073709551615',
        timeout: 30000, // 30s
        values: [idx]
    };
    return pool.query(params);
};

export const saveNewItem = async (owner, item) => {
    const params = {
        sql: 'call UpsertItem(?, ?, ?, @itemId)',
        timeout: 30000, // 30s
        values: [owner.id, 0, JSON.stringify(item)]
    };

    pool.query(params)
        .then((data) => {
            console.log("Query returned");
        })
        .catch((err) => {
            console.error(err);
            throw err;
        });
};