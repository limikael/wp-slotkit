var inherits = require("inherits");
var PaytableEntryView = require("./PaytableEntryView");

/**
 * Show the paytable.
 */
function PaytableView(options) {
	PIXI.Container.call(this);

	this.options = options;

	this.background = PIXI.Sprite.fromFrame(this.options.baseUrl + this.options.paytableBackground);
	this.addChild(this.background);

	this.createEntries();
}

inherits(PaytableView, PIXI.Container);
module.exports = PaytableView;

/**
 * Hide the paytable.
 */
PaytableView.prototype.hide = function() {
	this.visible = false;
}

/**
 * Toggle visibility of the paytable.
 */
PaytableView.prototype.toggleShown = function() {
	if (this.visible)
		this.visible = false;

	else
		this.visible = true;
}

/**
 * Create entries.
 */
PaytableView.prototype.createEntries = function() {
	var x = 0;
	var y = 0;

	for (var i = 0; i < 10; i++) {
		var entry = new PaytableEntryView(this.options);
		entry.x = this.options.paytableOffsetX + x * this.options.paytableColSpacing;
		entry.y = this.options.paytableOffsetY + y * this.options.paytableRowSpacing;
		entry.setSymbolId(0);
		this.addChild(entry);

		x++;
		if (x > 3) {
			x = 0;
			y++;
		}
	}
}