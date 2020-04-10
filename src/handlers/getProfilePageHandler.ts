import { getUsersPhoto } from "../helpers/profile.query.dynamo.helper";
import { signUrls } from "../helpers/signed.url.helper";
import { getListOfPeopleYouFollow } from "../helpers/get.following.from.db";
import { queryUsersTable } from "../helpers/get.username.dynamo.helper";

// eslint-disable-next-line import/prefer-default-export
export async function getProfilePageHandler(
    arrayOfFollowers: any,
    id: any,
    email: any,
    userName: any,
    doesThisUserExist: boolean,
    res: any
): Promise<any> {
    if (doesThisUserExist === true && userName === id) {
        const usersPhotos = await getUsersPhoto(userName);
        const usersSignedURLs = signUrls(usersPhotos.Items);
        const usersItems = usersPhotos.Items;
        console.log("usersItems", usersItems);
        res.render("profile", {
            usersPhotos: usersPhotos.Items,
            userName,
            usersSignedURLs,
            arrayOfFollowers,
        });
    } else if (doesThisUserExist === true && userName !== id) {
        const arrayOfPeopleYouFollow = await queryUsersTable(email);
        const peopleYouFollow = arrayOfPeopleYouFollow.Items;
        const listOfPeopleYouFollow = getListOfPeopleYouFollow(peopleYouFollow);
        const doesCurrentUserFollowThisProfile = listOfPeopleYouFollow.includes(
            id
        );
        const specificUsersPhotos = await getUsersPhoto(id);
        const usersSignedURLs = signUrls(specificUsersPhotos.Items);
        res.render("specificProfile", {
            specificUsersPhotos,
            id,
            usersSignedURLs,
            userName,
            doesCurrentUserFollowThisProfile,
            arrayOfFollowers,
        });
    } else {
        res.render("profileDoesntExist", { userName, arrayOfFollowers });
    }
}
