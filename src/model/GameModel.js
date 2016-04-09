var Xhr = require("../utils/Xhr");
var Thenable = require("tinp");
var EventDispatcher = require("yaed");

/**
 * Contains the model for the game client.
 * @class GameModel
 */
function GameModel(options) {
	this.options = options;
	this.state = "stopped";
	this.spinThenable = null;
	this.randomizeReelSymbols();
	this.betLineWins = [];
}

EventDispatcher.init(GameModel);

/**
 * Randomize the symbols on the reel.
 * This function exists mainly for debugging purposes, it's
 * generally not a good idea to do this on the client side.
 * @method randomizeReelSymbols
 * @private
 */
GameModel.prototype.randomizeReelSymbols = function() {
	this.reels = [];

	for (var reelIndex = 0; reelIndex < this.options.numReels; reelIndex++) {
		var reel = [];

		for (var rowIndex = 0; rowIndex < this.options.numRows; rowIndex++)
			reel.push(Math.floor(Math.random() * this.options.numSymbols));

		this.reels.push(reel);
	}
}

/**
 * Get the current reel symbols for the specified reel.
 * @method getReelSymbols
 */
GameModel.prototype.getReelSymbols = function(reelIndex) {
	return this.reels[reelIndex];
}

/**
 * Start the spin and send the spin request to the server.
 * The state needs to be "stopped".
 * @method spin
 */
GameModel.prototype.spin = function() {
	if (this.state != "stopped")
		throw new Error("need to be in stopped state to spin");

	if (!this.options.spinUrl)
		throw new Error("no spin url to call");

	this.state = "spinStarted";

	this.spinThenable = new Thenable();

	this.spinRequest = new Xhr(this.options.spinUrl);
	this.spinRequest.setResponseEncoding(Xhr.JSON);
	this.spinRequest.send().then(
		this.onSpinRequestComplete.bind(this),
		this.onSpinRequestError.bind(this)
	);

	this.trigger("stateChange");
	return this.spinThenable;
}

/**
 * Get the current state of the game.
 * Available states:
 *   stopped      - The game is currently stopped.
 *   spinStarted  - The request has been sent to the server,
 *                  but we have not yet received the response.
 *   spinResponse - We have received the response from the server.
 *   spinStopping - The user has requested to quick stop the spin.
 */
GameModel.prototype.getState = function() {
	return this.state;
}

/**
 * We got the response from the server.
 * @method onSpinRequestComplete
 * @private
 */
GameModel.prototype.onSpinRequestComplete = function(response) {
	if (!response.reels)
		throw new Error("got no reels in spin response");

	if (response.reels.length != this.options.numReels)
		throw new Error("wrong number of reels");

	if (response.reels[0].length != this.options.numRows)
		throw new Error("wrong number of rows");

	this.state = "spinResponse";
	this.reels = response.reels;
	this.betLineWins = response.betLineWins;

	this.spinThenable.resolve();
	this.spinThenable = null;
	this.trigger("stateChange");
}

/**
 * There was an error with the spin request.
 * @method onSpinRequestError
 * @private
 */
GameModel.prototype.onSpinRequestError = function(error) {
	console.log("spin error");
}

/**
 * Notify model that the spin is stopping on user request.
 * @method notifySpinStopping
 */
GameModel.prototype.notifySpinStopping = function() {
	if (this.state != "spinResponse")
		throw new Error("can only stop in the spinResponse state");

	this.state = "spinStopping";
	this.trigger("stateChange");
}

/**
 * Notify model that the spin is complete, we are ready for the next game.
 * @method notifySpinComplete
 */
GameModel.prototype.notifySpinComplete = function() {
	if (this.state != "spinResponse" && this.state != "spinStopping")
		throw new Error("spin can't be complete in this state: " + this.state);

	this.state = "stopped";
	this.trigger("stateChange");
}

/**
 * Get number of winning betlines.
 */
GameModel.prototype.getNumWinBetLines = function() {
	return this.betLineWins.length;
}

/**
 * Get winning betline.
 */
GameModel.prototype.getFullWinBetLine = function(winIndex) {
	var betLineIndex = this.betLineWins[winIndex].betLine;
	return this.options.betLines[betLineIndex];
}

/**
 * Get winning betline.
 */
GameModel.prototype.getWinBetLine = function(winIndex) {
	return this.getFullWinBetLine(winIndex).slice(0, this.betLineWins[winIndex].numSymbols);
}

/**
 * Get amount for a winning bet line.
 */
GameModel.prototype.getWinBetLineAmount = function(winIndex) {
	return this.betLineWins[winIndex].amount;
}

/**
 * Get winning bet line by win index.
 */
GameModel.prototype.getWinBetLineIndex = function(winIndex) {
	return this.betLineWins[winIndex].betLine;
}

/**
 * Get accumulated win amount.
 */
GameModel.prototype.getAccumulatedWinAmount = function(winIndex) {
	var accumulated = 0;

	for (var i = 0; i < winIndex + 1; i++)
		accumulated += this.betLineWins[winIndex].amount;

	return accumulated;
}

/**
 * Get the balance that should be displayed depending on state.
 */
GameModel.prototype.getDisplayBalance = function() {
	return "345";
}

module.exports = GameModel;