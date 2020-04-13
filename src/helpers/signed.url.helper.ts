import AWS = require("aws-sdk");

const s3 = new AWS.S3();

// eslint-disable-next-line import/prefer-default-export
export function signUrls(userPhotos: any): any {
    console.log("users photos in signurls", userPhotos);
    let photo;
    const usersPhotoArray = [];
    for (photo of userPhotos) {
        console.log("photo in signurls:", photo);
        const myBucket = photo.BucketName;
        const myKey = photo.PathName.slice(8);
        const signedUrlExpireSeconds = 60 * 5;

        const url = s3.getSignedUrl("getObject", {
            Bucket: myBucket,
            Key: myKey,
            Expires: signedUrlExpireSeconds,
        });
        usersPhotoArray.push(url);
    }
    console.log(usersPhotoArray);

    return usersPhotoArray;
}
