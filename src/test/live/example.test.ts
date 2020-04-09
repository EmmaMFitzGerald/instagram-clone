/* eslint-disable func-names */
import { describe, it } from "mocha";
import { expect } from "chai";
// import { table } from "console";
import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as path from "path";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

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

    it("should get users username from the db", function(done) {
        const params = {
            TableName: "UserTable",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": "emmamariafitzgerald@gmail.com",
            },
        };


        const documentClient = new AWS.DynamoDB.DocumentClient({
            region: "us-east-1",
        });

        documentClient.scan(params, function(err: any, data: any) {
            console.log("this is the users username:", data.Items[0].userName);
            console.log(data);
        });
    })
});



//     // eslint-disable-next-line func-names
//     it("should create item in the database", function(done) {
//         const params = {
//             Item: {
//                 PhotoID: "123566",
//                 UserID: "ABCDEF",
//             },
//             TableName: "PhotoTable",
//         };

//         const documentClient = new AWS.DynamoDB.DocumentClient({
//             region: "us-east-1",
//         });
//         documentClient.put(params, function(_err: any) {
//             expect(_err).length.to.equal(null);
//             done();
//         });
//     });

//     it("should create item in the Users Table", function(done) {
//         const params = {
//             Item: {
//                 userName: "Emma",
//                 following: "1",
//             },
//             TableName: "UserTable",
//         };

//         const documentClient = new AWS.DynamoDB.DocumentClient({
//             region: "us-east-1",
//         });
//         documentClient.put(params, function(_err: any) {
//             expect(_err).length.to.equal(null);
//             done();
//         });
//     });

//     it("should get a user's photos from the db", function(done) {
//         const params = {
//             TableName: "PhotoTable",
//             FilterExpression: "UserID = :userid",
//             ExpressionAttributeValues: {
//                 ":userid": "ABCDEF",
//             },
//         };

