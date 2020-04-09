import AWS = require("aws-sdk");

// eslint-disable-next-line import/prefer-default-export
export function createUsername(email: any , name: any) {
    const params = {
        Item: {
            userName: name,
            email,
            following: " ",
        },
        TableName: "UserTable",
    };

    const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-1",
    });
    documentClient.put(params).promise();
}
