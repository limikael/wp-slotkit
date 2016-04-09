var inherits = require("inherits");
var BrightnessFilter = require("../utils/BrightnessFilter");
var EventDispatcher = require("yaed");
var PixiUtil = require("../utils/PixiUtil");

function ButtonHighlight(options, radius) {
	PIXI.Container.call(this);
	this.options = options;
	this.radius = radius;

	this.shape = PIXI.Sprite.fromImage(options.baseUrl + options.buttonHighlight);
	this.addChild(this.shape);
	this.shape.width = radius * 2;
	this.shape.height = radius * 2;
	this.shape.x = -this.shape.width / 2;
	this.shape.y = -this.shape.height / 2;

	this.brightnessFilter = new BrightnessFilter();
	this.filters = [this.brightnessFilter];

	this.interactive = true;
	this.alpha = 0;
	this.buttonMode = true;

	this.mouseover = this.mouseup = function() {
		this.brightnessFilter.brightness = 1;
		this.alpha = .5;
	}.bind(this)

	this.mouseout = function() {
		this.alpha = 0;
	}.bind(this)

	this.mousedown = function() {
		this.brightnessFilter.brightness = 0;
		this.alpha = .5;
	}.bind(this)

	this.click = function() {
		this.trigger("click");
	}.bind(this);
}

inherits(ButtonHighlight, PIXI.Container);
EventDispatcher.init(ButtonHighlight);
module.exports = ButtonHighlight;

ButtonHighlight.prototype.setEnabled = function(enabled) {
	var inside = false;

	var app = PixiUtil.findParentOfType(this, PixiApp);
	if (app) {
		var renderer = app._renderer;
		var mouse = this.toLocal(renderer.plugins.interaction.mouse.global);

		if (mouse.x > -this.radius && mouse.x < this.radius &&
			mouse.y > -this.radius && mouse.y < this.radius)
			inside = true;
	}

	if (enabled) {
		this.visible = true;
		this.interactive = true;
		this.buttonMode = true;

		if (inside) {
			this.alpha = .5;
			this.brightnessFilter.brightness = 1;
		} else {
			this.alpha = 0;
		}
	} else {
		this.visible = false;
		this.interactive = false;
		this.buttonMode = false;
	}
}