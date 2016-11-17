var inherits = require("inherits");

/**
 * The keypad.
 */
function FlashMessageView(options) {
	PIXI.Container.call(this);
	this.options = options;

	var style = {
		font: "bold 40px sans",
		fill: "#ff0000"
	}

	this.messageField = new PIXI.Text("HELLO", style);
	this.messageField.alpha = .5;
	this.messageField.y = 360;
	this.addChild(this.messageField);

	this.timeoutId = null;
	this.flash();
}

inherits(FlashMessageView, PIXI.Container);
module.exports = FlashMessageView;

/**
 * Set message.
 */
FlashMessageView.prototype.setMessage = function(message) {
	if (!message)
		message = "";

	this.messageField.text = message;

	this.messageField.x = 1024 / 2 - this.messageField.width / 2;
}

/**
 * Force flash.
 */
FlashMessageView.prototype.flash = function() {
	if (this.timeoutId)
		clearTimeout(this.timeoutId);

	this.messageField.visible = true;
	setTimeout(this.onFlashTimeout.bind(this), 1000);
}

/**
 * Flash timeout.
 */
FlashMessageView.prototype.onFlashTimeout = function() {
	this.messageField.visible = !this.messageField.visible;
	setTimeout(this.onFlashTimeout.bind(this), 1000);
}