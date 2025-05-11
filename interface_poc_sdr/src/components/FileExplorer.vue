<template>
    <h1>File Explorer</h1>
    <br><br>

    <div class="file-table">

      <!-- FILE TABLE - HEADER -->
      <div class="file-table-header">
        <!-- Falta fer ordre per mida i, per cadascun, cal ordenar en ordre ascendent i descendent -->
        <div class="file-name-header-element" @click="orderByName">Name</div>
        <div class="file-size-header-element">Size(MB)</div>
        <div class="file-date-header-element" @click="orderByDate">Date</div>
        <div class="file-action-header-element">Actions</div>
      </div>

      <!-- FILE TABLE - BODY -->
      <div class="file-table-body">
        <!-- GO BACK DIRECTORY button-->
        <div class="file-table-body-element-section" v-if="!this.directoryIsRoot">
          <div class="file-table-body-element-content-section" @click="goBackDirectory">
            <div class="file-name-body-element">
              <img src="../assets/File_System_Icons/open-folder.png">
              ..
            </div>
          </div>
        </div>

        <!-- FILE SYSTEM-->
        <div class="file-table-body-element-section" v-for="(file, name) in filesArray.filesDirectory" :key="file">
          
          <!-- FILE element section -->
          <div class="file-table-body-element-content-section" v-if="!file.isDirectory">
            <!-- name -->
            <div class="file-name-body-element">
              <img src="../assets/File_System_Icons/file.png">
              {{ name }}
            </div>
            <!-- size, date -->
            <div class="file-size-body-element"> {{ (file.fileStatistic.size / 1024).toFixed(3) }} </div>
            <div class="file-date-body-element"> {{ file.fileStatistic.mtime.replace(/T/, ' ').replace(/\..+/, '') }}</div>
            <!-- actions -->
            <div class="file-action-body-element" >
              <div @click="downloadHandler(name)" ><img src="../assets/File_System_Icons/download.png"></div>
              <div @click="renameHandler(name)" v-if="name != 'results.json'" ><img src="../assets/File_System_Icons/rename.png"></div>
              <div @click="removeHandler(name)" v-if="name != 'results.json'"><img src="../assets/File_System_Icons/recycle-bin.png"></div>
            </div>
          </div>

          <!-- DIRECTORY element section-->
          <div class="file-table-body-element-content-section" v-if="file.isDirectory" >
            <!-- name -->
            <div class="file-name-body-element" @click="enterDirectory(name)"> 
              <img src="../assets/File_System_Icons/open-folder.png">
              <b> {{ name }} </b> 
            </div>
            <!-- size, date -->
            <div class="file-size-body-element" @click="enterDirectory(name)"> - </div>
            <div class="file-date-body-element" @click="enterDirectory(name)"> {{ file.fileStatistic.mtime.replace(/T/, ' ').replace(/\..+/, '') }}</div>
            <!-- actions -->
            <div class="file-action-body-element">
              <div @click="downloadHandler(name)"><img src="../assets/File_System_Icons/download.png"></div>
              <div @click="renameHandler(name)" v-if="!directoryIsRoot"><img src="../assets/File_System_Icons/rename.png"></div>
              <div @click="removeHandler(name)" v-if="!directoryIsRoot"><img src="../assets/File_System_Icons/recycle-bin.png"></div>
            </div>
          </div>
          </div>
        </div>
        
      <!-- FILE TABLE - FOOTER -->
      <div class="file-table-footer">
      </div>
    </div>

    <!-- RENAME FORM -->
    <div class="small-form" v-if="renameClick" >
      <div class="small-form-label">New name:</div>
      <input class="small-form-input-text" type="text" v-model="newFileName" required>
      <div class="small-form-cancel-button" @click="closeRename">CANCEL</div>
      <div class="small-form-send-button" @click="renameHandlerLast()">RENAME</div>
    </div>

    <!-- DELETE FORM -->
    <div class="small-form" v-if="removeClick" >
      <div class="small-form-label">Delete element:</div>
      <div class="small-form-label"> {{ this.fileToRemove }}</div>
      <div class="small-form-cancel-button" @click="closeRemove">CANCEL</div>
      <div class="small-form-send-button" @click="removeHandlerLast()">REMOVE</div>
    </div>
    
    <!-- UPLOAD BUTTON & FORM-->
    <div class="upload-button" @click="uploadHandler">UPLOAD</div>
    <div class="upload-form" v-if="uploadClick">
      <div class="file-field">
        <div class="file-element">
          <label for="file-upload" class="custom-file-label">Choose File</label>
          <span id="file-name" class="file-name"> {{ }} </span>
          <input id="file-upload" class="file-input" type="file" @change="fileUploaded" />
        </div>
      </div>

      <div class="small-form-cancel-button" @click="closeUpload">CANCEL</div>
      <div class="small-form-send-button" @click="uploadHandlerLast()">UPLOAD</div>
    </div>

    <ServerGatewayMyfiles :list-of-directories="listOfDirectories"
                          :download-file="fileToDownload" 
                          :download-flag="downloadFlag" 
                          :remove-file="fileToRemove" 
                          :remove-flag="removeFlag" 
                          :rename-file="fileToRename"
                          :rename-new-name="newFileName" 
                          :rename-flag="renameFlag"
                          :upload-file="uploadFile"
                          :upload-flag="uploadFlag"
                          @data-retrieved="processFileArray"
                          ></ServerGatewayMyfiles>
    
