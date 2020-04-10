// import AWS = require("aws-sdk");
import AWS = require("aws-sdk");
// // eslint-disable-next-line import/prefer-default-export
// eslint-disable-next-line import/prefer-default-export
export function unfollowUser(currentUser: any, userToUnfollow: any) {
    console.log("currentUser", currentUser);
    console.log("userToUnfollow", userToUnfollow);
    const params = {
        TableName: "UserTable",
        Key: {
            userName: currentUser,
            following: userToUnfollow,
        },
    };

    console.log("Attempting a conditional delete...");

    const documentClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-1",
    });

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
