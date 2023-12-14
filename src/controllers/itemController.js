import {
	getAllItems,
	getSpecificItems,
	handleNewItem,
} from "../service/itemService.js";
import { getLoggedInUser } from "../helpers/utils.js";
import asyncWrapper from "../middleware/async.js";
import APIError from "../errors/APIError.js";

export const getAll = asyncWrapper(async (req, res) => {
	let userId = null;
	if (req.body.userId) {
		userId = req.body.userId;
	} else {
		userId = await getLoggedInUser(req).id;
	}
	getAllItems(req.params.startIdx, userId)
		.then((data) => {
			return res.status(200).json({
				success: true,
				data: data[0],
				message: "Items fetched successfully",
			});
		})
		.catch((err) => {
			return res
				.status(500)
				.json({ success: false, message: err.message });
		});
});

export const addNew = asyncWrapper(async (req, res) => {
	let item = req.body;
	if (req.params.itemId) {
		item.id = req.params.itemId;
	}
	handleNewItem(req.user, item)
		.then((data) => {
			return res.status(200).json({
				success: true,
				message: "We are processing your request",
			});
		})
		.catch((error) => {
			console.error(error);
			return res.status(500).json({ success: false, message: error });
		});
});

export const getSingle = asyncWrapper(async (req, res) => {
	const data = await getSpecificItems(req.params.id);
	if (!data) {
		throw new APIError("No item(s) found", 400);
	}
	return res.status(200).json({
		success: true,
		data: data[0],
		message: "Item(s) fetched successfully",
	});
});
export const getSpecific = asyncWrapper(async (req, res) => {
	const data = await getSpecificItems(req.body.idx);
	if (!data) {
		throw new APIError("No item(s) found", 400);
	}
	return res.status(200).json({
		success: true,
		data: data[0],
		message: "Item(s) fetched successfully",
	});
});
