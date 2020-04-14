import AWS = require("aws-sdk");
// ADDS A PHOTO TO THE DB
// eslint-disable-next-line import/prefer-default-export
export function dynamoHelper(
    originalname: any,
    photoId: string,
    uploadTime: any,
    name: string,
    userName: string,
    bucketName: string,
    pathname: string,
    likes: any
): Promise<any> {
    const params = {
        Item: {
            PhotoID: photoId,
            Name: name,
            UserID: userName,
            FileName: originalname,
            UploadTime: uploadTime,
            BucketName: bucketName,
            PathName: pathname,
            likes,
        },
        TableName: "PhotoTable",
    };

    const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-1",
    });
    console.log("Adding a new item...");

    return documentClient.put(params).promise();
}
