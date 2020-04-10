import AWS = require("aws-sdk");
// GETS A LIST OF OBJECTS WITH ALL USERS INFORMATION
// eslint-disable-next-line import/prefer-default-export
export function getAllUsers(): Promise<any> {
    const params = {
        TableName: "UserTable",
        Select: "ALL_ATTRIBUTES",
    };

    const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-1",
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return documentClient.scan(params).promise();
}
