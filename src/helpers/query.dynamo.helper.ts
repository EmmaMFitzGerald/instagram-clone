import AWS = require("aws-sdk");

// eslint-disable-next-line import/prefer-default-export
export function getUsersPhoto(userId: any): Promise<any> {
    const params = {
        TableName: "PhotoTable",
        FilterExpression: "UserID = :userid",
        ExpressionAttributeValues: {
            ":userid": userId,
        },
    };

    const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-1",
    });

    return documentClient.scan(params).promise();
}
