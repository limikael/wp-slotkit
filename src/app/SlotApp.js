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
	this.on("frame", TWEEN.update);
	this.matte = true;

	this.gameModel = new GameModel(options);
	this.gameModel.init().then(
		this.onGameModelInit.bind(this),
		this.onGameModelError.bind(this)
	);
}

inherits(SlotApp, PixiApp);
module.exports = SlotApp;
global.SlotApp = SlotApp;

/**
 * Game model initialized.
 * Load assets.
 */
SlotApp.prototype.onGameModelInit = function() {
	this.options = this.gameModel.getOptions();

	GameView.populateAssetLoader(this.options);
	PIXI.loader.load(this.onAssetsLoaded.bind(this));
}

/**
 * Game model error.
 */
SlotApp.prototype.onGameModelError = function() {
	throw new Error("Model initialization error.");
}

/**
 * Run after assets loaded.
 */
SlotApp.prototype.onAssetsLoaded = function() {
	this.gameView = new GameView(this.options);
	this.addChild(this.gameView);

	this.gameController = new GameController(this.options, this.gameView, this.gameModel);
}