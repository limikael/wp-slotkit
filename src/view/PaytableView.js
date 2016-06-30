var inherits = require("inherits");
var PaytableEntryView = require("./PaytableEntryView");
var ButtonHighlight = require("./ButtonHighlight");
var EventDispatcher = require("yaed");
var UrlUtil = require("../utils/UrlUtil");

/**
 * Show the paytable.
 */
function PaytableView(options) {
    PIXI.Container.call(this);

    this.options = options;

    this.background = PIXI.Sprite.fromFrame(UrlUtil.makeAbsolute(this.options.paytableBackground, this.options.baseUrl));
    this.addChild(this.background);

    this.nextButton = new ButtonHighlight(this.options, 20);
    this.nextButton.x = this.options.paytableNextButtonPosition[0];
    this.nextButton.y = this.options.paytableNextButtonPosition[1];
    this.nextButton.on("click", this.trigger.bind(this, "nextButtonClick"))
    this.addChild(this.nextButton);

    this.prevButton = new ButtonHighlight(this.options, 20);
    this.prevButton.x = this.options.paytablePrevButtonPosition[0];
    this.prevButton.y = this.options.paytablePrevButtonPosition[1];
    this.prevButton.on("click", this.trigger.bind(this, "prevButtonClick"))
    this.addChild(this.prevButton);

    var style = {
        font: "bold 24px sans",
        dropShadow: true,
        fill: "#ffffff",
        dropShadowColor: "#000000",
        dropShadowDistance: 2,
        dropShadowAngle: Math.PI / 4
    };

    this.pageField = new PIXI.Text("1/2", style);
    this.pageField.x = this.options.paytablePageFieldPosition[0] - this.pageField.width / 2;
    this.pageField.y = this.options.paytablePageFieldPosition[1] - this.pageField.height / 2;
    this.addChild(this.pageField);

    this.createEntries();
}

inherits(PaytableView, PIXI.Container);
EventDispatcher.init(PaytableView);
module.exports = PaytableView;

/**
 * Hide the paytable.
 */
PaytableView.prototype.hide = function() {
    this.visible = false;
}

/**
 * Toggle visibility of the paytable.
 */
PaytableView.prototype.toggleShown = function() {
    if (this.visible)
        this.visible = false;

    else
        this.visible = true;
}

/**
 * Create entries.
 */
PaytableView.prototype.createEntries = function() {
    var x = 0;
    var y = 0;
    var page;

    this.pages = [];

    for (var i = 0; i < this.options.numSymbols; i++) {
        if (!page) {
            page = new PIXI.Container();
            this.pages.push(page);
            this.addChild(page);
        }

        var entry = new PaytableEntryView(this.options);
        entry.x = this.options.paytableOffset[0] + x * this.options.paytableColSpacing;
        entry.y = this.options.paytableOffset[1] + y * this.options.paytableRowSpacing;
        entry.setSymbolId(i);
        page.addChild(entry);

        x++;
        if (x > 2) {
            x = 0;
            y++;

            if (y > 1) {
                y = 0;
                page = null;
            }
        }
    }

    this.currentPageIndex = 0;
    this.updateCurrentPage();
}

/**
 * Update current page.
 */
PaytableView.prototype.updateCurrentPage = function() {
    for (var i = 0; i < this.pages.length; i++)
        this.pages[i].visible = false;

    this.pages[this.currentPageIndex].visible = true;
    this.pageField.text = (this.currentPageIndex + 1) + "/" + this.pages.length;
}

/**
 * Set the current page index.
 */
PaytableView.prototype.setCurrentPageIndex = function(index) {
    this.currentPageIndex = index;

    if (this.currentPageIndex < 0)
        this.currentPageIndex = 0;

    if (this.currentPageIndex >= this.pages.length)
        this.currentPageIndex = this.pages.length - 1;

    this.updateCurrentPage();
}

/**
 * Get current page index.
 */
PaytableView.prototype.getCurrentPageIndex = function() {
    return this.currentPageIndex;
}
