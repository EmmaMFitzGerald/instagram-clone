import { describe, it } from "mocha";
import { expect } from "chai";
import { table } from "console";
var AWS = require("aws-sdk");
import fs = require("fs");
var path = require('path');

describe("Example Test Series", () => {
    it("should return an expected value", () => {
        const x = 1;
        const y = 10;
        const target = x + y;

        expect(target).to.equal(11);
    });

    it("should upload a photo to S3", async function(done){ 
        AWS.config.update({region: 'us-east-1'});

        let s3 = new AWS.S3({apiVersion: '2006-03-01'});

        var uploadParams = {Bucket: "instagram-clone-bucket-emma", Key: '', Body: ''};
        var file = "/Users/emmafitzgerald/instagram-clone/ts-template/src/test/live/Kids-Surf.jpg";
        var fs = require('fs');

        var fileStream = fs.createReadStream(file);
        fileStream.on('error', function(err: any) {
        console.log('File Error', err);
        });
        uploadParams.Body = fileStream;
        var path = require('path');
        uploadParams.Key = path.basename(file);

        s3.upload (uploadParams, function (err: any, data: { Location: any; }) {
            if (err) {
              console.log("Error", err);
            } if (data) {
              console.log("Upload Success", data.Location);
            }
        });

        done()
    });

    it("should create item in the database", function(done){ 
        
        var params = {
            Item: {
                "PhotoID": "123566",
                "UserID": "ABCDEF"
            },
            TableName: "PhotoTable"
        };


          var documentClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
          documentClient.put(params, function(_err: any, data: any) {
            expect(_err).length.to.equal(null)
            done();
          });
    });

    it("should get a user's photos from the db", function(done){ 
        

        var params = {
            TableName: "PhotoTable",
            FilterExpression: "UserID = :userid",
            ExpressionAttributeValues: {
                ":userid": "ABCDEF"
                } 
            }
        


          var documentClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
          documentClient.scan(params, function(_err: any, data: any) {
            expect(_err).to.equal(null)
            done();
          });
    });

    it("should get all photos from the db", function(done){
        var params = {
            TableName: "PhotoTable",
            Select: "ALL_ATTRIBUTES"
        };

        var documentClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
        documentClient.scan(params, function(_err: any, data: any) {
            expect(_err).to.equal(null)
            done();
        });
    })
    
});


