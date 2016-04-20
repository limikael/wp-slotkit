var inherits = require("inherits");

/**
 * Bet line view.
 */
function BetLineView(options) {
	PIXI.Container.call(this);
	this.options = options;

	this.betLineGraphics = new PIXI.Graphics();
	this.addChild(this.betLineGraphics);
}

inherits(BetLineView, PIXI.Container);
module.exports = BetLineView;

/**
 * Show bet line by index.
 */
BetLineView.prototype.showBetLineIndex = function(index) {
	var betLineColors = [
		0xff8080,
		0x80ff80,
		0xffff80,
		0x8080ff,
		0xff80ff,
		0x80ffff,
	];

	var betLine = this.options.betLines[index]
	this.showBetLine(betLine, betLineColors[index % betLineColors.length]);
}

/**
 * Show bet line.
 */
BetLineView.prototype.showBetLine = function(betLine, color) {
	if (!color)
		color = 0xffffff;

	if (betLine.length != this.options.numReels)
		throw new Error("wrong number of entries in betLine");

	var g = this.betLineGraphics;

	g.visible = true;
	g.clear();

	g.lineStyle(10, 0x000000, .5);
	this.drawBetLine(betLine);

	g.lineStyle(9, 0x000000, 1);
	this.drawBetLine(betLine);

	g.lineStyle(6, color, .5);
	this.drawBetLine(betLine);

	g.lineStyle(5, color, 1);
	this.drawBetLine(betLine);
}

/**
 * Hide the bet line view.
 */
BetLineView.prototype.hide = function() {
	this.betLineGraphics.visible = false;
}

/**
 * Draw bet line
 * @private
 */
BetLineView.prototype.drawBetLine = function(betLine) {
	var g = this.betLineGraphics;

	g.moveTo(
		this.options.gridOffset[0],
		this.options.gridOffset[1] + betLine[0] * this.options.rowSpacing);

	for (var i = 1; i < this.options.numReels; i++) {
		g.lineTo(
			this.options.gridOffset[0] + i * this.options.reelSpacing,
			this.options.gridOffset[1] + betLine[i] * this.options.rowSpacing
		);
	}
}