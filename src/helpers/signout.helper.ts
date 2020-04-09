import * as AWS from "aws-sdk";

// eslint-disable-next-line import/prefer-default-export
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// eslint-disable-next-line import/prefer-default-export
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// eslint-disable-next-line import/prefer-default-export
export function signOutUser(accessToken: any): any {
    const params = {
        AccessToken: accessToken,
    };

    const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
        { apiVersion: "2016-04-18" }
    );

    cognitoidentityserviceprovider.globalSignOut(params, function(err, data) {
        if (err) console.log(err, err.stack);
        // an error occurred
        else console.log("this is the signout functions data:", data); // successful response
    });
}
