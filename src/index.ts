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
import { createUsername } from "./helpers/username.helper";
import { getAllPhotos } from "./helpers/get.all.photos.helper";
import { queryUsersTable } from "./helpers/get.username.dynamo.helper";
import { getUsersPhoto } from "./helpers/profile.query.dynamo.helper";
import { followUser } from "./helpers/follow.user";
import { getListOfPeopleYouFollow } from "./helpers/get.following.from.db";
import { getUsersYouFollowsPhotos } from "./helpers/get.users.you.follows.photos";
import { signUrlsOfUsersYouFollow } from "./helpers/sign.users.you.follows.photos";
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

app.get("/following", async (req, res) => {
    const currentUser = req.session.userId;
    const arrayOfPeopleYouFollow = await queryUsersTable(currentUser);
    const peopleYouFollow = arrayOfPeopleYouFollow.Items;
    const listOfPeopleYouFollow = getListOfPeopleYouFollow(peopleYouFollow);
    const list = await getUsersYouFollowsPhotos(listOfPeopleYouFollow);
    console.log("list of people you follow", list);
    const listOfSignedUrls = signUrlsOfUsersYouFollow(list);
    res.render("peopleYouFollow", { listOfSignedUrls, list });
});

app.get("/explorepage", async (req, res) => {
    const allPhotos = await getAllPhotos();
    const allPhotosSignedURLs = signUrls(allPhotos.Items);
    const name = await queryUsersTable(req.session.userId);
    const { userName } = name.Items[0];
    res.render("explorepage", { allPhotosSignedURLs, allPhotos, userName });
});

app.get("/signout", (req, res) => {
    signOutUser(req.session.accesstoken);
    req.session.accesstoken = "";
    res.render("index");
});

// app.get("/profile/:id", async (req, res) => {
//     const name = await queryUsersTable(req.session.userId);
//     const currentUser = name.Items[0].userName;
//     const { id } = req.params;
//     if (currentUser === id) {
//         const usersPhotos = await getUsersPhoto(currentUser);
//         const usersSignedURLs = signUrls(usersPhotos.Items);
//         res.render("profile", { usersPhotos, userName: req.session.userName, usersSignedURLs });
//     } else {
//         const specificUsersPhotos = await getUsersPhoto(id);
//         const usersSignedURLs = signUrls(specificUsersPhotos.Items);
//         res.render("specificProfile", {
//             specificUsersPhotos,
//             id,
//             usersSignedURLs,
//         });
//     }
// });

app.get("/profile/:id", async (req, res) => {
    const { id } = req.params;
    if (req.session.userName === id) {
        const usersPhotos = await getUsersPhoto(req.session.userName);
        const usersSignedURLs = signUrls(usersPhotos.Items);
        res.render("profile", { usersPhotos, userName: req.session.userName, usersSignedURLs });
    } else {
        const specificUsersPhotos = await getUsersPhoto(id);
        const usersSignedURLs = signUrls(specificUsersPhotos.Items);
        res.render("specificProfile", {
            specificUsersPhotos,
            id,
            usersSignedURLs,
        });
    }
});

app.post("/follow", async (req, res) => {
    const following = req.body.userToFollow;
    const email = req.session.userId;
    const name = await queryUsersTable(email);
    const { userName } = name.Items[0];
    await followUser(userName, following, email);
    res.redirect("explorePage");
});

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    req.session.name = name;
    signUpUsers(email, password, name);
    await createUsername(email, name);
    req.session.userName = name;
    res.redirect("explorePage");
});

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const accessTokenData = await signInUser(email, password);
    req.session.accessToken = accessTokenData.AuthenticationResult.AccessToken;
    req.session.userId = email;
    const loggedInUsersInformation = await queryUsersTable(email);
    req.session.userName = loggedInUsersInformation.Items[0].userName;
    res.redirect("explorePage");
});

app.post("/upload", upload.single("file"), async (req, res) => {
    console.log("in the upload route");
    const { originalname } = req.file;
    const pathname = req.file.path;
    const uploadTime = new Date();
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
    console.log("here");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
