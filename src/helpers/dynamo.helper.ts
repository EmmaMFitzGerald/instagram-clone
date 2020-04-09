import AWS = require("aws-sdk");
// ADDS A PHOTO TO THE DB
// eslint-disable-next-line import/prefer-default-export
export function dynamoHelper(
    originalname: any,
    photoId: string,
    uploadTime: any,
    userId: any,
    bucketName: string,
    pathname: string,
    name: string
): Promise<any> {
    const params = {
        Item: {
            PhotoID: photoId,
            UserID: userId,
            FileName: originalname,
            UploadTime: uploadTime,
            BucketName: bucketName,
            PathName: pathname,
            Name: name,
        },
        TableName: "PhotoTable",
    };

    const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-1",
    });
    console.log("Adding a new item...");

    return documentClient.put(params).promise();
}
