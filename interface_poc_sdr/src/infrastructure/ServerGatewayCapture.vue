<template>
    <div></div>
</template>
  
  <script>
  
  export default {
    name: 'ServerGatewayCapture',
    props:  ["formData", "sendData", "actualSDR"],
    emits: ["dataRetrieved"],
    data() {
        return {
            results: {},
            sendForm: {},
        }
    },
    methods: {
      sendRequestToServer: async function(){
          try {
            const response = await fetch("http://localhost:5000/capture", {
              method: "POST",
              headers: {
                "Accept" : "application/json",
                "Content-Type" : "application/json",
              },
              body: JSON.stringify({form: this.formData, sdr: this.actualSDR}),
            })
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            console.log(result);
            this.retrieveResponse(result)
          } catch (err) {
            console.error("Error:",err)
          }
      },
      retrieveResponse: function(result) {
        console.log(result);
        this.$emit("dataRetrieved", result.result);
      },
    },
    watch: {
      sendData: function(newVal, oldVal) {
        (newVal != oldVal && newVal) ? this.sendRequestToServer() : {};
      },
    }
  }
  </script>
  
  <style scoped>

  </style>