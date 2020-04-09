import * as express from "express";
import * as path from "path";
import Amplify, { Auth } from "aws-amplify";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import * as session from "express-session";
// import timestamp = require("time-stamp");
// eslint-disable-next-line import/named
import * as uniqid from "uniqid";
import { uploadPhoto } from "./handlers/photo.handler";
import { getUsersPhoto } from "./helpers/query.dynamo.helper";
import { signUrls } from "./helpers/signed.url.helper";
import { signUpUsers } from "./helpers/signup.helper";
import { signInUser } from "./helpers/signin.helper";
import { signOutUser } from "./helpers/signout.helper";
import { createUsername } from "./helpers/username.helper";
import { getAllPhotos } from "./helpers/get.all.photos.helper";
import { getUsersUsername } from "./helpers/get.username.dynamo.helper";
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

app.get("/profile/:id", (req, res) => {
    const id = req.params.id;
    console.log(id)
});

app.get("/signin", (req, res) => {
    if (!req.session.accesstoken) {
        res.render("signin");
    } else {
        res.render("profile");
    }
});

app.get("/explorepage", async (req, res) => {
    const allPhotos = await getAllPhotos();
    const allPhotosSignedURLs = signUrls(allPhotos.Items);
    console.log("THis is all photos", allPhotos.Items)
    res.render("explorepage", { allPhotosSignedURLs, allPhotos });
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
app.get("/signout", (req, res) => {
    console.log("this is the access token", req.session.accesstoken);
    signOutUser(req.session.accesstoken);
    req.session.accesstoken = "";
    res.render("index");
});

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    req.session.name = name;
    signUpUsers(email, password, name);
    await createUsername(email, name);
});

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const accessTokenData = await signInUser(email, password);
    console.log(accessTokenData.AuthenticationResult.AccessToken);
    req.session.accesstoken = accessTokenData.AuthenticationResult.AccessToken;
    req.session.userId = email;
    console.log("access token", req.session.accesstoken);
    const userId = email;
    const usersPhotos = await getUsersPhoto(userId);
    const usersSignedURLs = signUrls(usersPhotos.Items);
    res.render("profile", { usersPhotos, userId, usersSignedURLs });
});

app.post("/upload", upload.single("file"), async (req, res) => {
    const { originalname } = req.file;
    const pathname = req.file.path;
    const uploadTime = new Date();
    const photoId = uniqid();
    const bucketName = "instagram-clone-bucket-emma";
    const { userId } = req.body;

    const userName = await getUsersUsername(userId);
    const name = userName.Items[0].userName;

    await uploadPhoto(
        originalname,
        photoId,
        uploadTime,
        userId,
        bucketName,
        pathname,
        name
    );
    console.log("here");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
