var inherits = require("inherits");
var PixiApp = require("pixiapp");
var GameView = require("../view/GameView");
var GameController = require("../controller/GameController");
var GameModel = require("../model/GameModel");
var SymbolView = require("../view/SymbolView");
var TWEEN = require("tween.js");
var EventDispatcher = require("yaed");

/**
 * The app.
 */
function SlotApp(options) {
	PixiApp.call(this, 1024, 576);
	this.on("frame", TWEEN.update);
	this.matte = true;

	this.gameModel = new GameModel(options);
	this.gameModel.on("displayBalanceChange", function() {
		this.trigger("balance", this.gameModel.getDisplayBalance(), this.gameModel.getCurrency());
	}.bind(this));

	this.gameModel.on("error", function(e) {
		console.log("game model error: " + e);
		this.trigger("error", e);
	}.bind(this));

	this.gameModel.init().then(
		this.onGameModelInit.bind(this),
		this.onGameModelError.bind(this)
	);
}

inherits(SlotApp, PixiApp);
EventDispatcher.init(SlotApp);
module.exports = SlotApp;
global.SlotApp = SlotApp;

/**
 * Game model initialized.
 * Load assets.
 */
SlotApp.prototype.onGameModelInit = function() {
	this.options = this.gameModel.getOptions();

	GameView.populateAssetLoader(this.options);
	PIXI.loader.on("progress", this.onAssetsProgress.bind(this));
	PIXI.loader.on("error", this.onAssetsError.bind(this));
	PIXI.loader.load(this.onAssetsLoaded.bind(this));
}

/**
 * Game model error.
 */
SlotApp.prototype.onGameModelError = function(error) {
	this.trigger("error", error);
}

/**
 * Run after assets loaded.
 */
SlotApp.prototype.onAssetsLoaded = function() {
	console.log("assets loaded");

	this.gameView = new GameView(this.options);
	this.addChild(this.gameView);

	this.gameController = new GameController(this.options, this.gameView, this.gameModel);
	setTimeout(function() {
		if (this.haveError)
			return;

		this.trigger("complete");
	}.bind(this), 0);
}

/**
 * Assets progress.
 */
SlotApp.prototype.onAssetsProgress = function(ev) {
	this.trigger("progress", ev.progress);
}

/**
 * Assets progress.
 */
SlotApp.prototype.onAssetsError = function(ev) {
	this.haveError = true;
	this.trigger("error", "ERROR LOADING ASSETS");
}