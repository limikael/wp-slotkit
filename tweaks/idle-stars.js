/**
 * Tweak Name: Idle Stars
 * Description: Just tests this tweak thing.
 * Version: 0.0.1
 * Param0: name=idleStarImage & type=image
 */

function setSymbolStarTimeout(symbolSprite) {
	clearSymbolStarTimeout(symbolSprite);
	symbolSprite.starTimeoutId=setTimeout(
		onSymbolStarTimeout.bind(null,symbolSprite),
		3000+Math.random()*5000
	);
}

function clearSymbolStarTimeout(symbolSprite) {
	if (symbolSprite.starTimeoutId)
		clearTimeout(symbolSprite.starTimeoutId)

	symbolSprite.starTimeoutId=null;
}

function onSymbolStarTimeout(symbolSprite) {
	symbolSprite.idleStar.visible=true;

	var v=Math.random()*2*Math.PI;
	var r=Math.random()*50;

	symbolSprite.idleStar.x=r*Math.cos(v);
	symbolSprite.idleStar.y=r*Math.sin(v);

	symbolSprite.idleStar.scale.x=0;
	symbolSprite.idleStar.scale.y=0;

    var t = new TWEEN.Tween(symbolSprite.idleStar.scale);
    t.to({
        x: 1.5,
        y: 1.5
    }, 500);
    t.easing(TWEEN.Easing.Sinusoidal.Out);
    t.start();

    setTimeout(function() {
	    var t2 = new TWEEN.Tween(symbolSprite.idleStar.scale);
	    t2.to({
	        x: 0,
	        y: 0
	    }, 500);
	    t2.easing(TWEEN.Easing.Sinusoidal.In);
	    t2.start();
	},500);

	setSymbolStarTimeout(symbolSprite);
}

game.on("init",function() {
	console.log("the game is initialized...");
	console.log("image: "+game.options.idleStarImage);
});

game.on("symbolCreated",function(ev) {
	var outer=new PIXI.Container();

	if (game.options.idleStarImage) {
		var inner=PIXI.Sprite.fromFrame(game.options.idleStarImage);
		inner.x=-inner.width/2;
		inner.y=-inner.height/2;
		outer.addChild(inner);
	}

	ev.symbolSprite.idleStar=outer;
	ev.symbolSprite.addChild(ev.symbolSprite.idleStar);
});

game.on("symbolRemoved",function(ev) {
	clearSymbolStarTimeout(ev.symbolSprite);
	var g=ev.symbolSprite.idleStar;
	ev.symbolSprite.removeChild(g);
});

game.on("symbolStateChange",function(ev) {
	switch (ev.state) {
		case "idle":
			setSymbolStarTimeout(ev.symbolSprite);
			ev.symbolSprite.idleStar.visible=false;
			break;

		default:
			clearSymbolStarTimeout(ev.symbolSprite);
			ev.symbolSprite.idleStar.visible=false;
			break;
	}
});
