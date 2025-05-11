let sdrForm = {
    "BladeRF": {
        "fileName": {
            type: "input",
            defaultValue: "",
            name: "fileName",
            description: "File Name",
            typeContent: "text",
        },
        "mode" :{
            type:"selector",
            defaultValue: "CS16",
            name: "mode",
            description: "Mode",
            options: ["CS16", "CS32"],
        },
        "samplingFreq": {
            type: "input",
            defaultValue: 0,
            typeContent: "number",
            description: "Sampling Frequency",
            name: "samplingFreq",
            units: "MHz",
        },
        "recordingTime" : {
            type: "input",
            defaultValue: 0,
            typeContent: "number",
            description: "Recording Time",
            name: "recordingTime",
            units: "s",
        },
        "carrierFrequency": {
            type: "input",
            defaultValue: 0,
            typeContent: "number",
            description: "Carrier Frequency",
            name: "carrierFrequency",
            units: "MHz",
        },
        "biastee" : {
            type: "selector",
            defaultValue: "Enabled",
            description: "Biastee",
            name: "biastee",
            options: ["Enabled", "Disabled"]
        },
        "executable": {

        }
    },
    "USRP N200 Ettus Research" : {
        "fileName": {
            type: "input",
            defaultValue: "",
            description: "File Name",
            name: "fileName",
            typeContent: "text",
        },
        "antenna": {
            type: "input",
            defaultValue: "TX/RX",
            description: "Antenna of the USRP",
            name: "antenna",
            typeContent: "text"
        },
        "samplingFrequency": {
            type:"input",
            defaultValue: 0,
            typeContent: "number",
            description: "Sampling Frequency",
            name: "samplingFrequency",
            units: "MHz",
            toUnits: "Hz"
        },
        "carrierFrequency": {
            type: "input",
            description: "Carrier Frequency",
            defaultValue: 0,
            typeContent: "number",
            name: "carrierFrequency",
            units: "MHz",
            toUnits: "Hz"
        },
        "gain" : {
            type: "input",
            defaultValue: 0,
            description: "Gain",
            typeContent: "number",
            name: "gain",
            units: "dB",
            step: 0.5,
            toUnits: "dB"
        },
        "recordingTime" : {
            type: "input",
            defaultValue: 0,
            typeContent: "number",
            description: "Recording Time",
            name: "recordingTime",
            units: "s",
            toUnits: "s"
        },
        "nSamples" :  { 
            type: "computed",
            value: ["recordingTime", "samplingFrequency"],
            operation: "*",
        },
        "executable": [
            {
                "main" : "uhd_rx_cfile",
                "parameters" : {
                    "-f" : "carrierFrequency",
                    "-r" : "samplingFrequency",
                    "-N" : "nSamples",
                    "-g" : "gain",
                    "-A" : "antenna",
                    "output-file" : {"cmd" : "", "val": "fileName"},
                }
            }
        ],
    },
    "Airspy Mini": {
        "fileName": {
            type: "input",
            defaultValue: "",
            description: "File Name",
            name: "fileName",
            typeContent: "text",
        },
        "mode" :{
            type:"selector",
            defaultValue: "CS16",
            description: "Mode",
            name: "mode",
            options: ["CS16", "CS32"],
            transformation: [2, 0],
        },
        "samplingFrequency": {
            type:"selector",
            defaultValue: "3 MHz",
            name: "samplingFrequency",
            description: "Sampling Frequency",
            options: ["3 MHz", "6 MHz"],
            units: "MHz",
            transformation: [3e6, 6e6],
        },
        "recordingTime" : {
            type: "input",
            defaultValue: 0,
            typeContent: "number",
            description: "Recording Time",
            name: "recordingTime",
            units: "s",
            toUnits: "s"
        },
        "carrierFrequency": {
            type: "input",
            defaultValue: 0,
            description: "Carrier Frequency",
            typeContent: "number",
            name: "carrierFrequency",
            units: "MHz",
            toUnits: "MHz"
        },
        "gain" : {
            type: "input",
            defaultValue: 0,
            description: "Gain",
            typeContent: "number",
            name: "gain",
            units: "dB",
            step: 0.5,
            toUnits: "dB"
        },
        "biastee" : {
            type: "selector",
            defaultValue: "Enabled",
            name: "biastee",
            description: "Biastee",
            options: ["Enabled", "Disabled"],
            transformation: [1, 0]
        },
        "nSamples" :  { 
            type: "computed",
            value: ["recordingTime", "samplingFrequency"],
            operation: "*",
        },
        "executable": [
            {
                "main" : "airspy_rx",
                "parameters" : {
                    "-f" : "carrierFrequency",
                    "-a" : "samplingFrequency",
                    "-n" : "nSamples",
                    "-g" : "gain",
                    "output-file" : {"cmd" : "-r", "val": "fileName"},
                    "-d" : "",
                    "-t" : "mode"
                }
            }
        ],
    },
    "RTL-SDR" : {
        "fileName": {
            type: "input",
            defaultValue: "",
            name: "fileName",
            description: "File Name",
            typeContent: "text",
        },
        "samplingFrequency": {
            type:"input",
            defaultValue: 0,
            typeContent: "number",
            description: "Sampling Frequency",
            name: "samplingFrequency",
            units: "MHz",
            toUnits: "Hz"
        },
        "recordingTime" : {
            type: "input",
            description: "Recording Time",
            defaultValue: 0,
            typeContent: "number",
            name: "recordingTime",
            units: "s",
            toUnits: "s"
        },
        "carrierFrequency": {
            type: "input",
            description: "Carrier Frequency",
            defaultValue: 0,
            typeContent: "number",
            name: "carrierFrequency",
            units: "MHz",
            toUnits: "Hz"
        },
        "gain" : {
            type: "input",
            defaultValue: 0,
            description: "Gain",
            typeContent: "number",
            name: "gain",
            units: "dB",
            step: 0.5,
            toUnits: "dB"
        },
        "biastee" : {
            type: "selector",
            defaultValue: "Enabled",
            description: "Biastee",
            name: "biastee",
            options: ["Enabled", "Disabled"],
            transformation: [1, 0]
        },
        "nSamples" : {
            type: "computed",
            value: ["recordingTime", "samplingFrequency"],
            operation: "*",
        },
        "executable": [
            {
                "main" : "rtl_biast",
                "parameters" : {
                    "-b" : "biastee",
                }
            },
            {
                "main" : "rtl_sdr",
                "parameters" : {
                    "-f" : "carrierFrequency",
                    "-s" : "samplingFrequency",
                    "-n" : "nSamples",
                    "-g" : "gain",
                    "output-file" : {"cmd" : "", "val": "fileName"},
                }
            }
        ],
    }
};

export default sdrForm;