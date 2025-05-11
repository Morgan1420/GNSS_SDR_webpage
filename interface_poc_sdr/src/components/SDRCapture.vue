<template>
  <h1>SDR Capture</h1>
  <div class="SDR-flexbox">

    <div class="SDR-selector">
      <button class="button-SDR-selection"
              @click="manageSDRSelection(sdr)"   
              role="button" 
              :id="sdr == actualSDR ? 'selected' : 'not-selected'"
              v-for="sdr in sdrAvailable" :key="sdr">{{ sdr }}
      </button>
    </div>
      
    <div class="SDR-form">
      <SDRForm :sdr-selected="actualSDR"></SDRForm>
    </div>
    
  </div>  
</template>
  
<script>
  import SDRForm from './SDRForm.vue';
  import sdrForm from './../../../shared/formDictionary.js';

  export default {
    name: 'SDRCapture',
    data() {
      return  {
        sdrAvailable: [],
        actualSDR: "",
      }
    },
    methods: {
      manageSDRSelection(selected) {
        this.actualSDR = selected; 
      },     
    },
    created: function(){
      this.sdrAvailable = Object.keys(sdrForm);
      this.actualSDR = this.sdrAvailable[0];
    },
    components: {
      SDRForm
    }
  }
</script>
  
<style scoped>
  .SDR-flexbox{
    width: 100%;

    display: flex;
    flex-direction: column;
    align-content: center;
    gap: 20px;
  }

  .SDR-selector {
    width: 50%;
    margin-top: 1.5%;
    margin-bottom: 1%;

    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    gap: 20px;    
    align-self: center;
  }
  .SDR-form {
    width: 100%;
    align-items: center;
  }

  .button-SDR-selection {
    padding: .75rem 1.2rem;

    background-color: #c9d3fd;
    border: 0px; /* No border */
    border-radius: .75rem;

    font-size: 1.125rem;
    font-weight: 600;
    text-align: center;
    color: #007acc;
    
    cursor: pointer;
  }
  #selected {
    background-color:  #007acc;
    color: white;
  }


  @media (min-width: 768px) {
    .button-SDR-selection {
      padding: .75rem 1.5rem;
    }
  }
</style>