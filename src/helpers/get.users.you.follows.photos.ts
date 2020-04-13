/* eslint-disable import/prefer-default-export */
import { getUsersPhoto } from "./profile.query.dynamo.helper";

export async function getUsersYouFollowsPhotos(
    arrayOfUsers: any
): Promise<any> {
    const listOfUsersYouFollowsPhoto = [];
    console.log("array of users", arrayOfUsers)
    // eslint-disable-next-line no-plusplus
    for (let i = 0, l = arrayOfUsers.length; i < l; i++) {
        // eslint-disable-next-line no-await-in-loop
        listOfUsersYouFollowsPhoto.push(await getUsersPhoto(arrayOfUsers[i]));
    }

    return listOfUsersYouFollowsPhoto;
}
