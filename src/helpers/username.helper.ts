import AWS = require("aws-sdk");

// eslint-disable-next-line import/prefer-default-export
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// eslint-disable-next-line import/prefer-default-export
export function addUserToUserTable(email: any, name: any): any {
    const params = {
        Item: {
            userName: name,
            following: " ",
            email,
        },
        TableName: "UserTable",
    };

    const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-1",
    });
    documentClient.put(params).promise();
}
