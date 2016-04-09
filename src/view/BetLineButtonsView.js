var inherits = require("inherits");
var EventDispatcher = require("yaed");
var BetLineButton = require("./BetLineButton");

/**
 * Manages the bet line highlight buttons.
 * @class BetLineButtonsView
 * @extends PIXI.Container
 * @constructor
 * @param {Object} options Game options.
 */
function BetLineButtonsView(options) {
	PIXI.Container.call(this);

	this.options = options;

	var g = new PIXI.Graphics();
	g.beginFill(0xff0000, 1);
	g.drawRect(0, 0, 100, 100);
	this.addChild(g);

	this.selectedBetLine = null;

	this.createBetLineButtons();
}

inherits(BetLineButtonsView, PIXI.Container);
EventDispatcher.init(BetLineButtonsView);
module.exports = BetLineButtonsView;

/**
 * Set number of bet lines.
 * @method setNumBetLines
 * @param {Number} num The number of bet lines available in the game.
 */
BetLineButtonsView.prototype.createBetLineButtons = function() {
	this.removeChildren();
	this.buttons = [];

	this.numButtons = this.options.betLines.length;
	var halfNumButtons = Math.floor(this.numButtons / 2);

	for (var i = 0; i < this.numButtons; i++) {
		var button = new BetLineButton();
		this.buttons.push(button);

		if (i < halfNumButtons) {
			button.x = this.options.betLineButtonsLeft;
			button.y = this.options.betLineButtonsTop +
				i * this.options.betLineButtonsDistance;
		} else {
			button.x = this.options.betLineButtonsRight;
			button.y = this.options.betLineButtonsTop +
				(i - halfNumButtons) * this.options.betLineButtonsDistance;
		}

		button.setBetLineIndex(i);
		this.addChild(button);

		button.interactive = true;
		button.mouseover = function(num) {
			this.selectedBetLine = num;
			this.trigger("selectedBetLineChange")
		}.bind(this, i);
		button.mouseout = function(num) {
			if (num == this.selectedBetLine)
				this.selectedBetLine = null;
			this.trigger("selectedBetLineChange")
		}.bind(this, i);
	}
}

/**
 * Get currently selected bet line.
 * @method getSelectedBetLine
 * @return {Number} The currently selected bet line. If no bet line is
 *                  this function returns null. Please note that 0
 *                  has a different meaning than null.
 */
BetLineButtonsView.prototype.getSelectedBetLine = function() {
	return this.selectedBetLine;
}

/**
 * Highligh a bet line.
 */
BetLineButtonsView.prototype.highlightBetLine = function(betLineIndex) {
	for (var i = 0; i < this.buttons.length; i++)
		this.buttons[i].setHighlight(false);

	if (betLineIndex == null)
		return;

	this.buttons[betLineIndex].setHighlight(true);
}