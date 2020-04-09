import * as AWS from "aws-sdk";
// eslint-disable-next-line import/prefer-default-export
export function signInUser(email: any, password: any): Promise<any> {
    const params = {
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        ClientId: "t0bkh3s2iu50nlj1hdpovqjq9",
        UserPoolId: "us-east-1_k1HdX3NID",
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
        },
    };

    const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
        { apiVersion: "2016-04-18" }
    );

    return cognitoidentityserviceprovider.adminInitiateAuth(params).promise();
}