//         const documentClient = new AWS.DynamoDB.DocumentClient({
//             region: "us-east-1",
//         });
//         // eslint-disable-next-line func-names
//         documentClient.scan(params, function(_err: any) {
//             expect(_err).to.equal(null);
//             done();
//         });
//     });

    // it("should get all photos from the db", function(done) {
    //     const params = {
    //         TableName: "PhotoTable",
    //         Select: "ALL_ATTRIBUTES",
    //     };

    //     const documentClient = new AWS.DynamoDB.DocumentClient({
    //         region: "us-east-1",
    //     });
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     documentClient.scan(params, function(err: any, data: any) {
    //         console.log("this is the photo table data:", data);
    //     });
    // });

    // it("should get users username from the db", function(done) {
    //     const params = {
    //         TableName: "UserTable",
    //         FilterExpression: "UserID = :userid",
    //         ExpressionAttributeValues: {
    //             ":userid": "emmamariafitzgerald@gmail.com",
    //         },
    //     };


    //     const documentClient = new AWS.DynamoDB.DocumentClient({
    //         region: "us-east-1",
    //     });

    //     documentClient.scan(params, function(err: any, data: any) {
    //         console.log("this is the users username:", data);
    //     });
    // )}
    // it("should create a new user", function(done) {
    //     const params = {
    //         UserPoolId: "us-east-1_k1HdX3NID",
    //         Username: "emmamariafitzgerald@gmail.com",
    //         DesiredDeliveryMediums: ["EMAIL"],
    //         ForceAliasCreation: false,
    //         MessageAction: "SUPPRESS",
    //         TemporaryPassword: "tempPassword1",
    //         UserAttributes: [
    //             {
    //                 Name: "email",
    //                 Value: "emmamariafitzgerald@gmail.com",
    //             },
    //             {
    //                 Name: "name",
    //                 Value: "Emma",
    //             },
    //         ],
    //     };

    //     const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
    //         { apiVersion: "2016-04-18" }
    //     );
    //     cognitoidentityserviceprovider.adminCreateUser(params, function(
    //         err: any,
    //         data: any
    //     ) {
    //         if (err) console.log(err, err.stack);
    //         else console.log(data);
    //         expect(1).to.equal(1);
    //     });
    // });
    // it("should create a new user", function() {
    //     const params = {
    //         ClientId: "t0bkh3s2iu50nlj1hdpovqjq9",
    //         Password: "12345678",
    //         Username: "emma@unionrealtime.com",
    //         UserAttributes: [
    //             {
    //                 Name: "email",
    //                 Value: "emma@unionrealtime.com",
    //             },
    //         ],
    //     };

    //     const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
    //         { apiVersion: "2016-04-18" }
    //     );

    //     cognitoidentityserviceprovider.signUp(params, function(err, data) {
    //         if (err) console.log(err, err.stack);
    //         else console.log(data);
    //     });
    // });

    // it("should sign a user in", function(done) {
    //     const params = {
    //         AuthFlow: "ADMIN_NO_SRP_AUTH",
    //         ClientId: "t0bkh3s2iu50nlj1hdpovqjq9",
    //         UserPoolId: "us-east-1_k1HdX3NID",
    //         AuthParameters: {
    //             USERNAME: "emmamariafitzgerald@gmail.com",
    //             PASSWORD: "tempPassword1",
    //         },
    //     };

    //     const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
    //         { apiVersion: "2016-04-18" }
    //     );
    //     cognitoidentityserviceprovider.adminInitiateAuth(params, function(
    //         err,
    //         data
    //     ) {
    //         if (err) {
    //             console.log(err, err.stack);
    //         } else {
    //             console.log(data);
    //         }
    //         expect(err).to.equal(null);
    //         done();
    //     });
    // });

    // it("should sign a user out", function(done) {
    //     const params = {
    //         AccessToken:
    //             "eyJraWQiOiJNVFRpVE8zQm5jcVYzMDI2NDNtMDFXaGtsNnFFVjBhWkZmYkdjNFJuNE9JPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlZmQ4N2FjNy01ZmQwLTRmZTYtOTMzNC0xYWQ1ODVlYTE2MjAiLCJldmVudF9pZCI6ImZjM2E3ZjQ5LTc4MTYtNDFmZS1hZmMyLWE5NjU5MTllNDI2MyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1ODYyODA4NDMsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX2sxSGRYM05JRCIsImV4cCI6MTU4NjI4NDQ0MywiaWF0IjoxNTg2MjgwODQzLCJqdGkiOiI1ZjE5MDVmYS02ZjAwLTQ0MmMtYjc0YS1mNmFlNzc5YzE0NjUiLCJjbGllbnRfaWQiOiJ0MGJraDNzMml1NTBubGoxaGRwb3ZxanE5IiwidXNlcm5hbWUiOiJlbW1hbWFyaWFmaXR6Z2VyYWxkQGdtYWlsLmNvbSJ9.MwSVp8B4euOj5vdbqj4TtRi6L8azIaKFxvn-PC-hGg0MJgfssmKsoXZsRy5hbp0bIZ6O8wDEHfD10IQ2JOyA4QzUcYBA7gDSBoJTVCCnP7P2foAqj0Qv9kNWcGq3xoyr3kfv0aqh8rl8g44-cBcAgCodBZvsSYGGU8f8L99gCyv21UwT5sy-P2_y-oD6Gt7GQm_YGE33D5X6FKzGb8LP0kKPGd-XE0OU0tGjbKl00e-L8p5mg9N6JTaD8QCiLLc0LwN4mAg4Ug_K4zLMgoGDv-Oq8pcaGCvU_K8RP1XrQ65LD6PMF_D7Rscl124mUQwF1JeI0jK4ksAt1PS_guzHwA" /* required */,
    //     };
    //     const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
    //         { apiVersion: "2016-04-18" }
    //     );
    //     cognitoidentityserviceprovider.globalSignOut(params, function(
    //         err: any,
    //         data: any
    //     ) {
    //         if (err) console.log(err);
    //         else console.log("logged out:", data);
    //         expect(1).to.equal(1);
    //         done();
    //     });
    // });
// });
