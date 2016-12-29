var inherits = require("inherits");
var SymbolView = require("./SymbolView");
var PixiUtil = require("../utils/PixiUtil");
var TWEEN = require("tween.js");
var Thenable = require("tinp");

function ReelView(options) {
	PIXI.Container.call(this);

	this.options = options;
	this.symbols = [];
	this.reelOffset = 0;

	this.randomSymbols = [];

	for (var i = 0; i < this.options.numRandomSymbols; i++)
		this.randomSymbols.push(Math.floor(Math.random() * this.options.numSymbols));
}

inherits(ReelView, PIXI.Container);
module.exports = ReelView;

ReelView.prototype.setReelIndex = function(index) {
	this.reelIndex = index;
	this.x = this.options.gridOffset[0] + this.reelIndex * this.options.reelSpacing;
	this.y = this.options.gridOffset[1];

	this.symbolHolder = new PIXI.Container();
	this.addChild(this.symbolHolder);
}

ReelView.prototype.setSymbols = function(symbolIds) {
	if (symbolIds.length != this.options.numRows)
		throw new Error("Unexpected number of symbols");

	this.clearPosition();
	this.clearTimeout();
	this.stopping = false;

	this.symbolIds = symbolIds;
	this.createSymbolClips();
}

ReelView.prototype.stopSpin = function(symbolIds) {
	this.clearTimeout();
	this.stopThenable = new Thenable();

	this.timeout = setTimeout(function() {
		this.doStopSpin(symbolIds);
	}.bind(this), this.options.reelDelay * this.reelIndex);
	return this.stopThenable;
}

ReelView.prototype.doStopSpin = function(symbolIds) {
	this.clearTimeout();

	if (symbolIds.length != this.options.numRows)
		throw new Error("Unexpected number of symbols");

	if (!this.tween)
		this.doStartSpin();

	this.stopping = true;
	this.symbolIds = symbolIds;
}

ReelView.prototype.clearTimeout = function() {
	if (this.timeout) {
		clearTimeout(this.timeout);
		this.timeout = null;
	}
}

ReelView.prototype.getSymbolViewAt = function(rowIndex) {
	for (var i = 0; i < this.symbols.length; i++)
		if (this.symbols[i].getRowIndex() == rowIndex)
			return this.symbols[i];

	return null;
}

ReelView.prototype.createSymbolClip = function(rowIndex, symbolId) {
	var symbolView = new SymbolView(this.options);
	symbolView.setRowIndex(rowIndex);
	symbolView.setReelIndex(this.reelIndex);
	symbolView.setSymbolId(symbolId);
	this.symbols.push(symbolView);
	this.symbolHolder.addChild(symbolView);

	symbolView.triggerEvent("symbolCreated","idle");
	symbolView.triggerSymbolStateChange("idle");
}

ReelView.prototype.createSymbolClips = function() {
	for (var i = 0; i < this.symbols.length; i++) {
		var symbolView=this.symbols[i];
		symbolView.triggerSymbolStateChange("removed");
		symbolView.triggerEvent("symbolRemoved","removed");

		this.symbolHolder.removeChild(symbolView);
	}

	this.symbols = [];

	for (var i = 0; i < this.options.numRows; i++)
		this.createSymbolClip(i, this.symbolIds[i]);

	for (var i = 0; i < this.options.numRandomSymbols; i++)
		this.createSymbolClip(this.options.numRows + i, this.randomSymbols[i]);

	for (var i = 0; i < this.options.numRows; i++)
		this.createSymbolClip(this.options.numRandomSymbols + this.options.numRows + i, this.symbolIds[i]);

	for (var i=0; i<this.options.extraSymbolRows; i++) {
		this.createSymbolClip(-1-i, this.randomSymbols[this.randomSymbols.length-1-i]);
		this.createSymbolClip(this.options.numRows*2+this.options.numRandomSymbols+i,
			this.randomSymbols[i]);
	}
}

ReelView.prototype.clearPosition = function() {
	if (this.tween) {
		this.tween.onComplete = null;
		this.tween.stop();
		this.tween = null;
	}

	this.reelOffset = 0;
	this.updateSymbolHolderPosition();
}

ReelView.prototype.getReelClipHeight = function() {
	var numSymbols = this.options.numRows + this.options.numRandomSymbols;

	return this.options.rowSpacing * numSymbols;
}

ReelView.prototype.updateSymbolHolderPosition = function() {
	var reelClipHeight = this.getReelClipHeight();
	this.symbolHolder.y = this.reelOffset % reelClipHeight;

	while (this.symbolHolder.y > 0)
		this.symbolHolder.y -= reelClipHeight;
}

ReelView.prototype.startSpin = function() {
	this.clearTimeout();
	this.stopping = false;

	this.timeout = setTimeout(function() {
		this.doStartSpin();
	}.bind(this), this.options.reelDelay * this.reelIndex);
}

ReelView.prototype.doStartSpin = function() {
	for (var i = 0; i < this.symbols.length; i++) {
		var symbolView=this.symbols[i];
		symbolView.triggerSymbolStateChange("spin");
	}

	this.clearTimeout();
	this.clearPosition();

	this.tween = new TWEEN.Tween(this);
	this.tween.to({
		reelOffset: this.getReelClipHeight() / 2
	}, this.options.spinTweenStartDuration);
	this.tween.easing(TWEEN.Easing.Back.In);
	this.tween.onUpdate(function() {
		this.updateSymbolHolderPosition();
	}.bind(this));
	this.tween.onComplete(this.playSpinTween.bind(this));
	this.tween.start();
}

ReelView.prototype.playSpinTween = function() {
	this.reelOffset = -this.getReelClipHeight() / 2;
	this.updateSymbolHolderPosition();

	if (this.stopping) {
		this.createSymbolClips();
		for (var i = 0; i < this.symbols.length; i++) {
			var symbolView=this.symbols[i];
			symbolView.triggerSymbolStateChange("spin");
		}

		this.tween = new TWEEN.Tween(this);
		this.tween.to({
			reelOffset: 0
		}, this.options.spinTweenEndDuration);
		this.tween.easing(TWEEN.Easing.Elastic.Out);
		this.tween.onUpdate(function() {
			this.updateSymbolHolderPosition();
		}.bind(this));
		this.tween.onComplete(function() {
			for (var i = 0; i < this.symbols.length; i++) {
				var symbolView=this.symbols[i];
				symbolView.triggerSymbolStateChange("idle");
			}

			this.tween = null;
			this.stopThenable.resolve()
		}.bind(this));
		this.tween.start();
	} else {
		this.tween = new TWEEN.Tween(this);
		this.tween.to({
			reelOffset: this.getReelClipHeight() / 2
		}, this.options.spinTweenSpinDuration);
		this.tween.onUpdate(function() {
			this.updateSymbolHolderPosition();
		}.bind(this));
		this.tween.onComplete(this.playSpinTween.bind(this));
		this.tween.start();
	}
}