var inherits = require("inherits");
var EventDispatcher = require("yaed");
var ButtonHighlight = require("./ButtonHighlight");

/**
 * The keypad.
 */
function KeypadView(options) {
	PIXI.Container.call(this);
	this.options = options;

	this.spinButton = new ButtonHighlight(this.options, 60);
	this.spinButton.x = this.options.spinButtonPosition[0];
	this.spinButton.y = this.options.spinButtonPosition[1];
	this.spinButton.on("click", this.trigger.bind(this, "spinButtonClick"));
	this.spinButton.setEnabled(false);
	this.addChild(this.spinButton);

	this.betIncButton = new ButtonHighlight(this.options, 20);
	this.betIncButton.x = this.options.betIncPosition[0];
	this.betIncButton.y = this.options.betIncPosition[1];
	this.betIncButton.on("click", this.trigger.bind(this, "betIncButtonClick"));
	this.addChild(this.betIncButton);

	this.betDecButton = new ButtonHighlight(this.options, 20);
	this.betDecButton.x = this.options.betDecPosition[0];
	this.betDecButton.y = this.options.betDecPosition[1];
	this.betDecButton.on("click", this.trigger.bind(this, "betDecButtonClick"));
	this.addChild(this.betDecButton);

	this.linesIncButton = new ButtonHighlight(this.options, 20);
	this.linesIncButton.x = this.options.linesIncPosition[0];
	this.linesIncButton.y = this.options.linesIncPosition[1];
	this.linesIncButton.on("click", this.trigger.bind(this, "linesIncButtonClick"));
	this.addChild(this.linesIncButton);

	this.linesDecButton = new ButtonHighlight(this.options, 20);
	this.linesDecButton.x = this.options.linesDecPosition[0];
	this.linesDecButton.y = this.options.linesDecPosition[1];
	this.linesDecButton.on("click", this.trigger.bind(this, "linesDecButtonClick"));
	this.addChild(this.linesDecButton);

	this.paytableButton = new ButtonHighlight(this.options, 40);
	this.paytableButton.x = this.options.paytableButtonPosition[0];
	this.paytableButton.y = this.options.paytableButtonPosition[1];
	this.paytableButton.on("click", this.trigger.bind(this, "paytableButtonClick"));
	this.addChild(this.paytableButton);

	var style = {
		font: "bold 20px sans",
		fill: "#00ff00",
	}

	this.linesField = new PIXI.Text("<lines>", style);
	this.addChild(this.linesField);

	this.betField = new PIXI.Text("<bet>", style);
	this.addChild(this.betField);

	this.balanceField = new PIXI.Text("<balance>", style);
	this.addChild(this.balanceField);

	this.totalBetField = new PIXI.Text("<total bet>", style);
	this.addChild(this.totalBetField);

	this.updateFieldPositions();
}

inherits(KeypadView, PIXI.Container);
EventDispatcher.init(KeypadView);
module.exports = KeypadView;

/**
 * Update positions for text fields.
 */
KeypadView.prototype.updateFieldPositions = function() {
	this.linesField.x = this.options.linesFieldPosition[0] - this.linesField.width / 2;
	this.linesField.y = this.options.linesFieldPosition[1] - this.linesField.height / 2;

	this.betField.x = this.options.betFieldPosition[0] - this.betField.width / 2;
	this.betField.y = this.options.betFieldPosition[1] - this.betField.height / 2;

	this.balanceField.x = this.options.balanceFieldPosition[0] - this.balanceField.width / 2;
	this.balanceField.y = this.options.balanceFieldPosition[1] - this.balanceField.height / 2;

	this.totalBetField.x = this.options.totalBetFieldPosition[0] - this.totalBetField.width / 2;
	this.totalBetField.y = this.options.totalBetFieldPosition[1] - this.totalBetField.height / 2;
}

/**
 * Set spin button enabled.
 */
KeypadView.prototype.setSpinButtonEnabled = function(enabled) {
	this.spinButton.setEnabled(enabled);
}

/**
 * Should the bet buttons be enabled?
 */
KeypadView.prototype.setBetButtonsEnabled = function(enabled) {
	this.betIncButton.setEnabled(enabled);
	this.betDecButton.setEnabled(enabled);
	this.linesIncButton.setEnabled(enabled);
	this.linesDecButton.setEnabled(enabled);
}

/**
 * Set bet.
 */
KeypadView.prototype.setBet = function(bet) {
	this.betField.text = bet;
	this.updateFieldPositions();
}

/**
 * Set total bet.
 */
KeypadView.prototype.setTotalBet = function(totalBet) {
	this.totalBetField.text = totalBet;
	this.updateFieldPositions();
}

/**
 * Set balance.
 */
KeypadView.prototype.setBalance = function(balance) {
	this.balanceField.text = balance;
	this.updateFieldPositions();
}

/**
 * Set bet.
 */
KeypadView.prototype.setLines = function(lines) {
	this.linesField.text = lines;
	this.updateFieldPositions();
}