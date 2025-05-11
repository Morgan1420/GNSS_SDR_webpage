<template>
  <div class="sidebar">

    <div class="sidebar-top">
      <div class="sidebar-header" v-on:click="$emit('home-page', 'Home Page')"> PoC SDR</div>
      <!-- GENERAL ELEMENTS -->
      <div class="sidebar-element" v-on:click="$emit('file-explorer', 'File Explorer')" v-html="changeHTMLofSelectedElement(elements['file-explorer'])"></div>
      <div class="sidebar-element" v-on:click="$emit('sdr-capture', 'SDR Capture')" v-html="changeHTMLofSelectedElement(elements['sdr-capture'])"></div>

      <!-- GNSS ELEMENTS -->
      <div class="sidebar-element-divider"><hr><p>GNSS</p><hr></div>
      <!-- alguns noms podrien canviar per tal de ser mes descriptius/clars/nets/... --> 
      <div class="sidebar-sub-element" v-on:click="$emit('gnss-receiver', 'GNSS Receiver')" v-html="changeHTMLofSelectedElement(elements['gnss-receiver'])"></div>
      <div class="sidebar-sub-element" v-on:click="$emit('gnss-results', 'GNSS Results')" v-html="changeHTMLofSelectedElement(elements['gnss-results'])"></div>

      <!-- OTHER ELEMENTS -->
      <div class="sidebar-element-divider"></div> <!-- This element's purpose is to create and empty space after the LEO section without having to make too many css changes -->
      <div class="sidebar-element-divider"></div> <!-- This element's purpose is to create and empty space after the LEO section without having to make too many css changes -->
      <div class="sidebar-element">FAQs ?</div>
      <div class="sidebar-element">Contact us ?</div>
      <div class="sidebar-element" v-on:click="$emit('help', 'Help')" v-html="changeHTMLofSelectedElement(elements['help'])"></div>



    </div>

    <div class="sidebar-footer">
      <h3>SPCOMNAV - UAB Research Group &copy;</h3>
    </div>
  </div>
</template>
  
<script>


  export default {
    name: 'SideBar',
    data() {
      return {
        elements: {
          "file-explorer" : "File Explorer",
          "sdr-capture" : "SDR Capture",
          "gnss-receiver" : "GNSS Receiver",
          "gnss-results" : "GNSS Results",
          "orbital-sim" : "Orbital Sim",
          "leo-receiver" : "LEO Receiver",
          "leo-results" : "LEO Results",
          "help" : "Help"
        },
      }
    },
    emits: ["home-page", "file-explorer", "sdr-capture", "gnss-receiver", "gnss-results", "leo-receiver" ],
    props: ["actual-page"],
    methods: {
      changeHTMLofSelectedElement(section){
        return section == this.actualPage ? "<b>" + section + "</b>" : section;
      },
      actualPageEffect(section){
        return section == this.actualPage ? "<b>" + section + "</b>" : section;
      }

    }
  }
</script>
  
<style scoped>
  .sidebar {
    position: fixed;

    height: 100vh;
    width: 250px;

    top: 0;
    left: 0;
    background-color: #0074c1;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* TOP SECTION */
  /* HEADER */
  .sidebar-header{
    margin-top: 20px;
    margin-bottom: 50px;
    color: white;
    text-align: center;
    font-size: 1.6em;
    font-weight: bold;
  }
  
  /* ELEMENTS */
  .sidebar-element, .sidebar-sub-element{
    padding-top: 16px;
    padding-bottom: 12px;
    padding-inline: 25px;
    text-align: left;
    color: white;
    font-weight: normal;
    font-size: 1.2em;
  }
  .sidebar-element:hover, .sidebar-sub-element:hover {
    background-color: #005b99;
  }
  .sidebar-sub-element{
    padding-left: 35px;
  }
  /* element dividers */
  .sidebar-element-divider{
    margin-block: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .sidebar-element-divider hr{
    height: 0px;
    width: 30%;
    align-self: center;
    border: 1px dashed white;
  }
  .sidebar-element-divider p{
    font-weight: bold;
    padding-inline: 10px;
    font-size: .9em;
    color: white;
  }
  .sidebar ul{
    list-style-type: none;
    padding: 0;
    flex-grow: 1;
  }

  .sidebar ul li {
    padding: 10px;
    margin-left: 5px;
    padding-left: 0px;
    text-align: center;
  }

  .sidebar ul li a{
    color: white;
    text-decoration: none;
    display: block;
    padding: 10px;
    padding-left: 0px;
    text-align: left;
  }

  .sidebar ul li a:hover{
    background-color: #005b99;
  }

  .sidebar-footer h3{
    padding: 10px;
    padding-top: 20px;
    border-top: 1px solid white;
    color: white;
  }
</style>
  