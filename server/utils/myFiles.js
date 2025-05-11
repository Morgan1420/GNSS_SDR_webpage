
import fs from "fs";
import path from "path";
import archiver from "archiver";



// DIRECTORY NAVIGATION FUNCTIONS
export let getFiles = async function (req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");

  // Extract directories from request
  let directories = req.body.directories || [];

  // Construct the full nested directory path (e.g., "./dir1/dir2")
  let fullPath = path.join(".", ...directories); 

  // Initialize object to store files and directories
  let filesDirectory = {};
  
  // Read metadata file
  let metadata = JSON.parse(fs.readFileSync("./metadata/capturesMetadata.json", {encoding: "utf8"}));

  // Read the directory
  await fs.readdir(fullPath, (err, files) => {
    if(files == null){
      // This prevents the showing of an error message in case there are no files 
      // console.error("There are no saved files.") 
      console.log("Empty directory");
      res.send({filesDirectory});
    }
    else{
      files.forEach(async (file) => {
        try {
          // Create the format of each file
          let stats = await fs.statSync(fullPath + "/" + file);
          filesDirectory[file] = {
            fileStatistic: stats, // Some file stats (date of creation, size...)
            fileMetaData: metadata[file.replace(/\.[^/.]+$/, "")], // some metadata related to the project
            isDirectory: stats.isDirectory() // Indicator whether the file is a directory or not
          };

          // Send the file/directory data
          if(Object.keys(filesDirectory).length == files.length) {
            res.send({filesDirectory});
            res.end();
          }
        } catch (err) {
            console.error(err);
        }
      })
    }
  }); 
}

// FILE ACTION FUNCTIONS
// Download
export let downloadFile = async function(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  
  // Retrieve the path
  let filePath = await req.query.path;
  console.log(filePath);

  // If the file is non existent inform the frontend
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `File or directory not found${filePath}`});
  }
  
  let fileName = path.basename(filePath); // Extract the name of the file to be downloaded 
  let parentDirectory = path.dirname(filePath); // Extract the directory of the file to be downloaded 

  try {
    // Check if path is a file or directory
    let stat = fs.statSync(filePath);

    if (stat.isFile()) { // The requested file is a file
      // We can download the file directly, no need for compression
      res.header("Content-Disposition", "attachment; filename="+filePath)
      res.download(filePath);
    }else{ // The requested file is in fact a directory
      // To send a directory we must compress it (.zip) 
       let zipName = `${fileName}.zip`;
       let zipPath = path.join(parentDirectory, zipName);
 
       let output = fs.createWriteStream(zipPath);
       let archive = archiver("zip", { zlib: { level: 9 } });
 
       archive.pipe(output);
       archive.directory(filePath, false);
       archive.finalize();
 
       output.on("close", function () {
         res.header("Content-Disposition", `attachment; filename=${zipName}`);
         res.download(zipPath, zipName, (err) => {
           if (err) {
             console.error("Download error:", err);
             res.status(500).json({ error: "Failed to download directory" });
           }
           fs.unlinkSync(zipPath); // Cleanup the zip file after download
         });
       });
    }

  }catch (err) {
    console.log(err);
  }
    
}
// Rename
let renameMetadata = function(filename, newname) {
  let metadata = JSON.parse(fs.readFileSync("./metadata/capturesMetadata.json", "utf-8"));
  let auxData = metadata[filename];
  metadata[newname] = auxData;
  delete metadata[filename];
  fs.writeFileSync("./metadata/capturesMetadata.json", JSON.stringify(metadata), {encoding: "utf8", flag: "w"});
}
export let renameFile = async function(req, res) {
  console.log("[-] Renaming file...");
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  try {
    // Retrieve the path to the file to rename
    let directories = await req.query.directory;
    
    // Construct the full nested directory path (e.g., "./dir1/dir2")
    let fullPath = path.join(".", ...directories); 
    console.log("   directory is: ", fullPath);

    // Retrieving the file names (old and new)
    let oldFileName = await req.query.oldName
    let newFileName = await req.query.newName;
    console.log("   file to rename: ", oldFileName);
    console.log("   new file name: ", newFileName);

    // Renaming the file
    fs.renameSync(fullPath + "/" + oldFileName, fullPath + "/" + newFileName);
    await renameMetadata(oldFileName, newFileName);

    console.log("[+] File renamed correctly");
    res.send({result: "Renammed Correctly"});
    res.end();

  } catch (err) {
    console.log(err);
  }
}
// Remove
let removeMetadata = function(filename) {
  let metadata = JSON.parse(fs.readFileSync("./metadata/capturesMetadata.json", "utf-8"));
  delete metadata[filename];
  fs.writeFileSync("./metadata/capturesMetadata.json", JSON.stringify(metadata), {encoding: "utf8", flag: "w"});
}
export let removeFile = async function(req, res) {
  console.log("[-] Removing file...");
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  try {
    // Retrieve the directory path
    let directories = req.query.directory;
    let fullPath = path.join(".", ...directories);
    console.log("   Directory is:", fullPath);

    // Retrieve the file or directory to delete
    let fileToRemove = req.query.fileToRemove;
    let targetPath = path.join(fullPath, fileToRemove);
    console.log("   Target path to remove:", targetPath);

    // Check if the path exists before attempting to delete
    if (!fs.existsSync(targetPath)) {
      console.log("   [!] Target does not exist:", targetPath);
      return res.status(404).send({ error: "File or directory not found" });
    }

    // Check if it's a directory
    const stats = fs.statSync(targetPath);

    if (stats.isDirectory()) {
      // Remove directory and its contents
      fs.rm(targetPath, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error("[!] Error deleting directory:", err);
          return res.status(500).send({ error: "Failed to delete directory" });
        }
        console.log("[+] Directory removed successfully");
        res.send({ result: "Directory removed successfully" });
      });

    } else {
      // Remove file
      fs.unlink(targetPath, (err) => {
        if (err) {
          console.error("[!] Error deleting file:", err);
          return res.status(500).send({ error: "Failed to delete file" });
        }
        console.log("[+] File removed successfully");
        res.send({ result: "File removed successfully" });
      });
    }

  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ error: "Internal server error" });
  }
}

// UPLOAD FILE
export let uploadFile = async function(req, res) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  try {
    let file = await req.file;
    if (file) {
      res.send({result: "OK"})
      res.end();
    } else {
      throw new Error("No File Sent");
    }
      
  } catch (err) {
    console.log(err);
  }
}