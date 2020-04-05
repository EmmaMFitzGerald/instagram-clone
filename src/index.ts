import * as express from "express";
import * as path from "path";

// import timestamp = require("time-stamp");
// eslint-disable-next-line import/named
import * as uniqid from "uniqid";
import { uploadPhoto } from "./handlers/photo.handler";
import { getUsersPhoto } from "./helpers/query.dynamo.helper";
import { signUrls } from "./helpers/signed.url.helper";
// import methodOverride = require("method-override");
const app = express();
// app.use(express.urlencoded({ extended: false }));
// app.use(methodOverride("_method"));
const port = 3000;
app.set("view engine", "ejs");
const staticDir = path.join(__dirname, "../public");
console.log(`Static direction is: ${staticDir}`);
app.use(express.static(staticDir));
import multer = require("multer");
const upload = multer({ dest: "uploads/" });

const userId = "123";

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/upload", upload.single("file"), async (req, res) => {
    const { originalname } = req.file;
    const pathname = req.file.path;
    const uploadTime = new Date();
    const photoId = uniqid();
    const bucketName = "instagram-clone-bucket-emma";

    await uploadPhoto(
        originalname,
        photoId,
        uploadTime,
        userId,
        bucketName,
        pathname,
        res
    );
    console.log("here");
});

app.get("/profile", async (req, res) => {
    const usersPhotos = await getUsersPhoto(userId);
    console.log(usersPhotos.Items);
    signUrls(usersPhotos.Items);
    // res.render("profile", { usersPhotos, userId });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
