# wp-slotkit
A slot game engine for WordPress.

* [Intro](#intro)
* [Creating games](#creating-games)



* [Tweaks](#tweaks)
* [Player accounts](#player-accounts)

## Intro

This is an engine for creating slotgames. It is created for the implementation of [this idea](http://charityspin.freesite.host/about/), and you can test some games created with it [here](http://charityspin.freesite.host/). It is open source, however, so you can use it for your own projects as you wish.

It is implemented using [PixiJS](http://www.pixijs.com/) and is distributed as a [WordPress](https://wordpress.org/) plugin. If you want to test it, just install WordPress, then download the zip file and install it to your site as you would install any other WordPress plugin. Hopefully it should be self explanatory how to proceed from there.

## Creating games

Games are created using the WordPress administration interface. Once the plugin is installed, you will find an extra admin menu called "Slotgames" in the regular left hand side administration menu. You can use it to create and edit games. The game creation editor lets you upload the graphics for the background of the games, as well as graphics for the keypad and symbols. It also lets you adjust parameters like spin speed and a whole lot of other things.

## Tweaks

A "tweak" is an way to change how the game behaves, and a way to extend the functionality of a game. For example, [this game](http://charityspin.freesite.host/slotgame/classic/) has flashing starts when the symbols are idle. [This game](http://charityspin.freesite.host/slotgame/spot-the-big-five/) does not have those stars. The stars are implemented as a tweak. The architecture for how to implement tweaks is similar to the hook architecture in WordPress. In short, the [observer pattern](https://en.wikipedia.org/wiki/Observer_pattern) is used, and the tweak can listen for various events from the game. There is also a mechanism where the tweak can tell the surrounding system which parameters is expects, and the user or designer creating the game will be given the opportunity to edit those parameters in the administration interface. As an example, the source code for the "idle stars" tweak can be found [here](https://github.com/limikael/wp-slotkit/blob/master/tweaks/idle-stars.js). You can see the mechanism where the tweak hooks into the game in the code that looks like this:

```
game.on("symbolStateChange",function(ev) {
    ...
});
```

## Player accounts

The user management system built into WordPress is used to maintain the player accounts. However, WordPress has no mechanism for letting users deposit and withdraw funds from their account. If the [wp-crypto-accounts](https://github.com/limikael/wp-crypto-accounts) is installed alongsite this plugin, then this will be detected by the wp-slotkit plugin, and users can deposit and play with Bitcoins. If the wp-crypto-accounts plugin is not installed, it will still be possible to test the games, but only with playmoney. The mechanism where wp-slotkit detects available currencies is extensible, so it is relativly easy to hook into other new or existing systems.
