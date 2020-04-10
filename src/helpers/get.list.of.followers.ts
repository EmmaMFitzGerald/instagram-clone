import AWS = require("aws-sdk");

// eslint-disable-next-line import/prefer-default-export
export function getListOfFollowers(userId: any): Promise<any> {
    console.log("list of followers user id", userId);
    const params = {
        TableName: "UserTable",
        FilterExpression: "following = :following",
        ExpressionAttributeValues: {
            ":following": userId,
        },
    };

    const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-1",
    });

    return documentClient.scan(params).promise();
}
