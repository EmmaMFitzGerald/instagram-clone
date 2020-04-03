import * as AWS from "aws-sdk";
// import AWS = require("aws-sdk");
import path = require("path");
import fs = require("fs");

AWS.config.update({ region: "us-east-1" });

function uploadPicture(originalname: any): any {
    const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

    const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: "instagram-clone-bucket-emma",
        Key: "",
        Body: "",
    };
    const file = originalname;
    const fileStream = fs.createReadStream(file);
    fileStream.on("error", function(err: any) {
        console.log("File Error", err);
    });
    uploadParams.Body = fileStream;
    uploadParams.Key = path.basename(file);

    // eslint-disable-next-line func-names
    s3.upload(uploadParams, function(err: any, data: { Location: any }) {
        if (err) {
            console.log("Error", err);
        }
        if (data) {
            console.log("Upload Success", data.Location);
        }
    });
}

export default uploadPicture;
