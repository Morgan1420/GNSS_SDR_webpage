import fs from "fs";
import executeCMD from "./captureFunctions/executeCMD.mjs";
import sdrForm from "../../shared/formDictionary.js";

let saveMetadata = function(filename,sdr) {
    let metadata = JSON.parse(fs.readFileSync("./metadata/capturesMetadata.json", "utf-8"));
    metadata[filename] = {
        sdr: sdr,
        dateCapture: new Date().toString(),
    };
    fs.writeFileSync("./metadata/capturesMetadata.json", JSON.stringify(metadata), {encoding: "utf8", flag: "w"});
}

let processComputed = function(configData, parameter, data){
    let dataArray = configData[parameter].value.map((x) => data[x]).join(configData[parameter].operation)
    return eval(dataArray);

}

let processUnits = async function(configData, actualValue, parameter) {
    try{
        if(configData[parameter].type == "input"){
            if(configData[parameter].units == "MHz" && configData[parameter].toUnits == "Hz"){
                return actualValue * 1e6
            } else if (configData[parameter].units == "MHz" && configData[parameter].toUnits == "MHz" ) {
                return actualValue
            }
        }
        if(configData[parameter].type == "selector") {
            return configData[parameter].transformation[configData[parameter].options.indexOf(actualValue)]    
        }
        return actualValue
    } catch (err) {
        console.log(err);
        console.log(configData[parameter]);
        console.log(parameter)
    }
};

let formatName = async function(formData, sdr, params) {
    let fileID = new Date().toISOString()
        .replace("T", "")
        .replace("Z", "")
        .slice(0, -4)
        .replaceAll(":", "")
        .replaceAll("-", "")
        + formData.fileName 
        + "_" + sdr;
    
    fileID.replace(".", ",").replace(" ","-")
    await Object.entries(formData).forEach(([key,value]) => {
        if (key != "fileName") {
            if (params[key].type == "input")
                fileID += "_" + key + value + params[key].units;
            if (params[key].type == "selector")
                fileID += "_" + key + value;
            
        }
    });
    return await fileID.replaceAll(".", ",").replaceAll(" ", "-");
};

export let processCapture = async function(req, res) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");

    let requestData = await req.body;
    let SDR = requestData.sdr;
    let formData = requestData.form;
    let executionResult;
    let date = new Date();
    let realParams = sdrForm[SDR];
    console.log(requestData.form);
    let fileName = await formatName(requestData.form, SDR, realParams)
    let processedData = {};
    formData.fileName = fileName;
    
    
    await Object.keys(realParams).forEach(async (element) => {
        if (element != "executable" || element == "fileName")
            processedData[element] = await processUnits(sdrForm[SDR], formData[element], element, formData);
    });
    await Object.keys(realParams).filter((x) => realParams[x].type == "computed").forEach((element) => {
        processedData[element] = processComputed(sdrForm[SDR], element, processedData);
    });
    saveMetadata(fileName, SDR, date.toString());

    executionResult = await executeCMD(processedData, fileName, SDR);
    res.send({result: executionResult});
    res.end();
};


