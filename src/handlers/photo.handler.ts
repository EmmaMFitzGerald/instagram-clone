import { dynamoHelper } from "../helpers/dynamo.helper";
import { s3Helper } from "../helpers/s3.helper";

// eslint-disable-next-line import/prefer-default-export
export async function uploadPhoto(
    originalname: any,
    photoId: any,
    uploadTime: any,
    name: any,
    userId: any,
    bucketName: any,
    pathname: any
): Promise<any> {
    // use dyanmo make the db record
    try {
        await dynamoHelper(
            originalname,
            photoId,
            uploadTime,
            name,
            userId,
            bucketName,
            pathname
        );
    } catch (err) {
        console.error("this is the dynamo error:", err);
    }
    try {
        await s3Helper(pathname);
    } catch (err) {
        console.error("this is the s3 error:", err);
    }
}
