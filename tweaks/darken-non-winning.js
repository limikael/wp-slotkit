/**
 * Tweak Name: Darken Non Winning
 * Description: Darken symbols that are not winning.
 * Version: 0.0.1
 * Param0: name=darkenNonWinningAmount & type=number & min=0 & max=100 & desc=How much darker should they be?
 */

game.on("init",function() {
	console.log("will darken by: "+game.options.darkenNonWinningAmount);
});

game.on("symbolStateChange",function(ev) {
	switch (ev.state) {
		case "noWin":
			ev.symbolSprite.alpha=1-(game.options.darkenNonWinningAmount/100);
			break;

		default:
			ev.symbolSprite.alpha=1;
			break;
	}
});