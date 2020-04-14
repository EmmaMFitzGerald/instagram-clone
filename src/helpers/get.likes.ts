import AWS = require("aws-sdk");

// eslint-disable-next-line import/prefer-default-export
export function getLikes(photoId) {
    const params = {
        TableName: "LikesTable",
        FilterExpression: "PhotoID = :PhotoID",
        ExpressionAttributeValues: {
            ":PhotoID": "1xnmdjohk8yz9fnn",
        },
    };

    const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-1",
    });

    documentClient.scan(params, function(err: any, data: any) {
        if (err) {
            console.error("Unable to get item", console.log(err));
        } else {
            console.log(data);
        }
    });
}
