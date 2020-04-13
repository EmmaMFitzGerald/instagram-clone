import AWS = require("aws-sdk");

const s3 = new AWS.S3();

// Tried with and without this. Since s3 is not region-specific, I don't
// think it should be necessary.
// AWS.config.update({region: 'us-west-2'})
// eslint-disable-next-line import/prefer-default-export
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// eslint-disable-next-line import/prefer-default-export
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// eslint-disable-next-line import/prefer-default-export
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// eslint-disable-next-line import/prefer-default-export
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// eslint-disable-next-line import/prefer-default-export
export function signUrlsOfUsersYouFollow(userPhotos: any): any {
    const usersPhotoArray = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0, l = userPhotos.length; i < l; i++) {
        console.log("inside signurlsofpeopleyoufollow", userPhotos[i].Items[0]);
        const myBucket = userPhotos[i].Items[0].BucketName;
        const myKey = userPhotos[i].Items[0].PathName.slice(8);
        const signedUrlExpireSeconds = 60 * 5;

        const url = s3.getSignedUrl("getObject", {
            Bucket: myBucket,
            Key: myKey,
            Expires: signedUrlExpireSeconds,
        });
        usersPhotoArray.push(url);
    }

    return usersPhotoArray;
}
