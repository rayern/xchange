import APIError from "../errors/apiError.js";
import {listImages, uploadImage} from "./s3Service.js";
import {fetchEnums} from "../models/enumModel.js";

export const loadEnums = async () => {
    fetchEnums()
        .then((rows) => {
            const newEnums = {};
            const enumArr = Array();
            newEnums["enums"] = enumArr;

            rows[0].forEach((r) => {
                enumArr.push(r);
            });

            global.ENUM = newEnums;
        })
        .catch((err) => {
            console.error("ERROR: " + err);
        })
};

