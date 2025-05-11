<template>
    <div class="SDR-form-header">Capture with {{ sdrSelected }}</div>
    <form class="SDR-form-body">
        <div class="formulario-acciones">
            <div v-for="campo in campos" :key="campo" class="campo">
                <label :for="campo.name"> {{ campo.description }} {{  (campo.units != undefined ? "[" + campo.units + "]" : "") }}</label>
                <input v-if="campo.type=='input'" :id="campo.name" :type="campo.typeContent" :step="campo.step != undefined ? campo.step : ''" v-model="formData[campo.name]"/>
                <select v-if="campo.type=='selector'" name="campo.name" id="campo.name" v-model="formData[campo.name]">
                    <option v-for="option in campo.options" :key="option">{{ option }}</option>
                </select>
            </div>
            
        </div>
    </form>
    <div class="SDR-form-footer">
      <button class="action-button, button-40" @click="resetData" type="button">Reset</button>
      <button class="action-button, button-40" @click="sendData" type="button">Send</button>
    </div>

    <div v-if="showResult" class="result">
        <h2 class="result-title"> {{ result.title }} </h2>
        <p class="result-message"> {{ result.message }}</p>
    </div>
    <ServerGatewayCapture :form-data="formData" :send-data="sendDataFlag" :actual-s-d-r="actualSDR" @data-retrieved="captureEnd"></ServerGatewayCapture>
</template>
  
<script>
  import sdrForm from './../../../shared/formDictionary.js';
  import ServerGatewayCapture from "./../infrastructure/ServerGatewayCapture.vue";
  export default {
    name: 'SDRForm',
    data() {
      return {
        campos: {},
        actualSDR: "",
        formData: {},
        emptyForm: {},
        sendDataFlag: false,
        showResult: false,
        result: {},
      }
    },
    props: ["sdrSelected"],
    watch: {
      sdrSelected: function(newVal, oldVal){
        if (newVal != oldVal) {
          this.actualSDR = newVal;
          this.campos = sdrForm[newVal]
        }
        this.resetData();
      },
    },
    methods: {
      resetData(){
        let empty = function(objective) {
          Object.keys(objective).forEach(function (k) {
            if (objective[k] && typeof objective[k] == "object") {
              return empty(objective[k]);
            }
            
            objective[k] = "";
          });
        }

        empty(this.formData);
        
        Object.keys(this.formData).forEach((value) => {
          if (!(value in Object.keys(this.campos))) {
            delete this.formData[value]
          }
        });
        
        this.showResult=false;
      },
      sendData() {
        this.sendDataFlag = true;
        this.showResult = false;
      },
      captureEnd(event) {
        this.sendDataFlag = false;
        this.result = event;
        this.showResult = true;
      }
    },
    created: function(){
      this.actualSDR = Object.keys(sdrForm)[0];
      this.campos = sdrForm[this.actualSDR];
      Object.keys(this.campos).forEach((campo) => {
        this.formData[campo] = "";
      });
      
    },
    components: {
      ServerGatewayCapture
    }
  }
</script>
  
<style scoped>
  /* FORM HEADER */
  .SDR-form-header {
    padding-top: 20px;
    padding-bottom: 15px;

    background-color: #007acc;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;

    color: white;
    font-weight: bold;
    font-size: large;
  }

  /* FORM BODY */
  .SDR-form-body{
    padding-top: 35px;
    padding-inline: 5%;

    display: grid;
    grid-template-columns: 1fr;
    row-gap: 40px;

    background-color: #e2e7fe;
  }
  .campo{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }
  .campo label{
    width: 45%;
    align-self: center;
  }
  .campo input, .campo select{
    width: 80%;
    padding: 8px;
    margin-right: 5px;  /* Space between input and unit */

    border: none;
    outline: none;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15); /* Subtle shadow for depth */  
    
    font-size: .9em; 

  }
  .campo select{
    /* For some reason the select field wants to be a tiny-bit shorter than the input, this fixes it */
    width: 81%; 
  }

  /* FORM FOOTER */
  .SDR-form-footer {

    padding-block: 10px;

    background-color: #007acc;
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 15px;


    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20%;
  }
  .SDR-form-footer button{
    width: 20%;
    background-color: white;
    color: black;
  }

    .formulario-acciones {
        display: grid;
        row-gap: 20px;
    }

    .button-40 {
    background-color: #111827;
    border: 1px solid transparent;
    border-radius: .75rem;
    box-sizing: border-box;
    color: #FFFFFF;
    cursor: pointer;
    flex: 0 0 auto;
    font-family: "Inter var",ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.5rem;
    padding: .75rem 1.2rem;
    text-align: center;
    text-decoration: none #6B7280 solid;
    text-decoration-thickness: auto;
    transition-duration: .2s;
    transition-property: background-color,border-color,color,fill,stroke;
    transition-timing-function: cubic-bezier(.4, 0, 0.2, 1);
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    width: auto;
  }

  .button-40:hover {
    background-color: #374151;
  }

  .button-40:focus {
    box-shadow: none;
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  @media (min-width: 768px) {
    .button-40 {
      padding: .75rem 1.5rem;
    }
  }


  </style>