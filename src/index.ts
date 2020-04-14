import * as express from "express";
import * as path from "path";
import * as session from "express-session";
// import timestamp = require("time-stamp");
// eslint-disable-next-line import/named
import * as uniqid from "uniqid";
import { uploadPhoto } from "./handlers/photo.handler";
import { signUrls } from "./helpers/signed.url.helper";
import { signUpUsers } from "./helpers/signup.helper";
import { signInUser } from "./helpers/signin.helper";
import { signOutUser } from "./helpers/signout.helper";
import { addUserToUserTable } from "./helpers/username.helper";
import { getAllPhotos } from "./helpers/get.all.photos.helper";
import { queryUsersTable } from "./helpers/get.username.dynamo.helper";
import { followUser } from "./helpers/follow.user";
import { getListOfPeopleYouFollow } from "./helpers/filter.array.of.following";
import { getUsersYouFollowsPhotos } from "./helpers/get.users.you.follows.photos";
import { getAllUsers } from "./helpers/get.all.users.helper";
import { getArrayOfAllUsers } from "./helpers/get.array.of.all.users";
import { deletePhotoHelper } from "./helpers/delete.photo.helper";
import { getListOfFollowers } from "./helpers/get.list.of.followers";
import { unfollowUser } from "./helpers/unfollow.user";
import { getArrayOfFollowers } from "./helpers/array.of.followers";
import { getProfilePageHandler } from "./handlers/get.profile.page.handler";
import { sortPhotosByDate } from "./helpers/sort.photos.helper";
import { getArrayOfPhotos } from "./helpers/get.array.of.photo.info";
import { getListOfFollowing } from "./helpers/get.list.of.people.you.follow";
import { likePhoto } from "./helpers/like.photo";
import { getLikes } from "./helpers/get.likes";
// import methodOverride = require("method-override");
const app = express();
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(methodOverride("_method"));
const port = 3000;
app.set("view engine", "ejs");
const staticDir = path.join(__dirname, "../public");
console.log(`Static direction is: ${staticDir}`);
app.use(express.static(staticDir));
app.use(session({ secret: "sessionsecret" }));

import multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/signin", (req, res) => {
    res.render("signin");
});

app.post("/delete", (req, res) => {
    deletePhotoHelper(req.body.photoId, req.session.userId);
    res.redirect("back");
});

app.post("/like", (req, res) => {
    const { photoId } = req.body;
    const { userId } = req.body;
    likePhoto(photoId, userId);
    res.redirect("back");
});

app.post("/unfollow", (req, res) => {
    unfollowUser(req.session.userName, req.body.userToUnfollow);
    res.redirect("back");
});

app.post("/following", async (req, res) => {
    const { userName } = req.body;
    const listOfFollowing = await getListOfFollowing(userName);
    const peopleYouFollow = listOfFollowing.Items;
    const listOfPeopleYouFollow = getListOfPeopleYouFollow(peopleYouFollow);
    const list = await getUsersYouFollowsPhotos(listOfPeopleYouFollow);
    const array = getArrayOfPhotos(list);
    console.log("array", array);
    const listOfSignedUrls = signUrls(array);
    res.render("peopleYouFollow", {
        listOfSignedUrls,
        list,
        userName,
        listOfPeopleYouFollow,
    });
});

app.post("/followers", async (req, res) => {
    const { userName } = req.body;
    const listOfFollowers = await getListOfFollowers(userName);
    const arrayOfFollowers = getArrayOfFollowers(listOfFollowers);
    res.render("followers", {
        arrayOfFollowers,
        userName,
    });
});

app.get("/explore", async (req, res) => {
    const allPhotos = await getAllPhotos();
    const sortedPhotos = sortPhotosByDate(allPhotos);
    const likes = getLikes(sortedPhotos);
    const allPhotosSignedURLs = signUrls(sortedPhotos);
    const { userName } = req.session;
    res.render("explore", {
        sortedPhotos,
        likes,
        allPhotosSignedURLs,
        allPhotos,
        userName,
    });
});

app.get("/signout", (req, res) => {
    signOutUser(req.session.accesstoken);
    req.session.accesstoken = "";
    res.render("index");
});

app.get("/profile/:id", async (req, res) => {
    const allUsers = await getAllUsers();
    const { id } = req.params;

    const listOfUsersFollowers = await getListOfFollowers(id);
    const arrayOfUsersFollowers = getArrayOfFollowers(listOfUsersFollowers);

    const listOfFollowing = await getListOfFollowing(id);
    const peopleYouFollow = listOfFollowing.Items;
    const listOfPeopleYouFollow = getListOfPeopleYouFollow(peopleYouFollow);

    const { userName } = req.session;
    const arrayOfAllUsers = getArrayOfAllUsers(allUsers);
    const doesThisUserExist = arrayOfAllUsers.includes(id);
    const email = req.session.userId;
    await getProfilePageHandler(
        arrayOfUsersFollowers,
        listOfPeopleYouFollow,
        id,
        email,
        userName,
        doesThisUserExist,
        res
    );
});

app.post("/follow", async (req, res) => {
    const following = req.body.userToFollow;
    const email = req.session.userId;
    const { userName } = req.session;
    await followUser(userName, following, email);
    res.redirect("back");
});

app.post("/signup", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (password === confirmPassword) {
        signUpUsers(email, password, name);
        await addUserToUserTable(email, name.toLowerCase());
        req.session.userName = name.toLowerCase();
        res.redirect("explore");
    } else {
        res.render("signup");
    }
});

app.post("/search", (req, res) => {
    const { search } = req.body;
    res.redirect(`profile/${search.toLowerCase()}`);
});

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const accessTokenData = await signInUser(email, password);
    req.session.accessToken = accessTokenData.AuthenticationResult.AccessToken;
    req.session.userId = email;
    const loggedInUsersInformation = await queryUsersTable(email);
    req.session.userName = loggedInUsersInformation.Items[0].userName;
    res.redirect("explore");
});

app.post("/upload", upload.single("file"), async (req, res) => {
    console.log("in the upload route");
    const { originalname } = req.file;
    const pathname = req.file.path;
    const uploadTime = new Date().valueOf();
    const photoId = uniqid();
    const bucketName = "instagram-clone-bucket-emma";
    const name = req.body.currentUser;
    const { userId } = req.session;
    const likes = 0;
    await uploadPhoto(
        originalname,
        photoId,
        uploadTime,
        name,
        userId,
        bucketName,
        pathname,
        likes
    );
    res.redirect("back");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
