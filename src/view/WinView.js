var inherits = require("inherits");
var Thenable = require("tinp");
var TWEEN = require("tween.js");
var sprintf = require("sprintf-js").sprintf;

/**
 * @class WinView
 */
function WinView(options) {
	PIXI.Container.call(this);

	this.options = options;

	this.winFieldHolder = new PIXI.Container();
	this.winFieldHolder.x = this.options.winFieldX;
	this.winFieldHolder.y = this.options.winFieldY;
	this.addChild(this.winFieldHolder);

	var style = {
		font: "bold 180px sans",
		dropShadow: true,
		fill: "#fffff0",
		dropShadowColor: "#000000",
		dropShadowDistance: 5,
		dropShadowAngle: Math.PI / 4
	};

	this.winField = new PIXI.Text("<win>", style);
	this.winFieldHolder.addChild(this.winField);
	this.winFieldHolder.visible = false;

	this.winPlate = new PIXI.Graphics();
	this.winPlate.x = this.options.winPlateX;
	this.winPlate.y = this.options.winPlateY;
	this.winPlate.beginFill(0x000000, .5);
	this.winPlate.drawRect(-350, -30, 700, 60);
	this.addChild(this.winPlate);

	var style = {
		font: "bold 48px sans",
		dropShadow: true,
		fill: "#ffffff",
		dropShadowColor: "#000000",
		dropShadowDistance: 2,
		dropShadowAngle: Math.PI / 4
	};

	this.winPlateField = new PIXI.Text("Total win: 123 BTC", style);
	this.winPlateField.x = this.options.winPlateX - this.winPlateField.width / 2;
	this.winPlateField.y = this.options.winPlateY - this.winPlateField.height / 2;
	this.addChild(this.winPlateField);
	this.winPlate.visible = false;
	this.winPlateField.visible = false;
}

inherits(WinView, PIXI.Container);
module.exports = WinView;

/**
 * Show a win amount.
 * @method showWin
 */
WinView.prototype.showWin = function(amount) {
	var thenable = new Thenable();

	this.winField.text = amount;
	this.winField.x = -this.winField.width / 2;
	this.winField.y = -this.winField.height / 2;

	this.winFieldHolder.visible = true;

	this.winFieldHolder.scale.x = 0;
	this.winFieldHolder.scale.y = 0;

	var tween = new TWEEN.Tween(this.winFieldHolder.scale);
	tween.easing(TWEEN.Easing.Cubic.Out);
	tween.onComplete(function() {
		setTimeout(function() {
			thenable.resolve();
			this.winFieldHolder.visible = false;
		}.bind(this), 1500);
	}.bind(this));
	tween.to({
		x: 1,
		y: 1
	}, 500);
	tween.start();

	return thenable;
}

/**
 * Reset accumulated win view.
 * @method resetAccumulatedWin
 */
WinView.prototype.resetAccumulatedWin = function() {
	this.winPlate.visible = false;
	this.winPlateField.visible = false;
	this.countValue = 0;

	if (this.countInterval) {
		clearInterval(this.countInterval);
		this.countInterval = null;
	}
}

/**
 * Show accumulated win.
 * @method showAccumulatedWin
 */
WinView.prototype.showAccumulatedWin = function(amount) {
	if (this.countInterval)
		clearInterval(this.countInterval);

	this.winPlate.visible = true;
	this.winPlateField.visible = true;

	this.countTargetValue = amount;
	this.countInterval = setInterval(this.updateWinCount.bind(this), 50);
	this.countStartTime = Date.now();
	this.countTargetTime = this.countStartTime + 1000;
	this.countStartValue = this.countValue;

	this.updateWinCount();
}

/**
 * Update win count
 * @method updateWinCount
 * @private
 */
WinView.prototype.updateWinCount = function() {
	var now = Date.now();
	var frac = (now - this.countStartTime) / (this.countTargetTime - this.countStartTime);

	if (frac > 1) {
		frac = 1;
		clearInterval(this.countInterval);
		this.countInterval = null;
	}

	var v = this.countStartValue + frac * (this.countTargetValue - this.countStartValue);
	this.countValue = v;

	this.winPlateField.text = "Total win: " + Math.round(v);
	this.winPlateField.x = this.options.winPlateX - this.winPlateField.width / 2;
}