</template>
  
<script>
  import ServerGatewayMyfiles from "@/infrastructure/ServerGatewayMyfiles.vue";

  export default {
    name: 'FileExplorer',
    data() {
      return  {
        filesArray: [], // Array containing all the data from the current files

        /* DIRECTORY NAVIGATION */
        listOfDirectories: ["/File_System"],
        directoryIsRoot: true,

        /* FILE ACTIONS */
        // Download file
        fileToDownload: "",
        downloadFlag: false,
        // Rename file
        fileToRename: "",
        renameClick: false,
        newFileName: "",
        renameFlag: false,
        // Remove file
        fileToRemove: "",
        removeClick: "",
        removeFlag: false,

        // UPLOAD FILE
        uploadClick: false,
        uploadFile: null,
        uploadFlag: false,
        
        /* ORDER BY - not in operation*/
        fileNames: [],
        nameOrd: "",
        dateOrd: "",
        dateOrder: false,
        nameOrder:false,
        orderby: "",
        showUpload: false,
      }
    },
    methods: {
      // DIRECTORY NAVIGATION
      processFileArray: function(event) {
        if (event == "NoContentInDir"){
          this.filesArray = {};
        }
        this.filesArray = event;

      },
      enterDirectory: function(directoryName) {
        this.filesArray = {};
        if (directoryName != "rinex.rnx"){
          // Sometimes the backend stores the rinex file as an empty directory, the bug must be fixed later, but this shouldn't give a problem now
          this.listOfDirectories.push("/"+directoryName); // Add the selected directory to the path
          this.directoryIsRoot = false; // This means we can now move back directories
        }
      },
      goBackDirectory: function() {
        // Remove the last visited directory
        this.listOfDirectories.pop();

        // We shouldn't go backwards the "File_System" directory
        if (this.listOfDirectories.length == 1){
          this.directoryIsRoot = true;  
        }
      },

      // FILE ACTIONS
      // Download file
      downloadHandler: function(filename) {
        this.fileToDownload = filename;
        this.downloadFlag = !this.downloadFlag;
        this.downloadingFile = true;       
      },
      // Rename file
      renameHandler: function(filename) {
        this.fileToRename = filename;
        this.renameClick = true;
      },
      renameHandlerLast: function(){
        this.renameFlag = !this.renameFlag;
        this.renameClick = false;
      },
      closeRename: function() {
        this.renameClick = false;
      },
      // Remove file
      removeHandler: function(filename) {
        this.fileToRemove = filename;
        this.removeClick = true;
      },
      removeHandlerLast: function(){
        this.removeFlag = !this.removeFlag;
        this.removeClick = false;
        this.filesArray = {};
      },
      closeRemove: function() {
        this.removeClick = false;
      },
      
      // UPLOAD FILE
      uploadHandler: function() {
        this.uploadClick = !this.uploadClick;
      },
      closeUpload: function() {
        this.uploadClick = false;
      },
      uploadHandlerLast: function(){
        if (this.uploadFile != null){
          this.uploadFlag = !this.uploadFlag;
          this.uploadClick = false;
        }
      },
      fileUploaded: function(event) {
        const file = event.target.files[0]; // Get the selected file

        if (file) {
          this.uploadFile = file; // Store the file in data property
        
          // Display file name in the UI (assuming `file-name` element exists)
          const fileNameElement = document.getElementById("file-name");
          if (fileNameElement) {
            fileNameElement.textContent = file.name;
          }
        }
      },


      // ORDER BY - functions (NOT WORKING YET)
      orderByDate: function() {
        if (this.filesArray.length > 0){
          this.orderby = "date";
          this.nameOrder = false;
          this.nameOrd = "";
          this.dateOrder = !this.dateOrder;
          this.dateOrder ? this.dateOrd = "asc" : this.dateOrd = "desc";
          if (this.dateOrd == "asc") {
            this.filesArray.filesDirectory = Object.entries(this.filesArray.filesDirectory)
              .sort(([, b], [ ,a]) => new Date(a.fileStatistic.mtime)-new Date(b.fileStatistic.mtime))
              .reduce((r, [k, v]) => ({...r, [k]: v}), {});
          } else {
            this.filesArray.filesDirectory = Object.entries(this.filesArray.filesDirectory)
              .sort(([, a], [ ,b]) => new Date(a.fileStatistic.mtime)-new Date(b.fileStatistic.mtime))
              .reduce((r, [k, v]) => ({...r, [k]: v}), {});
          }
        }
      },
      orderByName: function() {
        if (this.filesArray.length > 0){ 
          this.orderby = "name";
          this.dateOrder = false;
          this.dateOrd = "";
          this.nameOrder = !this.nameOrder;
          this.nameOrder ? this.nameOrd = "asc" : this.nameOrd = "desc";
          console.log(this.filesArray.filesDirectory);
          if (this.nameOrd == "asc") {
            this.filesArray.filesDirectory = Object.entries(this.filesArray.filesDirectory)
              .sort(([filenameA, ], [filenameB ,]) =>  filenameA.localeCompare(filenameB))
              .reduce((r, [k, v]) => ({...r, [k]: v}), {});
          } else {
            this.filesArray.filesDirectory = Object.entries(this.filesArray.filesDirectory)
              .sort(([filenameA, ], [filenameB ,]) => filenameB.localeCompare(filenameA))
              .reduce((r, [k, v]) => ({...r, [k]: v}), {});
          }
        }
      },

    },
    components: {
      ServerGatewayMyfiles,
    }
  }
