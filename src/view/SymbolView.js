var inherits = require("inherits");
var TWEEN = require("tween.js");
var Thenable = require("tinp");
var UrlUtil = require("../utils/UrlUtil");
var GridSheet = require("../utils/GridSheet");

function SymbolView(options) {
    PIXI.Container.call(this);

    this.options = options;

    if (!this.options.symbols)
        throw new Error("No symbols");

    if (!SymbolView.symbolSheet)
        SymbolView.symbolSheet = {};

    if (!SymbolView.symbolSheet[this.options.symbols]) {
        var u = UrlUtil.makeAbsolute(this.options.symbols, this.options.baseUrl);
        var t = PIXI.Texture.fromFrame(u);
        SymbolView.symbolSheet[this.options.symbols] = new GridSheet(t);
    }
}

inherits(SymbolView, PIXI.Container);
module.exports = SymbolView;

SymbolView.getSymbolSheet = function(options) {
    if (!SymbolView.symbolSheet)
        SymbolView.symbolSheet = {};

    if (!SymbolView.symbolSheet[options.symbols]) {
        var u = UrlUtil.makeAbsolute(options.symbols, options.baseUrl);
        var t = PIXI.Texture.fromFrame(u);
        SymbolView.symbolSheet[options.symbols] = new GridSheet(t);
    }

    return SymbolView.symbolSheet[options.symbols]
}

SymbolView.prototype.setSymbolId = function(symbolId) {
    this.symbolId = symbolId;

    var symbol = SymbolView.getSymbolSheet(this.options).createSprite(symbolId);

    symbol.x = -symbol.width / 2;
    symbol.y = -symbol.height / 2;

    this.symbolSprite = new PIXI.Container();
    this.symbolSprite.addChild(symbol);
    this.addChild(this.symbolSprite);
}

SymbolView.prototype.setReelIndex = function(reelIndex) {
    this.reelIndex = reelIndex;
}

SymbolView.prototype.setRowIndex = function(rowIndex) {
    this.rowIndex = rowIndex;
    this.y = rowIndex * this.options.rowSpacing;
}

SymbolView.prototype.getRowIndex = function() {
    return this.rowIndex;
}

SymbolView.generateSymbolFrameId = function(format, id) {
    format = format.replace("#", (id + 1));

    return format;
}

SymbolView.prototype.playNoWin = function() {
    var ev={
        symbolSprite: this.symbolSprite,
        reelIndex: this.reelIndex,
        rowIndex: this.rowIndex
    };

    this.options.tweakApi.trigger("symbolWinPresentationNoWin",ev);
}

SymbolView.prototype.winPresentationComplete=function() {
    var ev={
        symbolSprite: this.symbolSprite,
        reelIndex: this.reelIndex,
        rowIndex: this.rowIndex
    };

    this.options.tweakApi.trigger("symbolWinPresentationComplete",ev);
}

SymbolView.prototype.playBetLineWin = function() {
    var ev={
        symbolSprite: this.symbolSprite,
        reelIndex: this.reelIndex,
        rowIndex: this.rowIndex
    };

    this.options.tweakApi.trigger("symbolWinPresentationWin",ev);

    var thenable = new Thenable();

    this.tween = new TWEEN.Tween(this.scale);
    this.tween.to({
        x: 1.2,
        y: 1.2
    }, 1000);
    this.tween.easing(TWEEN.Easing.Elastic.InOut);
    this.tween.delay(this.options.reelDelay * this.reelIndex);
    this.tween.start();

    Thenable.delay(2000).then(function() {
        this.scale.x = 1;
        this.scale.y = 1;

        thenable.resolve();
    }.bind(this));

    return thenable;
}