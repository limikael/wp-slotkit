var inherits = require("inherits");

/**
 * Filter where the brightness cah be changed with a property.
 * @class BrightnessFilter
 */
function BrightnessFilter() {
	PIXI.filters.ColorMatrixFilter.call(this);

	this._brightness = 1;
	PIXI.filters.ColorMatrixFilter.prototype.brightness.call(this, this._brightness);
}

inherits(BrightnessFilter, PIXI.filters.ColorMatrixFilter);
module.exports = BrightnessFilter;

/**
 * Control the brightness.
 * @property brightness
 */
Object.defineProperty(BrightnessFilter.prototype, "brightness", {
	get: function() {
		return this._brightness;
	},

	set: function(value) {
		this._brightness = value;
		PIXI.filters.ColorMatrixFilter.prototype.brightness.call(this, this._brightness);
	}
});