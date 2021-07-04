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
            let command = message.commands[i];
            
            parsedMessage.results[i] = {
                completed: true
            };

            switch (command.commandType) {
                case "STATUS_CHECK":
                    parsedMessage.results[i]["roverStatus"] = {
                        mode: this.mode,
                        generatorWatts: this.generatorWatts,
                        position: this.position
                    };
                    break;
                case "MODE_CHANGE":
                    if (command.value !== "LOW_POWER" && command.value !== "NORMAL") {
                        throw Error("Mode can only be 'LOW_POWER' or 'NORMAL'");
                    }
                    this.mode = command.value;
                    break;
                case "MOVE":
                    if (this.mode === "LOW_POWER") {
                        parsedMessage.results[i] = {
                            completed: false
                        };
                    } else {
                        this.position = command.value;
                    }
                    break;
            }
        }

       return parsedMessage;
   }
}

module.exports = Rover;