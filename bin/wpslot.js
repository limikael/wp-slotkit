jQuery(function($) {
	var loader = new BundleLoader();
	loader.parentElement = "slotgame";

	loader.onload = function() {
		var options = {};
		options.initUrl = SLOTKIT_INITURL;
		var app = new SlotApp(options);
		app.setElementSize($('#slotgame').width(), $('#slotgame').height());
		app.attachToElement('slotgame');

		$(window).resize(function() {
			app.setElementSize($('#slotgame').width(), $('#slotgame').height());
		});

		app.on("progress", function(percent) {
			loader.showProgress("LOADING", 50 + percent / 2);
		});

		app.on("complete", function() {
			loader.hide();
		});

		app.on("error", function(e) {
			loader.showMessage(e);
		});
	}

	loader.load([
		SLOTKIT_BASEURL + "bin/pixi.min.js",
		SLOTKIT_BASEURL + "bin/slot.js"
	], "LOADING", 50);
});