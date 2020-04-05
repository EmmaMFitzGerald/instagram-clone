import AWS = require("aws-sdk");

const s3 = new AWS.S3();

// Tried with and without this. Since s3 is not region-specific, I don't
// think it should be necessary.
// AWS.config.update({region: 'us-west-2'})
// eslint-disable-next-line import/prefer-default-export
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// eslint-disable-next-line import/prefer-default-export
export function signUrls(userPhotos: any) {
    console.log(userPhotos);
    let photo;
    for (photo of userPhotos) {
        const myBucket = photo.BucketName;
        const myKey = photo.PathName.slice(8);
        const signedUrlExpireSeconds = 60 * 5;
        console.log(myBucket, myKey);

        const url = s3.getSignedUrl("getObject", {
            Bucket: myBucket,
            Key: myKey,
            Expires: signedUrlExpireSeconds,
        });

        console.log(url);
    }
}
