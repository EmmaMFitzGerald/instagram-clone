import { getUsersPhoto } from "../helpers/profile.query.dynamo.helper";
import { signUrls } from "../helpers/signed.url.helper";
import { getListOfPeopleYouFollow } from "../helpers/filter.array.of.following";
import { queryUsersTable } from "../helpers/get.username.dynamo.helper";
import { sortPhotosByDate } from "../helpers/sort.photos.helper";
import { getLikes } from "../helpers/get.likes";
// eslint-disable-next-line import/prefer-default-export
export async function getProfilePageHandler(
    arrayOfUsersFollowers: any,
    listOfPeopleYouFollow: any,
    id: any,
    email: any,
    userName: any,
    doesThisUserExist: boolean,
    res: any
): Promise<any> {
    if (doesThisUserExist === true && userName === id) {
        const usersPhotos = await getUsersPhoto(userName);
        const sortedPhotos = sortPhotosByDate(usersPhotos);
        const usersSignedURLs = signUrls(sortedPhotos);
        const usersItems = usersPhotos.Items;
        console.log("usersItems", usersItems);
        res.render("profile", {
            usersPhotos: usersPhotos.Items,
            userName,
            usersSignedURLs,
            arrayOfUsersFollowers,
            listOfPeopleYouFollow,
        });
    } else if (doesThisUserExist === true && userName !== id) {
        const arrayOfPeopleYouFollow = await queryUsersTable(email);
        const peopleYouFollow = arrayOfPeopleYouFollow.Items;
        const listOfPeopleCurrentUserFollows = getListOfPeopleYouFollow(
            peopleYouFollow
        );
        const doesCurrentUserFollowThisProfile = listOfPeopleCurrentUserFollows.includes(
            id
        );
        const specificUsersPhotos = await getUsersPhoto(id);
        const sortedPhotos = sortPhotosByDate(specificUsersPhotos);
        const likes = getLikes(sortedPhotos);
        const usersSignedURLs = signUrls(sortedPhotos);
        res.render("specificProfile", {
            specificUsersPhotos,
            likes,
            id,
            usersSignedURLs,
            sortedPhotos,
            userName,
            doesCurrentUserFollowThisProfile,
            arrayOfUsersFollowers,
            listOfPeopleYouFollow,
        });
    } else {
        res.render("profileDoesntExist", { userName, arrayOfUsersFollowers });
    }
}