</script>
  
<style scoped>

  /* FILE TABLE */
  .file-table {
    width: 100%;

    border-top-left-radius: 15px;
    border-top-right-radius: 15px;

    background-color: #e2e7fe;
  }

  /* FILE TABLE - HEADER */
  .file-table-header{
    width: 90%;
    padding-inline: 5%;
    padding-top: 15px;
    padding-bottom: 10px;

    border-top-left-radius: 15px;
    border-top-right-radius: 15px;

    background-color: #007acc;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  /* header elements */
  .file-name-header-element,
  .file-size-header-element,
  .file-date-header-element,
  .file-action-header-element{
    width: 20%;
    padding-inline: 2.5%;
    color: white;
    font-weight: bold;
  }

  /* FILE TABLE - BODY */
  .file-table-body{
    width: 100%;
    
    padding-top: 15px;
    padding-bottom: 10px;

    background-color: #e2e7fe;
  }
  .file-table-body :hover{ 
    background-color: #c9d3fd;
  }

  /* body - element section (to differentiate between small header and directories/files) */
  .file-table-body-element-section{
    height: fit-content;

    display: flex;
    padding-block: 20px;
    padding-inline: 5%;
    flex-direction: column;
  }
  
  /* body - element content section */
  .file-table-body-element-content-section{
    height: 50px;
    
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    align-items: center;
  }
  
  /* body elements */
  /* FILE TABLE - elements */
  .file-name-body-element{
    width: 20%;
    padding-inline: 2.5%;
    padding-block: 25px;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5%;

    text-align: left;
  }
  .file-size-body-element,
  .file-date-body-element{
    width: 20%;
    padding-inline: 2.5%;
    padding-block: 25px;
  }
  .file-action-body-element{
    width: 20%;
    padding-inline: 2.5%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .file-name-body-element img,
  .file-action-body-element img{
    height: 30px;
    width: 30px;   
  }
  .file-action-body-element img{
    padding: 10px;
    border-radius: 5px;
  }
  .file-action-body-element div :hover{
    background-color: #e2e7fe;
  }
  

  /* FILE TABLE - FOOTER */
  .file-table-footer{
    width: 90%;
    padding-inline: 5%;
    padding-top: 15px;
    padding-bottom: 10px;

    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;

    background-color: #007acc;

    display: flex;
    flex-direction: row;
    justify-content: center;
  }


  /* SMALL FORM */
  .small-form {
    position: fixed;
    top: 40%;
    left: 45%;
    z-index: 1;
    
    min-width: 20%;
    width: fit-content;
    padding: 10px;

    border: 4px solid #007acc;
    border-radius: 10px;
    
    background-color: white;
      
    display: grid;
    grid-template-columns: repeat(2, 1fr); 
    gap: 10px;     
  }
  .small-form-label{
    justify-content: center;
  }
  .small-form-input-text{
    justify-content: center;
  }
  .small-form-send-button,
  .small-form-cancel-button{
    padding-block: 15px;
    padding-inline: 10px;

    
    border-radius: 10px;

    color: white;
    font-weight: bold;

  }
  .small-form-send-button{
    background-color: #007acc;
  }
  .small-form-cancel-button{
    background-color: #c9d3fd;
  }
  
  /* Upload form - subtype of small form */
  .upload-form{
    position: fixed;
    top: 40%;
    left: 45%;
    z-index: 1;
    
    min-width: 20%;
    width: fit-content;
    padding: 10px;

    border: 4px solid #007acc;
    border-radius: 10px;
    
    background-color: white;
      
    display: grid;
    grid-template-columns: repeat(2, 1fr); 
    gap: 10px;     
  }
  .file-field{
    width: 100%;
    padding: 10px;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;

    grid-column: span 2;
  }
  .file-element{
    width: 80%;
    padding: 20px;
    padding-inline: 20px;
    
    border-radius: 20px;
    border-style: dashed;
    border-color: #007acc;
  }
  .file-input {
      display: none; /* Hide the default file input */
  }
  .custom-file-label {
    padding: 8px 16px;  
    margin-right: 15px;

    background-color: #007acc; /* Customize color */
      color: #fff;
      
      font-size: 14px;
      font-weight: bold;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
  }
  .custom-file-label:hover {
      background-color: #005b99; /* Darker shade for hover */
  }
  .file-name {
      color: #666;
      font-size: 14px;
      font-style: italic;
  }
  
  /* UPLOAD BUTTON */
  .upload-button{
    position: fixed;
    top: 50px;
    left: 80%;

    height: fit-content;
    width: fit-content;
    padding-inline: 30px;
    padding-block: 20px;

    border-radius: 10px;
    background-color: #007acc;

    color: white;
    font-weight: bold;
  }

</style>