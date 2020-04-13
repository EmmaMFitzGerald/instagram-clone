import AWS = require("aws-sdk");

// eslint-disable-next-line import/prefer-default-export
export function getListOfFollowing(userId: any): Promise<any> {
    const params = {
        TableName: "UserTable",
        FilterExpression: "userName = :userName",
        ExpressionAttributeValues: {
            ":userName": userId,
        },
    };

    const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-1",
    });

    return documentClient.scan(params).promise();
}