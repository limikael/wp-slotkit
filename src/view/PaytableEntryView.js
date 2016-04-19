var inherits = require("inherits");
var SymbolView = require("./SymbolView");

/**
 * Shows one entry for the paytable.
 */
function PaytableEntryView(options) {
	PIXI.Container.call(this);
	this.options = options;

	var style = {
		font: "bold 24px sans",
		dropShadow: true,
		fill: "#ffffff",
		dropShadowColor: "#000000",
		dropShadowDistance: 2,
		dropShadowAngle: Math.PI / 4
	};

	this.payoutField = new PIXI.Text("3 - 1x\n4 - 2x\n5 - 3x", style);
	this.addChild(this.payoutField);
}

inherits(PaytableEntryView, PIXI.Container);
module.exports = PaytableEntryView;

/**
 * Set symbol id.
 */
PaytableEntryView.prototype.setSymbolId = function(symbolId) {
	if (this.symbol)
		this.removeChild(this.symbol);

	var imageId = SymbolView.generateSymbolFrameId(this.options.baseUrl + this.options.symbolFormat, symbolId);
	this.symbol = PIXI.Sprite.fromImage(imageId);
	this.addChild(this.symbol);

	this.updateFieldPosition();
}

/**
 * Set payouts.
 */
PaytableEntryView.prototype.setPayouts = function(payouts) {
	this.updateFieldPosition();
}

/**
 * Update field position.
 * @private
 */
PaytableEntryView.prototype.updateFieldPosition = function() {
	this.payoutField.x = this.symbol.width + 20;
	this.payoutField.y = (this.symbol.height - this.payoutField.height) / 2;
}