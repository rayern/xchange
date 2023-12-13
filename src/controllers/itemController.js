import {getAllItems, handleNewItem} from "../service/itemService.js";
import {getLoggedInUser} from "../helpers/utils.js"
import asyncWrapper from "../middleware/async.js";

export const getAll = asyncWrapper(async (req, res) => {
    const user = await getLoggedInUser(req)
    getAllItems(req.params.startIdx, user)
        .then((data) => {
            return res
                .status(200)
                .json({success: true, data: data[0], message: "Items fetched successfully"});
        })
        .catch((err) => {
            return res
                .status(500)
                .json({success: false, message: err.message});
        })
});

export const addNew = asyncWrapper(async (req, res) => {
    let item = req.body;
    if(req.params.itemId){
        item.id = req.params.itemId
    }
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
        });

});

