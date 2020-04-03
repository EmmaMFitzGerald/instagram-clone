import { dynamoHelper } from "../helpers/dynamo.helper";
import { s3Helper } from "../helpers/s3.helper";

export async function uploadPhoto(
    originalname: any,
    photoId: any,
    uploadTime: any,
    userId: any,
    bucketName: any,
    pathname: any,
    res: any
): Promise<any> {
    // use dyanmo make the db record
    try {
        await dynamoHelper(
            originalname,
            photoId,
            uploadTime,
            userId,
            bucketName
        );
    } catch (err) {
        // handle any error
        console.error(err);
        res.render("../ts-template/views/error", { err });
    }

    // use s3 helper to upload file
    try {
        await s3Helper(pathname);
    } catch (err) {
        console.error(err);
    }

    // return success
}
