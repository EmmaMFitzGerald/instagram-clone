import { getUsersPhoto } from "./profile.query.dynamo.helper";
import { signUrls } from "./signed.url.helper";

export async function profileToDisplay(
    arrayOfUsers: any[],
    idToCompareTo: string,
    currentUser: any,
    res: any
) {
    console.log("in the profile to display function");
    console.log(arrayOfUsers, idToCompareTo, currentUser, res);

    for (let i = 0, l = arrayOfUsers.length; i < l; i++) {

            if (arrayOfUsers[i] === currentUser && currentUser === idToCompareTo) {
                const usersPhotos = await getUsersPhoto(currentUser);
                console.log("users photos within profiletodisplay loop:", usersPhotos)
                const usersSignedURLs = signUrls(usersPhotos.Items);
                res.render("profile", {
                    usersPhotos,
                    userName: currentUser,
                    usersSignedURLs,
                });
            } else if (arrayOfUsers[i] === currentUser && currentUser != idToCompareTo || arrayOfUsers[i] === idToCompareTo) {
                const specificUsersPhotos = await getUsersPhoto(idToCompareTo);
                console.log("specific photos within profiletodisplay loop:", specificUsersPhotos)
                const usersSignedURLs = signUrls(specificUsersPhotos.Items);
                res.render("specificProfile", {
                    specificUsersPhotos,
                    idToCompareTo,
                    usersSignedURLs,
                });
            } else {
                console.log("reached else statement:",arrayOfUsers[i], currentUser, idToCompareTo)
                res.render("profileDoesntExist")
            }
};
