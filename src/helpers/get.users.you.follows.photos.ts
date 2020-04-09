/* eslint-disable import/prefer-default-export */
import { queryUserPhotos } from "../handlers/getUsersPhoto.handler";
import { signUrls } from "./signed.url.helper";
import { getUsersPhoto } from "./profile.query.dynamo.helper";

export async function getUsersYouFollowsPhotos(
    arrayOfUsers: any
): Promise<any> {
    const listOfUsersYouFollowsPhoto = [];

    for (let i = 0, l = arrayOfUsers.length; i < l; i++) {
        // eslint-disable-next-line no-await-in-loop
        listOfUsersYouFollowsPhoto.push(await getUsersPhoto(arrayOfUsers[i]));
    }


    return listOfUsersYouFollowsPhoto;
    // const signedUrls = await signUrls(listOfUsersYouFollowsPhoto);

    // console.log("signedUrls inside getUserFollowsPhotos", signedUrls);

    // return signedUrls;
}
