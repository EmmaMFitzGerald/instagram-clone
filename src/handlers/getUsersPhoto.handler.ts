import { getUsersPhoto } from "../helpers/query.dynamo.helper";

// eslint-disable-next-line import/prefer-default-export
export async function queryUserPhotos(userId: any, res: any): Promise<any> {
    try {
        await getUsersPhoto(userId);
    } catch (err) {
        console.log(err);
        res.render("../ts-template/views/error", { err });
    }
}
