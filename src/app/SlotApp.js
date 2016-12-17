var inherits = require("inherits");
var PixiApp = require("pixiapp");
var GameView = require("../view/GameView");
var GameController = require("../controller/GameController");
var GameModel = require("../model/GameModel");
var SymbolView = require("../view/SymbolView");
var TWEEN = require("tween.js");
var EventDispatcher = require("yaed");
var BundleLoader=require("bundleloader");
var TweakApi=require("./TweakApi");

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

	this.tweakApi=new TweakApi(this);
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

/**
 * Run after assets loaded.
 */
SlotApp.prototype.onAssetsLoaded = function() {
	if (!this.options.tweaks) {
		this.lastSetupStage();
		return;
	}

	window.game=this.tweakApi;

	var tweakLoader=new BundleLoader();
	tweakLoader.visible=false;
	tweakLoader.onload=this.onTweaksComplete.bind(this);
	tweakLoader.onerror=this.onTweaksError.bind(this);
	tweakLoader.load(this.options.tweaks);
}

/**
 * Assets progress.
 */
SlotApp.prototype.onTweaksError = function(ev) {
	this.haveError = true;
	this.trigger("error", "ERROR LOADING TWEAKS");
}

/**
 * Assets progress.
 */
SlotApp.prototype.onTweaksComplete = function(ev) {
	this.lastSetupStage();
}

/**
 * Do the last setup stage.
 */
SlotApp.prototype.lastSetupStage=function() {
	this.gameView = new GameView(this.options);
	this.addChild(this.gameView);

	this.gameController = new GameController(this.options, this.gameView, this.gameModel);
	setTimeout(function() {
		if (this.haveError)
			return;

		this.tweakApi.trigger("init");

		this.trigger("complete");
	}.bind(this), 0);
}