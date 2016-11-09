var inherits = require("inherits");

/**
 * Button to highlight a bet line.
 * @class BetLineButton
 * @extends PIXI.Container
 * @constructor
 */
function BetLineButton() {
	PIXI.Container.call(this);

	var style = {
		font: "bold 20px sans",
		dropShadow: true,
		fill: "#ffffff",
		dropShadowColor: "#000000",
		dropShadowDistance: 2,
		dropShadowAngle: Math.PI / 4
	};

	this.labelField = new PIXI.Text("", style);
	this.addChild(this.labelField);

	this.setBetLineIndex(0);
}

inherits(BetLineButton, PIXI.Container);
module.exports = BetLineButton;

/**
 * Set bet line index.
 * @method setBetLineIndex
 * @param {Number} index The index of the bet line.
 */
BetLineButton.prototype.setBetLineIndex = function(index) {
	var betLineColors = [
		0xff8080,
		0x80ff80,
		0xffff80,
		0x8080ff,
		0xff80ff,
		0x80ffff,
	];

	this.labelField.text = (index + 1);
	this.labelField.x = -this.labelField.width / 2;
	this.labelField.y = -this.labelField.height / 2;

	if (this.highlight)
		this.removeChild(this.highlight);

	this.highlight = new PIXI.Graphics();
	this.highlight.beginFill(0, .5);
	this.highlight.drawCircle(0, 0, 21);
	this.highlight.beginFill(betLineColors[index % betLineColors.length], 1);
	this.highlight.drawCircle(0, 0, 19);
	this.highlight.visible = false;
	this.addChildAt(this.highlight, 0);
}

/**
 * Set highlight.
 * @method setHighlight
 */
BetLineButton.prototype.setHighlight = function(highlight) {
	this.highlight.visible = highlight;
}

/**
 * Enabled or not?
 * @method setEnabled
 */
BetLineButton.prototype.setEnabled = function(enabled) {
	if (enabled)
		this.alpha = 1;

	else
		this.alpha = .5;
}

/**
 * Enabled or not?
 * @method isEnabled
 */
BetLineButton.prototype.isEnabled = function(enabled) {
	return (this.alpha == 1);
}