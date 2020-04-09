// import AWS = require("aws-sdk");

// // eslint-disable-next-line import/prefer-default-export
// export function deletePhotoHelper(photoId: any) {
//     const params = {
//         TableName: "PhotoTable",
//         ConditionExpression: "photoId = :val",
//         ExpressionAttributeValues: {
//             ":val": photoId,
//         },
//     };

//     console.log("Attempting a conditional delete...");
//     docClient.delete(params, function(err: any, data: any) {
//         if (err) {
//             console.error(
//                 "Unable to delete item. Error JSON:",
//                 JSON.stringify(err, null, 2)
//             );
//         } else {
//             console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
//         }
//     });
// }
