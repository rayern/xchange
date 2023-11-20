import User from "../models/UserModel.js";
import asyncWrapper from "../middleware/async.js";
import APIError from "../errors/apiError.js";
import {listImages, uploadImage} from "./s3Service.js";

let existingImages = new Set();
export const handleNewItem = async (user, item) => {
    if (user === undefined || item === undefined) {
        throw new Error("user or item undefined");
    }

    listImages(user.id)
        .then((data) => {
            if (data.Contents !== undefined) {
                data.Contents.forEach((i) => {
                    existingImages.add(i.Key);
                });
            }

            uploadItemImages(user, item);
        });

    // return Promise.allSettled(promises);
}

const uploadItemImages = (user, item) => {
    if (item.hasOwnProperty("uploads")) {
        let uploads = item.uploads;
        const uploadCount = uploads.length;

        const promises = Array();
        uploads.forEach(upload => {
            // check to see if any filename exists
            let name = upload.name;
            if (existingImages.has(user.id + "/" + name)) {
                const comps = name.split(".");
                // comps[0] contains the directory
                if (comps.length === 1) {
                    name = comps[0] + "_" + Date.now()
                } else {
                    name = comps[0] + "_" + Date.now() + "." + comps[1];
                }
            }

            // construct url
            let url = "https://" + process.env.AWS_BUCKET + ".s3." +
                process.env.AWS_REGION + ".amazonaws.com/" + name;
            uploads.push(url);

            // upload the image
            promises.push(uploadImage(user.id, name, upload.type, upload.content)
                .catch((error) => {
                    console.error("Error: " + error)
                    uploads.delete(url);
                    throw error;
                })
                .finally(() => {
                    console.log("Finished uploading " + name + " with or withour error");
                }));
        });

        Promise.allSettled(promises)
            .then(() => {
                // remove the image data
                for (let i = 0; i < uploadCount; i++) {
                    uploads.shift();
                }

                // TODO: save to database
                console.log("We will save the item here: \n" + JSON.stringify(item));
            });
    } else {
        console.log("no files uploaded");
    }
}