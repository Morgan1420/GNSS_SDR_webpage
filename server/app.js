import { processCapture } from "./utils/processCapture.js";
import { getFiles, downloadFile, removeFile, renameFile, uploadFile} from "./utils/myFiles.js";

import express from "express";
import cors from "cors";
import multer from "multer";


/* UPLOAD SINGLE FILE
 * This function will be used to upload a single file to the server.
 * The file will be stored in the "./File_System/Uploads" directory.
 * The file will be stored with the original name.
 * This function will be called at: fileExplorer.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./File_System/Uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({storage: storage});



// GLOBAL VARIABLES
const app = express();
app.use(express.json());
const port = 5000

// CAPTURE FUNCTIONS
app.options("/capture", cors()); 
app.post("/capture", processCapture); 

// FILES & FILE SYSTEM FUNCTIONS   
app.options("/getFiles", cors());
app.post("/getFiles", getFiles);
app.options("/download", cors());
app.get("/download", downloadFile);
app.options("/remove", cors());
app.get("/remove", removeFile);
app.options("/rename", cors());
app.get("/rename", renameFile);
app.options("/rename", cors());
app.post("/upload", upload.single("file"), uploadFile);


app.listen(port, () => {
  console.log(`Listen on ${port}`);
})