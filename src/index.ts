import * as express from "express";
import * as path from "path";
import Amplify, { Auth } from "aws-amplify";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import * as session from "express-session";
// import timestamp = require("time-stamp");
// eslint-disable-next-line import/named
import * as uniqid from "uniqid";
import { uploadPhoto } from "./handlers/photo.handler";
import { getUserPhoto } from "./helpers/query.dynamo.helper";
import { signUrls } from "./helpers/signed.url.helper";
import { signUpUsers } from "./helpers/signup.helper";
import { signInUser } from "./helpers/signin.helper";
import { signOutUser } from "./helpers/signout.helper";
import { createUsername } from "./helpers/username.helper";
import { getAllPhotos } from "./helpers/get.all.photos.helper";
import { getUsersUsername } from "./helpers/get.username.dynamo.helper";
import { getUsersPhoto } from "./helpers/profile.query.dynamo.helper";
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

app.get("/explorepage", async (req, res) => {
    console.log(req.session);
    const allPhotos = await getAllPhotos();
    const allPhotosSignedURLs = signUrls(allPhotos.Items);
    res.render("explorepage", { allPhotosSignedURLs, allPhotos });
});

app.get("/signout", (req, res) => {
    signOutUser(req.session.accesstoken);
    req.session.accesstoken = "";
    res.render("index");
});

app.get("/profile/:id", async (req, res) => {
    const name = await getUsersUsername(req.session.userId)
    const currentUser = name.Items[0].userName;
    const { id } = req.params;
    console.log("id:", id);
    if (currentUser === id) {
        const usersPhotos = await getUsersPhoto(currentUser);
        console.log("current user:", currentUser);
        const usersSignedURLs = signUrls(usersPhotos.Items);
        console.log("users photos:", usersPhotos);
        res.render("profile", { usersPhotos, currentUser, usersSignedURLs });
    } else {
        const specificUsersPhotos = await getUsersPhoto(id);
        const usersSignedURLs = signUrls(specificUsersPhotos.Items);
        res.render("specificProfile", {
            specificUsersPhotos,
            id,
            usersSignedURLs,
        });
    }

    // const usersPhotos = await getUsersPhoto(userId);
    // const usersSignedURLs = signUrls(usersPhotos.Items);
    // res.render("profile", { usersPhotos, userId, usersSignedURLs });
    // const { id } = req.params;
    // const specificUsersPhotos = await getProfilePhoto(id);
    // const usersSignedURLs = signUrls(specificUsersPhotos.Items);
    // res.render("specificProfile", { specificUsersPhotos, id, usersSignedURLs });
});

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    req.session.name = name;
    signUpUsers(email, password, name);
    await createUsername(email, name);
    res.redirect("explorePage");
});

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const accessTokenData = await signInUser(email, password);
    req.session.accessToken = accessTokenData.AuthenticationResult.AccessToken;
    req.session.userId = email;
    // console.log("access token", req.session.accesstoken);
    console.log(req.session);
    res.redirect("explorepage");
    // const userId = email;
    // const usersPhotos = await getUsersPhoto(userId);
    // const usersSignedURLs = signUrls(usersPhotos.Items);
    // res.render("profile", { usersPhotos, userId, usersSignedURLs });
});

app.post("/upload", upload.single("file"), async (req, res) => {
    console.log("in the upload route");
    const { originalname } = req.file;
    const pathname = req.file.path;
    const uploadTime = new Date();
    const photoId = uniqid();
    const bucketName = "instagram-clone-bucket-emma";
    const name = req.body.currentUser;
    const { userId } = req.session
    console.log("this is the userId:", userId)
    // console.log("req.body.currentUser:", req.body.currentUser);
    // console.log("req.body.Object", req.body.Object)
    // console.log("this is the userId:", userId)
    // const userName = await getUsersUsername(userId);
    // const name = userName.Items[0].userName;
    console.log(
        "upload params:",
        originalname,
        photoId,
        uploadTime,
        name,
        userId,
        bucketName,
        pathname
    );
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
