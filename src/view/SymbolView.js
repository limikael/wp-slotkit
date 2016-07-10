var inherits = require("inherits");
var TWEEN = require("tween.js");
var Thenable = require("tinp");
var UrlUtil = require("../utils/UrlUtil");
var GridSheet = require("../utils/GridSheet");

function SymbolView(options) {
    PIXI.Container.call(this);

    this.options = options;

    if (this.options.symbols && !this.options.symbolSheet) {
        var u = UrlUtil.makeAbsolute(this.options.symbols, this.options.baseUrl);
        var t = PIXI.Texture.fromFrame(u);
        this.options.symbolSheet = new GridSheet(t);
    }
}

inherits(SymbolView, PIXI.Container);
module.exports = SymbolView;

SymbolView.prototype.setSymbolId = function(symbolId) {
    this.symbolId = symbolId;
    /*var imageId = SymbolView.generateSymbolFrameId(this.options.baseUrl + this.options.symbolFormat, symbolId);

    imageId = UrlUtil.makeAbsolute(this.options.symbols, this.options.baseUrl);
    var symbol = PIXI.Sprite.fromImage(imageId);*/

    //var symbol = new PIXI.Sprite(this.options.symbolTexture);
    var symbol = this.options.symbolSheet.createSprite(symbolId);

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

SymbolView.prototype.playBetLineWin = function() {
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
