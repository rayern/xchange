import User from "../models/UserModel.js";
import asyncWrapper from "../middleware/async.js";
import APIError from "../errors/apiError.js";
import AuthErrorfrom from "../errors/authError.js";
import {handleNewItem} from "../service/itemService.js";

export const getAll = asyncWrapper(async (req, res) => {
    let startIdx = req.params.startIdx;


});

export const addNew = asyncWrapper(async (req, res) => {
    // TODO: we will get the user from middleware
    const User = {"id": 111};
    
    let item = req.body;

    handleNewItem(User, item)
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

});

