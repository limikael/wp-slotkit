var Xhr = require("../utils/Xhr");
var Thenable = require("tinp");
var EventDispatcher = require("yaed");
var DefaultOptions = require("./DefaultOptions");

/**
 * Contains the model for the game client.
 * @class GameModel
 */
function GameModel(options) {
	this.options = options;
	if (!this.options)
		this.options = {};

	this.state = "stopped";
	this.spinThenable = null;
	this.betLineWins = [];
	this.userBetLines = 1;
}

EventDispatcher.init(GameModel);

/**
 * Initialize model.
 */
GameModel.prototype.init = function() {
	if (this.initThenable)
		throw new Error("Already initialized");

	this.initThenable = new Thenable();

	if (this.options.initUrl) {
		this.initCall = new Xhr(this.options.initUrl);
		this.initCall.setResponseEncoding(Xhr.JSON);
		this.initCall.send().then(
			this.onInitCallComplete.bind(this),
			this.onInitCallError.bind(this)
		);
	} else {
		this.postInit();
		this.initThenable.resolve();
	}

	return this.initThenable;
}

/**
 * Get currency.
 */
GameModel.prototype.getCurrency = function() {
	return this.options.currency;
}

/**
 * Init call complete.
 */
GameModel.prototype.onInitCallComplete = function(initResponse) {
	if (initResponse.error) {
		this.initThenable.reject(initResponse.error);
		return;
	}

	for (var option in initResponse)
		this.options[option] = initResponse[option];

	this.postInit();
	this.initThenable.resolve();
}

/**
 * Init call failed.
 */
GameModel.prototype.onInitCallError = function(e) {
	this.initThenable.reject("Init call failed: " + e);
}

/**
 * Get model options.
 */
GameModel.prototype.getOptions = function() {
	return this.options;
}

/**
 * Get the total bet
 */
GameModel.prototype.getTotalBet = function() {
	return this.getBet() * this.getUserBetLines();
}

/**
 * Apply default options.
 */
GameModel.prototype.postInit = function() {
	for (var option in DefaultOptions)
		if (this.options[option] === undefined)
			this.options[option] = DefaultOptions[option];

	if (!this.reels || !this.reels.length)
		this.randomizeReelSymbols();

	this.betIndex = 0;
	this.userBetLines = this.options.betLines.length;
	this.balance = this.options.balance;

	this.ensureBetInRange();
}

/**
 * Ensure that the bet is not bigger than the balance.
 */
GameModel.prototype.ensureBetInRange = function() {
	while (this.getTotalBet() > this.balance && this.userBetLines > 1)
		this.userBetLines--;

	while (this.getTotalBet() > this.balance && this.betIndex > 0)
		this.betIndex--;
}

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
	this.spinRequest.setParameter("betLines", this.getUserBetLines());
	this.spinRequest.setParameter("bet", this.getBet());
	this.spinRequest.send().then(
		this.onSpinRequestComplete.bind(this),
		this.onSpinRequestError.bind(this)
	);

	this.trigger("stateChange");
	this.trigger("displayBalanceChange");
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
	this.balance = response.balance;
	this.spinBalance = response.spinBalance;

	this.spinThenable.resolve();
	this.spinThenable = null;
	this.trigger("stateChange");
	this.trigger("displayBalanceChange");
}

/**
 * There was an error with the spin request.
 * @method onSpinRequestError
 * @private
 */
GameModel.prototype.onSpinRequestError = function(error) {
	console.log("spin error");

	this.state = "stopped";
	this.trigger("stateChange");
	this.trigger("displayBalanceChange");
	this.trigger("betChange");
	this.trigger("error", error);
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
	this.trigger("displayBalanceChange");
}

/**
 * Notify model that the spin is complete, we are ready for the next game.
 * @method notifySpinComplete
 */
GameModel.prototype.notifySpinComplete = function() {
	if (this.state != "spinResponse" && this.state != "spinStopping")
		throw new Error("spin can't be complete in this state: " + this.state);

	this.ensureBetInRange();

	this.state = "stopped";
	this.trigger("stateChange");
	this.trigger("displayBalanceChange");
	this.trigger("betChange");
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
 * Get flash message.
 */
GameModel.prototype.getFlashMessage = function() {
	return this.options.flashMessage;
}

/**
 * Get the balance that should be displayed depending on state.
 */
GameModel.prototype.getDisplayBalance = function() {
	if (this.options.balanceText)
		return this.options.balanceText;

	switch (this.state) {
		case "stopped":
			return this.balance;
			break;

		case "spinStarted":
			return this.balance - this.getTotalBet();
			break;

		case "spinResponse":
		case "spinStopping":
			return this.spinBalance;
			break;

		default:
			throw new Error("unknown state");
	}
}

/**
 * Get number of bet lines for the user bet.
 */
GameModel.prototype.getUserBetLines = function() {
	return this.userBetLines;
}

/**
 * Set number of bet lines for the current user bet.
 */
GameModel.prototype.setUserBetLines = function(userBetLines) {
	if (this.state != "stopped")
		throw new Error("state needs to be stopped to change bet lines");

	var old = this.userBetLines;
	this.userBetLines = userBetLines;

	if (this.userBetLines > this.options.betLines.length)
		this.userBetLines = this.options.betLines.length;

	if (this.userBetLines < 1)
		this.userBetLines = 1;

	if (this.getTotalBet() > this.balance)
		this.userBetLines = old;

	this.trigger("betChange");
}

/**
 * Get current bet.
 */
GameModel.prototype.getBet = function() {
	return this.options.betLevels[this.betIndex];
}

/**
 * Prev bet.
 */
GameModel.prototype.nextBet = function() {
	this.betIndex++;

	if (this.betIndex >= this.options.betLevels.length)
		this.betIndex = this.options.betLevels.length - 1;

	this.ensureBetInRange();
	this.trigger("betChange");
}

/**
 * Prev bet.
 */
GameModel.prototype.prevBet = function() {
	this.betIndex--;

	if (this.betIndex < 0)
		this.betIndex = 0;

	this.trigger("betChange");
}

module.exports = GameModel;