/**
 * Tweak Name: Hello Tweak System
 * Description: Just tests this tweak thing.
 * Version: 0.0.1
 * Param0: name=randomText & type=text & desc=stuff
 * Param1: name=anotherRandomText&type=text&label=Some random text:
 */

console.log("hello world, i'm a tweak, game="+game);

game.on("init",function() {
	console.log("the game is initialized...");
});

/*game.on("init",function() {

});*/