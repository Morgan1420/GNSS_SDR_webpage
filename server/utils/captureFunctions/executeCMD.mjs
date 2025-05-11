import pkg from "shelljs";
import sdrForm from "../../../shared/formDictionary.js";
import { execSync } from "child_process";
const {exec} = pkg;
let executeCMD = async function(formData, filename, SDR) {
    let configurationData = sdrForm[SDR];
    let cmds = [];
    await configurationData["executable"].forEach(async (command, index) => {
        cmds[index] = `${command["main"]}`
        await Object.keys(command["parameters"]).forEach((parameter) => {
            if(parameter == "output-file") {
                console.log(command["parameters"][parameter]["cmd"]);
                if (command["parameters"][parameter]["cmd"] == "") {
                    cmds[index] += " " + "./File_System/Capture_files/" + filename + ".bin";
                }else{
                    cmds[index] += " " + command["parameters"][parameter]["cmd"] + " " +  "./File_System/Capture_files/" + filename + ".bin";
                }
            } else {
                if (command["parameters"][parameter] == "") {
                    cmds[index] += " " + parameter;
                }else{
                    cmds[index] += " " + parameter + " " +  formData[command["parameters"][parameter]];
                }
            }
        });
    });
    let res= "";
    let errorFound = false;
    await cmds.forEach(async (cmd) => {
        console.log("\n Executing: " + cmd + "\n")
        try {
            res = execSync(cmd);
        } catch(err) {
            res = err.message;
            errorFound = true;
        }
        
    })

    if (errorFound) {
        return {title: "Error on Execution", message: res};
    }
    return { title: "Capture Successful", message: "The results are in " + filename}
};

export default executeCMD;
 

