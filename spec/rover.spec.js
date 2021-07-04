const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

    it("constructor sets position and default values for mode and generatorWatts", () => {
        let rover = new Rover(22345);
        expect(rover.position).toEqual(22345);
        expect(rover.mode).toEqual("NORMAL");
        expect(rover.generatorWatts).toEqual(110);
    });

    it("response returned by receiveMessage contains name of message", () => {
        let rover = new Rover(100);
        let obj = new Message("New message");
        let response = rover.receiveMessage(obj);
        expect(response.message).toEqual("New message");
    });

    it("response returned by receiveMessage includes two results if two commands are sent in the message", () => {
        let rover = new Rover(100);
        let obj = new Message("New message", [new Command("MOVE", 120), new Command("STATUS_CHECK")]);
        let response = rover.receiveMessage(obj);
        expect(response.results.length).toEqual(2);
    });

    it("responds correctly to status check command", () => {
        let rover = new Rover(100);
        let message = new Message("Checking status", [new Command("STATUS_CHECK")]);
        let response = rover.receiveMessage(message);
        expect(response.results[0].roverStatus.mode).toEqual("NORMAL");
        expect(response.results[0].roverStatus.generatorWatts).toEqual(110);
        expect(response.results[0].roverStatus.position).toEqual(100);
    });

    it("responds correctly to mode change command", () => {
        let rover = new Rover(100);
        let message = new Message("Changing rover mode", [new Command("MODE_CHANGE", "LOW_POWER")]);
        let response = rover.receiveMessage(message);
        expect(response.results[0].completed).toBeTrue();
        expect(rover.mode).toEqual("LOW_POWER");
    });

    it("responds with false completed value when attempting to move in LOW_POWER mode", () => {
        let rover = new Rover(100, "LOW_POWER");
        let message = new Message("Moving to position", [new Command("MOVE", 120)]);
        let response = rover.receiveMessage(message);
        expect(response.results[0].completed).toBeFalse();
        expect(rover.position).toEqual(100);
    });

    it("responds with position for move command", () => {
        let rover = new Rover(100);
        let message = new Message("Moving to position", [new Command("MOVE", 120)]);
        let response = rover.receiveMessage(message);
        expect(rover.position).toEqual(120);
    });

});
