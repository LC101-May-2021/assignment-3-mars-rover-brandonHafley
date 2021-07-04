const Command = require("./command.js");
const Message = require("./message.js");

class Rover {
   constructor(position, mode = "NORMAL", generatorWatts = 110) {
       this.position = position;
       this.mode = mode;
       this.generatorWatts = generatorWatts;
   }

   receiveMessage(message) {
       let parsedMessage = {
           message: message.name,
           results: []
       }

        for (let i = 0; i < message.commands.length; i++) {
            let currentCommand = message.commands[i];
            parsedMessage.results[i] = {
                completed: true
            };

            if (currentCommand.commandType === "STATUS_CHECK") {
                parsedMessage.results[i]["roverStatus"] = {
                    mode: this.mode,
                    generatorWatts: this.generatorWatts,
                    position: this.position
                };
            } else if (currentCommand.commandType === "MODE_CHANGE") {
                if (currentCommand.value !== "LOW_POWER" && currentCommand.value !== "NORMAL") {
                    throw Error("Mode can only be 'LOW_POWER' or 'NORMAL'");
                }
                this.mode = currentCommand.value;
            } else if (currentCommand.commandType === "MOVE") {
                if (this.mode === "LOW_POWER") {
                    parsedMessage.results[i] = {
                        completed: false
                    };
                } else {
                    this.position = currentCommand.value;
                }
            }
        }

       return parsedMessage;
   }
}

module.exports = Rover;