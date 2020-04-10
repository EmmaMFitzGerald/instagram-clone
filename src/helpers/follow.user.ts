import AWS = require("aws-sdk");
// ADDS A PHOTO TO THE DB
// eslint-disable-next-line import/prefer-default-export
export function followUser(
    userName: any,
    following: string,
    email: string
): Promise<any> {
    const params = {
        Item: {
            userName,
            following,
            email,
        },
        TableName: "UserTable",
    };

    const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-1",
    });
    console.log("following new user...");

    return documentClient.put(params).promise();
}
