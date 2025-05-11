<template>
  <SiteBar :actual-page="actualPage" @home-page="switchPage" @sdr-capture="switchPage" @file-explorer="switchPage" @help="switchPage"></SiteBar>
  <div class="pagescontent">
    <!---->
    <HomePage v-if="actualPage == 'Home Page'"></HomePage>
    <SDRCapture v-if="actualPage == 'SDR Capture'"></SDRCapture>
    <FileExplorer v-if="actualPage == 'File Explorer'"></FileExplorer>
    <HelpPage v-if="actualPage == 'Help'"></HelpPage>
  </div>
</template>

<script>
// Here we import all the pages
import SiteBar from './components/SiteBar.vue';
import HomePage from "./components/HomePage.vue";
import SDRCapture from "./components/SDRCapture.vue";
import FileExplorer from "./components/FileExplorer.vue";
import HelpPage from './components/help.vue';



export default {
  name: 'App',
  components: {
    SiteBar,
    HomePage,
    SDRCapture,
    FileExplorer,
    HelpPage
  },
  data() {
    return {
      actualPage: "Home Page"
    }
  },
  methods: {
    switchPage: function(page){
      this.actualPage = page;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.pagescontent{
  margin-left: 275px;
  width: 83%;
  
}

/* Base resolution: 1920x1080 (100%) */
@media (min-width: 1920px) and (min-height: 1080px) {
  body {
    zoom: 100%;
    font-size: 100%;
  }
}

/* 2560x1440 (125%) */
@media (min-width: 2560px) and (min-height: 1440px) {
  body {
    zoom: 125%;
    font-size: 125%;
  }
}

/* 3200x1800 (140%) */
@media (min-width: 3200px) and (min-height: 1800px) {
  body {
    zoom: 140%;
    font-size: 140%;
  }
}

/* 3840x2160 (150%) */
@media (min-width: 3840px) and (min-height: 2160px) {
  body {
    zoom: 150%;
    font-size: 150%;
  }
}

/* 5120x2880 (200%) */
@media (min-width: 5120px) and (min-height: 2880px) {
  body {
    zoom: 200%;
    font-size: 200%;
  }
}

/* 7680x4320 (300%) */
@media (min-width: 7680px) and (min-height: 4320px) {
  body {
    zoom: 300%;
    font-size: 300%;
  }
}


</style>
