<template>
    <div></div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: "ServerGatewayMyfiles",
    props: ["listOfDirectories", "downloadFile", "downloadFlag", "removeFile", "removeFlag", "renameFile", "renameFlag", "renameNewName", "uploadFile", "uploadFlag"],
    emits: ["dataRetrieved"],
    data(){
      return{
        filesArray: [],
      }
    },
    methods: {
      // DIRECTORY NAVIGATION
      requestFilesToServer: async function() {
        try {
          const response = await axios.post(
            "http://localhost:5000/getFiles",
            { directories: this.listOfDirectories } // Send the list of directories
          );
            
          // Access the parsed JSON data directly
          const result = response.data; // "response.json" looks like... see annex 1
          if (result==null){
            this.$emit("dataRetrieved", "NoContentInDir"); 
          }
          else {
            this.$emit("dataRetrieved", result); 
          }
          

          return;
        } catch (err) {
          // Log the error
          console.error("Error:", err.message || err);
                
          // Optionally handle specific errors
          if (err.response) {
            console.error(`HTTP error! Status: ${err.response.status}`);
          }
        }
      },
      // FILE ACTIONS
      downloadRequest: async function() {
        // Construct the full nested directory path
        let directoryPath = ".";
        for (let directory of this.listOfDirectories) {  // Use 'for...of' to iterate over values
          directoryPath += directory;  // Append each directory with a separator
        }
        let fullPath = directoryPath + "/" + this.downloadFile;  // Append file to path

        // Create the request URL
        let URL = "http://localhost:5000/download?path=" + fullPath;
        
        // 
        const fileName = this.downloadFile;
        const link = document.createElement("a");
        link.href = URL;
        link.setAttribute("download", `${fileName}`)
        document.body.appendChild(link);
        link.click();
      }, 
      renameRequest: async function() {
        // Safety checks
        if (this.renameNewName == "") { return; } // Don't let the user send an empty name 
        
        // Request
        try {
          const response = await axios.get("http://localhost:5000/rename", {
            params: {
              directory: this.listOfDirectories,
              oldName: this.renameFile,
              newName: this.renameNewName
            },
            headers: {
              "Accept": "application/json"
            }
          });
            
          return response.data;
        } catch (err) {
          console.error("Error:", err.response ? err.response.data : err.message);
        }
      },
      removeRequest: async function() {
        // Make the request
        try{
          const response = axios.get("http://localhost:5000/remove",{
            params: {
              directory: this.listOfDirectories,
              fileToRemove: this.removeFile,
            },
            headers: {
              "Accept": "application/json"
            },
          });

          return response.data; 
        } catch (err) {
          console.error("Error:", err.response ? err.response.data : err.message);
        }
      },
      // UPLOAD FILE
      uploadRequest: async function() {
        // Safety checks
        if (!this.uploadFile) {
          console.error("No file selected for upload.");
          return;
        }

        // Add the file to the data to be sent
        let formData = new FormData();
        formData.append("file", this.uploadFile);

        // Send the data
        try {
          const response = await axios.post("http://localhost:5000/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        
          console.log("File uploaded successfully:", response.data);
        } catch (err) {
          console.error("Upload error:", err.response ? err.response.data : err.message);
        }

      },
    },
    created: async function () {
      this.requestFilesToServer();
    },
    
    watch: {
      listOfDirectories: {
        handler() {
          this.requestFilesToServer();
        },
        deep: true, // Enables tracking changes within the array
      },
      downloadFlag: function(newVal, oldVal) {
        if (newVal != oldVal) {
          this.downloadRequest();
        }
      },
      renameFlag: async function(newVal, oldVal) {
        if (newVal != oldVal) {
          this.renameRequest();
          this.requestFilesToServer(); // Reload the files displayed on screen
        }
      },
      removeFlag: async function(newVal, oldVal) {
        if (newVal != oldVal) {
          this.removeRequest();
          this.requestFilesToServer(); // Reload the files displayed on screen
        }
      },
      uploadFlag: async function(newVal, oldVal) {
        if (newVal != oldVal) {
          this.uploadRequest();
          this.requestFilesToServer(); // Reload the files displayed on screen
        }
      },
        
    }
    }

    /* */
</script>

<style scoped>
</style>

<!--  ANNEX 1 

→ THE FORMAT OF THE "this.filesArray" dictionary or the "response.json" 
  in the "sendRequestToServer" function looks something like:


{
  "filesDirectory": {
    "file1.txt": {
      "fileStatistic": {
        "size": 1024,
        "atimeMs": 1672531199123.456,
        "mtimeMs": 1672531199123.456
      },
      "fileMetaData": {
        "description": "Sample metadata",
        "createdBy": "User123"
      },
      "isDirectory": false
    },
    "folder1": {
      "fileStatistic": {
        "size": 4096
      },
      "fileMetaData": {},
      "isDirectory": true
    }
  }
}



-->
