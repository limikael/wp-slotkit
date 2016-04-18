var inherits = require("inherits");

function PaytableView(options) {
	PIXI.Container.call(this);

	this.options = options;

	this.background = PIXI.Sprite.fromFrame(this.options.baseUrl + this.options.paytableBackground);
	this.addChild(this.background);
}

inherits(PaytableView, PIXI.Container);
module.exports = PaytableView;

PaytableView.prototype.hide = function() {
	this.visible = false;
}

PaytableView.prototype.toggleShown = function() {
	if (this.visible)
		this.visible = false;

	else
		this.visible = true;
}