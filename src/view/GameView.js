var inherits = require("inherits");
var EventDispatcher = require("yaed");
var ReelView = require("./ReelView");
var BetLineButtonsView = require("./BetLineButtonsView");
var BetLineView = require("./BetLineView");
var WinView = require("./WinView");
var KeypadView = require("./KeypadView");
var SymbolView = require("./SymbolView");
var PaytableView = require("./PaytableView");
var UrlUtil = require("../utils/UrlUtil");

/**
 * The main view of the game.
 * @class GameView
 */
function GameView(options) {
    PIXI.Container.call(this);

    this.options = options;

    this.background = PIXI.Sprite.fromFrame(UrlUtil.makeAbsolute(this.options.background, options.baseUrl));
    this.addChild(this.background);

    this.reelViews = [];
    for (var i = 0; i < this.options.numReels; i++) {
        var reelView = new ReelView(this.options);
        reelView.setReelIndex(i);
        this.reelViews.push(reelView);
        this.addChild(reelView);
    }

    this.foreground = PIXI.Sprite.fromFrame(UrlUtil.makeAbsolute(this.options.foreground, options.baseUrl));
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

    this.paytableView = new PaytableView(this.options);
    this.addChild(this.paytableView);
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
 * Get selected bet line.
 */
GameView.prototype.setNumEnabledBetLines = function(num) {
    return this.betLineButtonsView.setNumEnabledBetLines(num);
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
 * Set bet buttons enabled.
 */
GameView.prototype.setBetButtonsEnabled = function(enabled) {
    this.keypadView.setBetButtonsEnabled(enabled);
}

/**
 * Get keypad view.
 */
GameView.prototype.getKeypadView = function() {
    return this.keypadView;
}

/**
 * Paytable view.
 */
GameView.prototype.getPaytableView = function() {
    return this.paytableView;
}

/**
 * Populate pixi loader according to options.
 */
GameView.populateAssetLoader = function(options) {
    for (var i = 0; i < options.numSymbols; i++) {
        var symbolId = SymbolView.generateSymbolFrameId(options.symbolFormat, i);
        PIXI.loader.add(symbolId, UrlUtil.makeAbsolute(symbolId, options.baseUrl));
    }

    PIXI.loader.add(UrlUtil.makeAbsolute(options.background, options.baseUrl));
    PIXI.loader.add(options.foreground, UrlUtil.makeAbsolute(options.foreground, options.baseUrl));
    PIXI.loader.add(options.paytableBackground, UrlUtil.makeAbsolute(options.paytableBackground, options.baseUrl));
    PIXI.loader.add(options.buttonHighlight, UrlUtil.makeAbsolute(options.buttonHighlight, options.baseUrl));

    if (options.symbols)
        PIXI.loader.add(UrlUtil.makeAbsolute(options.symbols, options.baseUrl));
}