import * as express from "express";
import * as path from "path";
const app = express();
const port = 3000;
app.set("view engine", "ejs");
const staticDir = path.join(__dirname, "../public");
console.log(`Static direction is: ${staticDir}`);
app.use(express.static(staticDir));
import multer = require('multer');
const upload = multer({ dest: 'uploads/' });
import uniqid = require("uniqid");
const timestamp = require('time-stamp');
import { addPhotoToDb } from "./addPhotoToDb"
import { uploadPicture } from './uploadHandler'

app.post('/upload', upload.single('file'), (req, res, next) => {
    const { originalname } = req.file
    const uploadTime = timestamp('YYYYMMDDHHMM')
    const photoId = uniqid();
    const userId = uniqid();
    addPhotoToDb(originalname, photoId, uploadTime, userId)
});

app.get("/", (req, res) => {
    res.render("../ts-template/views/index")
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


