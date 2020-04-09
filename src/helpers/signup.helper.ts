import * as AWS from "aws-sdk";

// import Global = NodeJS.Global;
// export interface GlobalWithCognitoFix extends Global {
//     fetch: any;
// }
// declare const global: GlobalWithCognitoFix;
// global.fetch = require("node-fetch");

// eslint-disable-next-line import/prefer-default-export
export function signUpUsers(email: any, password: any, name:any) {
    const params = {
        ClientId: "t0bkh3s2iu50nlj1hdpovqjq9" /* required */,
        Password: password /* required */,
        Username: email /* required */,
        UserAttributes: [
            {
                Name: "email" /* required */,
                Value: email,
            },
            {
                Name: "name" /* required */,
                Value: name,
            },
        ],
    };

    const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
        { apiVersion: "2016-04-18" }
    );

    cognitoidentityserviceprovider.signUp(params, function(err, data) {
        if (err) console.log(err, err.stack);
        // an error occurred
        else console.log(data); // successful response
    });
}
