import asyncWrapper from "../middleware/async.js";
import APIError from "../errors/apiError.js";
import AuthErrorfrom from "../errors/authError.js";
import {getAllItems, handleNewItem} from "../service/itemService.js";

export const getAll = async (req, res) => {
    await getAllItems(req.params.startIdx)
        .then((data) => {
            return res
                .status(200)
                .json({success: true, data: data[0], message: ""});
        })
        .catch((err) => {
            return res
                .status(500)
                .json({success: false, message: err});
        })
};

export const addNew = async (req, res) => {
    let item = req.body;

    handleNewItem(req.user, item)
        .then((data) => {
            return res
                .status(200)
                .json({success: true, message: "We are processing your request"})
        })
        .catch((error) => {
            console.error(error);
            return res
                .status(500)
                .json({success: false, message: error})
            // TODO: log it
        });

};

