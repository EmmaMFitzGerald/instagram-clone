import AWS = require("aws-sdk");
// Gets specific users photos from the db
// eslint-disable-next-line import/prefer-default-export
export function queryUsersTable(userId: any): Promise<any> {
    const params = {
        TableName: "UserTable",
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": userId,
        },
    };

    const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-1",
    });

    return documentClient.scan(params).promise();
}
