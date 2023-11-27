import asyncWrapper from "../middleware/async.js";
import APIError from "../errors/apiError.js";
import AuthErrorfrom from "../errors/authError.js";
import {getAllItems, handleNewItem} from "../service/itemService.js";

export const getAll = async (req, res) => {
    return res
        .status(200)
        .json({success: true, data: global.ENUM, message: ""});
};

export const getByType = async (req, res) => {
    const type = req.params.type;
    let typeEnum = global.ENUM.enums.filter(p => {
        return p.enum_type === type;
    })
    .sort((p, q) => {
        return (p.enum_name < q.enum_name); 
    });
    
    return res
        .status(200)
        .json({success: true, data: typeEnum, message: ""})
};

