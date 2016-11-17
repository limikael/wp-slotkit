var inherits = require("inherits");

/**
 * Dialog.
 */
function DialogView(options) {
	PIXI.Container.call(this);
	this.options = options;

	var style = {
		font: "bold 30px sans",
		fill: "#ffffff",
		dropShadow: true,
		dropShadowColor: "#000000",
		dropShadowDistance: 0,
		dropShadowBlur: 5,
		dropShadowAngle: Math.PI / 4,
		stroke: "#000000",
		strokeThickness: 3,
		align: "center"

	}

	this.messageField = new PIXI.Text("HELLO", style);
	this.messageField.y = 190;
	this.addChild(this.messageField);

	this.visible = false;
}

inherits(DialogView, PIXI.Container);
module.exports = DialogView;

/**
 * Set message.
 */
DialogView.prototype.show = function(message) {
	console.log("show");
	if (!message)
		message = "";

	this.visible = true;
	this.messageField.text = message;
	this.messageField.x = 1024 / 2 - this.messageField.width / 2;
}