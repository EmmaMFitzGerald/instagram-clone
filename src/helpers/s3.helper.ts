import * as AWS from "aws-sdk";
// import AWS = require("aws-sdk");
import path = require("path");
import fs = require("fs");

AWS.config.update({ region: "us-east-1" });

// eslint-disable-next-line import/prefer-default-export
export async function s3Helper(originalname: any): Promise<any> {
    const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

    const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: "instagram-clone-bucket-emma",
        Key: "",
        Body: "",
    };
    const file = originalname;
    const fileStream = fs.createReadStream(file);

    fileStream.on("error", (err: any) => {
        console.log("File Error", err);
    });

    uploadParams.Body = fileStream;
    uploadParams.Key = path.basename(file);
    console.log("Uploading to S3")
    // eslint-disable-next-line func-names

    return s3.upload(uploadParams).promise();
}
