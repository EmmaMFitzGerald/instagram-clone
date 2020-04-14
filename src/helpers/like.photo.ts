import AWS = require("aws-sdk");
// ADDS A PHOTO TO THE DB
// eslint-disable-next-line import/prefer-default-export
export async function likePhoto(PhotoID: any, UserID: any): Promise<any> {
    console.log(PhotoID, UserID)
    const params = {
        TableName: "PhotoTable",
        Key: {
            PhotoID,
            UserID,
        },
        UpdateExpression: "set likes = likes + :val",
        ExpressionAttributeValues: {
            ":val": 1,
        },
        ReturnValues: "UPDATED_NEW",
    };

    const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-1",
    });

    console.log("Updating the item...");
    documentClient.update(params, function(err, data) {
        if (err) {
            console.error(err);
        } else {
            console.log(data);
        }
    });
}
