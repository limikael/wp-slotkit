jQuery(function($) {
	var loader = new BundleLoader();
	var app;
	loader.parentElement = "slotgame";

	loader.onload = function() {
		var options = {};
		options.initUrl = SLOTKIT_INITURL;
		app = new SlotApp(options);
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

		app.on("balance", function(balance) {
			$(".slotkit-ply-balance").text(balance);
			console.log("balance: " + balance);
		});
	}

	loader.load([
		SLOTKIT_BASEURL + "bin/pixi.min.js",
		SLOTKIT_BASEURL + "bin/slot.js"
	], "LOADING", 50);

	function updateSize() {
		var width = $('#slotgame').width();
		var height = width * 576 / 1024;
		$('#slotgame').height(height);

		if (app) {
			app.setElementSize(width, height);
		}
	}

	$(document).ready(function() {
		updateSize();
	});

	$(window).resize(function() {
		updateSize();
	});

	$("#slotkit-currency-select").change(function() {
		location.href = location.pathname + "?currency=" + $(this).val();
	});
});