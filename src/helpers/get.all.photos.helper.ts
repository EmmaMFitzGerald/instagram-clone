import AWS = require("aws-sdk");

// eslint-disable-next-line import/prefer-default-export
export function getAllPhotos(): Promise<any> {
    const params = {
        TableName: "PhotoTable",
        Select: "ALL_ATTRIBUTES",
    };

    const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-1",
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return documentClient.scan(params).promise();
}
