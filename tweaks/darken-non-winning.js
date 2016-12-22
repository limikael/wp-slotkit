/**
 * Tweak Name: Darken Non Winning
 * Description: Darken symbols that are not winning.
 * Version: 0.0.1
 * Param0: name=darkenNonWinningAmount & desc=How much darker should they be?
 */

game.on("init",function() {
	console.log("will darken by: "+game.options.darkenNonWinningAmount);
});

game.on("symbolWinPresentationComplete",function(ev) {
	ev.symbolSprite.alpha=1;
});

game.on("symbolWinPresentationWin",function(ev) {
	ev.symbolSprite.alpha=1;
});

game.on("symbolWinPresentationNoWin",function(ev) {
	ev.symbolSprite.alpha=1-(game.options.darkenNonWinningAmount/100);
});