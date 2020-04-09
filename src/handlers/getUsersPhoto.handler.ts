import { getUsersPhoto } from "../helpers/profile.query.dynamo.helper";

// eslint-disable-next-line import/prefer-default-export
export async function queryUserPhotos(userId: any): Promise<any> {
    try {
        await getUsersPhoto(userId);
    } catch (err) {
        console.log("This error is from queryUserPhotos:", err);
        // res.render("../ts-template/views/error", { err });
    }
}
