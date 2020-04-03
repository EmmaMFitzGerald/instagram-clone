var AWS = require("aws-sdk");

export function addPhotoToDb(originalname: any, photoId: string, uploadTime: any, userId: any){
    var params = {
        Item: {
            "PhotoID": photoId,
            "UserID": userId,
            "FileName": originalname,
            "UploadTime": uploadTime
        },
        TableName: "PhotoTable"
    };


      var documentClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
      console.log("Adding a new item...");
        documentClient.put(params, function(err: any, data: any) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
            }
      });
}