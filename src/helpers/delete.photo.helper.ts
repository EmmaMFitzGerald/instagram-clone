// import AWS = require("aws-sdk");
import AWS = require("aws-sdk");
// // eslint-disable-next-line import/prefer-default-export
// eslint-disable-next-line import/prefer-default-export
export function deletePhotoHelper(photoId: any, userId: any): any {
    console.log("photoid", photoId, "userid", userId);
    const params = {
        TableName: "PhotoTable",
        Key: {
            PhotoID: photoId,
            UserID: userId,
        },
    };

    console.log("Attempting a conditional delete...");

    const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-1",
    });

    // eslint-disable-next-line func-names
    documentClient.delete(params, function(err: any, data: any) {
        if (err) {
            console.error(
                "Unable to delete item. Error JSON:",
                JSON.stringify(err, null, 2)
            );
        } else {
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
}
