var inherits = require("inherits");
var EventDispatcher = require("yaed");
var ReelView = require("./ReelView");
var BetLineButtonsView = require("./BetLineButtonsView");
var BetLineView = require("./BetLineView");
var WinView = require("./WinView");
var KeypadView = require("./KeypadView");
var SymbolView = require("./SymbolView");

/**
 * @class GameView
 */
function GameView(options) {
	PIXI.Container.call(this);

	this.options = options;

	this.background = PIXI.Sprite.fromFrame(options.baseUrl + options.background);
	this.addChild(this.background);

	this.reelViews = [];
	for (var i = 0; i < this.options.numReels; i++) {
		var reelView = new ReelView(this.options);
		reelView.setReelIndex(i);
		this.reelViews.push(reelView);
		this.addChild(reelView);
	}

	this.foreground = PIXI.Sprite.fromFrame(options.baseUrl + options.foreground);
	this.addChild(this.foreground);

	this.keypadView = new KeypadView(this.options);
	this.keypadView.on("spinButtonClick", this.trigger.bind(this, "spinButtonClick"));
	this.addChild(this.keypadView);

	this.betLineButtonsView = new BetLineButtonsView(this.options);
	this.betLineButtonsView.on("selectedBetLineChange", function() {
		this.trigger("selectedBetLineChange");
	}.bind(this));
	this.addChild(this.betLineButtonsView);

	this.betLineView = new BetLineView(this.options);
	this.addChild(this.betLineView);

	this.winView = new WinView(this.options);
	this.addChild(this.winView);
}

inherits(GameView, PIXI.Container);
EventDispatcher.init(GameView);
module.exports = GameView;

/**
 * Highlight a bet line.
 */
GameView.prototype.highlightBetLine = function(betLineIndex) {
	if (betLineIndex === null) {
		this.betLineView.hide();
		this.betLineButtonsView.highlightBetLine(null);
		return;
	}

	this.betLineView.showBetLineIndex(betLineIndex);
	this.betLineButtonsView.highlightBetLine(betLineIndex);
}

/**
 * Get reference to win view.
 * @method getWinView
 */
GameView.prototype.getWinView = function() {
	return this.winView;
}

/**
 * Get selected bet line.
 */
GameView.prototype.getSelectedBetLine = function() {
	return this.betLineButtonsView.getSelectedBetLine();
}

/**
 * Get bet line view.
 */
GameView.prototype.getBetLineView = function() {
	return this.betLineView;
}

/**
 * Get reel view at index.
 */
GameView.prototype.getReelViewAt = function(index) {
	return this.reelViews[index];
}

/**
 * Get symbol view ar reel and row.
 */
GameView.prototype.getSymbolViewAt = function(reelIndex, rowIndex) {
	return this.getReelViewAt(reelIndex).getSymbolViewAt(rowIndex);
}

/**
 * Set spin button enabled.
 */
GameView.prototype.setSpinButtonEnabled = function(enabled) {
	this.keypadView.setSpinButtonEnabled(enabled);
}

/**
 * Get keypad view.
 */
GameView.prototype.getKeypadView = function() {
	return this.keypadView;
}

/**
 * Populate pixi loader according to options.
 */
GameView.populateAssetLoader = function(options) {
	for (var i = 0; i < options.numSymbols; i++) {
		var symbolId = SymbolView.generateSymbolFrameId(options.symbolFormat, i);
		PIXI.loader.add(symbolId, options.baseUrl + symbolId);
	}

	PIXI.loader.add(options.background, options.baseUrl + options.background);
	PIXI.loader.add(options.foreground, options.baseUrl + options.foreground);
	PIXI.loader.add(options.buttonHighlight, options.baseUrl + options.buttonHighlight);
}