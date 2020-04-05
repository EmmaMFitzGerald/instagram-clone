/* eslint-disable func-names */
import { describe, it } from "mocha";
import { expect } from "chai";
// import { table } from "console";
import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as path from "path";

describe("Example Test Series", () => {
    it("should return an expected value", () => {
        const x = 1;
        const y = 10;
        const target = x + y;

        expect(target).to.equal(11);
    });

    it("should upload a photo to S3", async function(done) {
        AWS.config.update({ region: "us-east-1" });

        const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

        const uploadParams: AWS.S3.PutObjectRequest = {
            Bucket: "instagram-clone-bucket-emma",
            Key: "",
            Body: "",
        };
        const file =
            "/Users/emmafitzgerald/instagram-clone/ts-template/src/test/live/Kids-Surf.jpg";

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

        done();
    });

    // eslint-disable-next-line func-names
    it("should create item in the database", function(done) {
        const params = {
            Item: {
                PhotoID: "123566",
                UserID: "ABCDEF",
            },
            TableName: "PhotoTable",
        };

        const documentClient = new AWS.DynamoDB.DocumentClient({
            region: "us-east-1",
        });
        documentClient.put(params, function(_err: any) {
            expect(_err).length.to.equal(null);
            done();
        });
    });

    it("should get a user's photos from the db", function(done) {
        const params = {
            TableName: "PhotoTable",
            FilterExpression: "UserID = :userid",
            ExpressionAttributeValues: {
                ":userid": "ABCDEF",
            },
        };

        const documentClient = new AWS.DynamoDB.DocumentClient({
            region: "us-east-1",
        });
        // eslint-disable-next-line func-names
        documentClient.scan(params, function(_err: any) {
            expect(_err).to.equal(null);
            done();
        });
    });

    it("should get all photos from the db", function(done) {
        const params = {
            TableName: "PhotoTable",
            Select: "ALL_ATTRIBUTES",
        };

        const documentClient = new AWS.DynamoDB.DocumentClient({
            region: "us-east-1",
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        documentClient.scan(params, function(_err: any, _data: any) {
            expect(_err).to.equal(null);
            done();
        });
    });
});
