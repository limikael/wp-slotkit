var inherits = require("inherits");
var PixiApp = require("pixiapp");
var GameView = require("../view/GameView");
var GameController = require("../controller/GameController");
var GameModel = require("../model/GameModel");
var SymbolView = require("../view/SymbolView");
var TWEEN = require("tween.js");

/**
 * The app.
 */
function SlotApp(options) {
	PixiApp.call(this, 1024, 576);

	if (!options)
		options = {};

	this.options = options;

	var optionDefaults = {
		baseUrl: "",
		background: "res/background.png",
		foreground: "res/foreground.png",
		symbolFormat: "res/symbols/sym#.png",
		buttonHighlight: "res/highlight.png",
		spinButtonPosition: [512, 480],
		betIncPosition: [765, 484],
		betDecPosition: [600, 484],
		linesFieldPosition: [336, 483],
		betFieldPosition: [684, 483],
		balanceFieldPosition: [884, 456],
		totalBetFieldPosition: [884, 525],
		linesIncPosition: [418, 484],
		linesDecPosition: [254, 484],
		paytableButtonPosition: [140, 482],
		reelSpacing: 171,
		rowSpacing: 120,
		gridOffsetX: 165,
		gridOffsetY: 105,
		numReels: 5,
		numRows: 3,
		numSymbols: 9,
		reelSpeed: 1000,
		numRandomSymbols: 3,
		reelDelay: 200,
		spinDuration: 3000,
		winFieldX: 1024 / 2,
		winFieldY: 200,
		winPlateX: 1024 / 2,
		winPlateY: 340,
		betLineButtonsLeft: 50,
		betLineButtonsRight: 970,
		betLineButtonsTop: 70,
		betLineButtonsDistance: 35,
		betLines: [
			[1, 1, 1, 1, 1],
			[0, 0, 0, 0, 0],
			[2, 2, 2, 2, 2],
			[0, 1, 2, 1, 0],
			[2, 1, 0, 1, 2],
			[0, 0, 1, 0, 0],
			[2, 2, 1, 2, 2],
			[1, 2, 2, 2, 1],
			[1, 0, 0, 0, 1],
			[1, 0, 1, 0, 1],
			[1, 2, 1, 2, 1],
			[0, 1, 0, 1, 0],
			[2, 1, 2, 1, 2],
			[1, 1, 0, 1, 1],
			[1, 1, 2, 1, 1],
			[0, 1, 1, 1, 0],
			[2, 1, 1, 1, 2],
			[0, 1, 2, 2, 2],
			[2, 1, 0, 0, 0],
			[0, 2, 0, 2, 0]
		]
	}

	for (var option in optionDefaults)
		if (!this.options[option])
			this.options[option] = optionDefaults[option];

	for (var i = 0; i < this.options.numSymbols; i++) {
		var symbolId = SymbolView.generateSymbolFrameId(options.symbolFormat, i);
		PIXI.loader.add(symbolId, this.options.baseUrl + symbolId);
	}

	PIXI.loader.add(this.options.background, this.options.baseUrl + this.options.background);
	PIXI.loader.add(this.options.foreground, this.options.baseUrl + this.options.foreground);
	PIXI.loader.add(this.options.buttonHighlight, this.options.baseUrl + this.options.buttonHighlight);
	PIXI.loader.load(this.onAssetsLoaded.bind(this));

	this.matte = true;

	this.on("frame", TWEEN.update);
}

inherits(SlotApp, PixiApp);
module.exports = SlotApp;
global.SlotApp = SlotApp;

/**
 * Assets loaded.
 */
SlotApp.prototype.onAssetsLoaded = function() {
	this.gameModel = new GameModel(this.options);
	this.run();
}

/**
 * Run after assets loaded.
 */
SlotApp.prototype.run = function() {
	this.gameView = new GameView(this.options);
	this.addChild(this.gameView);

	this.gameController = new GameController(this.options, this.gameView, this.gameModel);
}