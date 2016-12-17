var EventDispatcher = require("yaed");

/**
 * An instance of this class is exposed to the tweaks
 * as the "game" object.
 * @class TweakApi.
 */
function TweakApi(slotApp) {
	this.slotApp=slotApp;
}

EventDispatcher.init(TweakApi);
module.exports=TweakApi;