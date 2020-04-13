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
import { getUsersPhoto } from "./helpers/profile.query.dynamo.helper";
import { followUser } from "./helpers/follow.user";
import { getListOfPeopleYouFollow } from "./helpers/get.following.from.db";
import { getUsersYouFollowsPhotos } from "./helpers/get.users.you.follows.photos";
import { signUrlsOfUsersYouFollow } from "./helpers/sign.users.you.follows.photos";
import { getAllUsers } from "./helpers/get.all.users.helper";
import { getArrayOfAllUsers } from "./helpers/get.array.of.all.users";
import { deletePhotoHelper } from "./helpers/delete.photo.helper";
import { getListOfFollowers } from "./helpers/get.list.of.followers";
import { unfollowUser } from "./helpers/unfollow.user";
import { getArrayOfFollowers } from "./helpers/array.of.followers";
import { getProfilePageHandler } from "./handlers/get.profile.page.handler";
import { sortPhotosByDate } from "./helpers/sort.photos.helper";
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
import { getArrayOfPhotoInfo, getArrayOfPhotos } from "./helpers/get.array.of.photo.info";
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

app.post("/unfollow", (req, res) => {
    unfollowUser(req.session.userName, req.body.userToUnfollow);
    res.redirect("back");
});

app.get("/following", async (req, res) => {
    const currentUser = req.session.userId;
    const arrayOfPeopleYouFollow = await queryUsersTable(currentUser);
    const peopleYouFollow = arrayOfPeopleYouFollow.Items;
    const listOfPeopleYouFollow = getListOfPeopleYouFollow(peopleYouFollow);
    const list = await getUsersYouFollowsPhotos(listOfPeopleYouFollow);
    const array = getArrayOfPhotos(list);
    const listOfSignedUrls = signUrls(array);
    res.render("peopleYouFollow", {
        listOfSignedUrls,
        list,
        userName: req.session.userName,
        arrayOfFollowers: req.session.followers,
    });
});

// app.get("/followers", async (req, res) => {
//     const listOfFollowers = await getListOfFollowers(req.session.userName);
//     const arrayOfFollowers = getListFollowers(listOfFollowers);
//     res.render("followers", {
//         arrayOfFollowers,
//         userName: req.session.userName,
//     });
// });

app.get("/followers", async (req, res) => {
    const listOfFollowers = await getListOfFollowers(req.session.userName);
    const arrayOfFollowers = getListFollowers(listOfFollowers);
    res.render("followers", {
        arrayOfFollowers,
        userName: req.session.userName,
    });
});

app.get("/explore", async (req, res) => {
    const allPhotos = await getAllPhotos();
    const sortedPhotos = sortPhotosByDate(allPhotos);
    const allPhotosSignedURLs = signUrls(sortedPhotos);
    const { userName } = req.session;
    // const listOfFollowers = await getListOfFollowers(userName);
    // const arrayOfFollowers = getArrayOfFollowers(listOfFollowers);
    // req.session.followers = arrayOfFollowers;
    res.render("explore", {
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
    console.log("arrayOfUsersFollowers:", arrayOfUsersFollowers);

    const { userName } = req.session;
    const arrayOfAllUsers = getArrayOfAllUsers(allUsers);
    const doesThisUserExist = arrayOfAllUsers.includes(id);
    const email = req.session.userId;
    console.log("email", email);
    await getProfilePageHandler(
        arrayOfUsersFollowers,
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
    res.redirect(`profile/${req.body.search}`);
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
    await uploadPhoto(
        originalname,
        photoId,
        uploadTime,
        name,
        userId,
        bucketName,
        pathname
    );
    res.redirect("back");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
