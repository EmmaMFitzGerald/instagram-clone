import * as express from "express";
import * as path from "path";
// import timestamp = require("time-stamp");
// eslint-disable-next-line import/named
import { uploadPhoto } from "./handlers/photo.handler";

const app = express();
const port = 3000;
app.set("view engine", "ejs");
const staticDir = path.join(__dirname, "../public");
console.log(`Static direction is: ${staticDir}`);
app.use(express.static(staticDir));
import multer = require("multer");
const upload = multer({ dest: "uploads/" });
import uniqid = require("uniqid");

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/upload", upload.single("file"), async (req, res, next) => {
    const { originalname } = req.file;
    const pathname = req.file.path;
    const uploadTime = new Date();
    const photoId = uniqid();
    const userId = "123";
    const bucketName = "instagram-clone-bucket-emma";

    uploadPhoto(
        originalname,
        photoId,
        uploadTime,
        userId,
        bucketName,
        pathname,
        res
    );
});

app.get("/profile", (req, res) => {
    console.log(req);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
