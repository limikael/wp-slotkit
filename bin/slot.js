(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],2:[function(require,module,exports){
var PIXI;

if (window.PIXI)
	PIXI = window.PIXI;

else
	PIXI = require("pixi.js");

/**
 * Keep content with a logic size inside boundaries.
 * @class ContentScaler
 * @internal
 */
function ContentScaler(content) {
	PIXI.Container.call(this);

	this.contentWidth = 100;
	this.contentHeight = 100;

	this.screenWidth = 100;
	this.screenHeight = 100;

	this.theMask = null;

	if (content)
		this.setContent(content);

	this.verticalAlign = ContentScaler.MIDDLE;
	this.horizontalAlign = ContentScaler.CENTER;
	this.scaleMode = ContentScaler.SHOW_ALL;

	this.minScale = -1;
	this.maxScale = -1;

	this.maskContentEnabled = false;
	this.maskColor = 0x000000;
}

module.exports = ContentScaler;

ContentScaler.prototype = Object.create(PIXI.Container.prototype);
ContentScaler.prototype.constructor = ContentScaler;

ContentScaler.TOP = "top";
ContentScaler.MIDDLE = "middle";
ContentScaler.BOTTOM = "bottom";

ContentScaler.LEFT = "left";
ContentScaler.CENTER = "center";
ContentScaler.RIGHT = "right";

ContentScaler.NO_BORDER = "noBorder";
ContentScaler.NO_SCALE = "noScale";
ContentScaler.SHOW_ALL = "showAll";

/**
 * Should the content be masked?
 * @method setMaskContentEnabled
 */
ContentScaler.prototype.setMaskContentEnabled = function(value) {
	this.maskContentEnabled = value;
	this.updateScale();
}

/**
 * Set color of the mask.
 * @method setMaskColor
 */
ContentScaler.prototype.setMaskColor = function(value) {
	this.maskColor = value;
	this.updateScale();
}

/**
 * Set minimum value for scale.
 * @method setMinScale
 */
ContentScaler.prototype.setMinScale = function(minScale) {
	this.minScale = minScale;
	this.updateScale();
}

/**
 * Set maximum value for scale.
 * @method setMaxScale
 */
ContentScaler.prototype.setMaxScale = function(maxScale) {
	this.maxScale = maxScale;
	this.updateScale();
}

/**
 * Set content to use.
 * @method setContent
 */
ContentScaler.prototype.setContent = function(content) {
	if (this.content)
		throw new Error("Content already set.");

	this.content = content;
	this.addChild(this.content);

	if (this.theMask) {
		this.removeChild(this.theMask);
		this.theMask = null;
	}

	this.theMask = new PIXI.Graphics();
	this.addChild(this.theMask);

	this.updateScale();
}

/**
 * Set logic size of the content.
 * @method setContentSize
 */
ContentScaler.prototype.setContentSize = function(contentWidth, contentHeight) {
	this.contentWidth = contentWidth;
	this.contentHeight = contentHeight;
	this.updateScale();
}

/**
 * Set the actual screen size.
 * @method setScreenSize
 */
ContentScaler.prototype.setScreenSize = function(screenWidth, screenHeight) {
	this.screenWidth = screenWidth;
	this.screenHeight = screenHeight;
	this.updateScale();
}

/**
 * Set how the content should be aligned on the screen.
 * @method setVerticalAlign
 */
ContentScaler.prototype.setVerticalAlign = function(align) {
	this.verticalAlign = align;
	this.updateScale();
}

/**
 * Set how the content should be aligned on the screen.
 * @method setHorizontalAlign
 */
ContentScaler.prototype.setHorizontalAlign = function(align) {
	this.horizontalAlign = align;
	this.updateScale();
}

/**
 * Set scale mode.
 * @method setScaleMode
 */
ContentScaler.prototype.setScaleMode = function(scaleMode) {
	this.scaleMode = scaleMode;
	this.updateScale();
}

/**
 * Update the scaling.
 * @method updateScale
 * @private
 */
ContentScaler.prototype.updateScale = function() {
	var scale;

	if (this.scaleMode == ContentScaler.NO_SCALE) {
		scale = 1;
	} else if (this.scaleMode == ContentScaler.NO_BORDER) {
		if (this.screenWidth / this.contentWidth > this.screenHeight / this.contentHeight)
			scale = this.screenWidth / this.contentWidth;

		else
			scale = this.screenHeight / this.contentHeight;
	} else {
		if (this.screenWidth / this.contentWidth < this.screenHeight / this.contentHeight)
			scale = this.screenWidth / this.contentWidth;

		else
			scale = this.screenHeight / this.contentHeight;
	}

	if (this.minScale > 0 && scale < this.minScale)
		scale = this.minScale;

	if (this.maxScale > 0 && scale > this.maxScale)
		scale = this.maxScale;

	this.content.scale.x = scale;
	this.content.scale.y = scale;

	var scaledWidth = this.contentWidth * scale;
	var scaledHeight = this.contentHeight * scale;

	this.content.position.x = (this.screenWidth - scaledWidth) / 2;

	if (this.verticalAlign == ContentScaler.TOP)
		this.content.position.y = 0;

	else if (this.verticalAlign == ContentScaler.BOTTOM)
		this.content.position.y = this.screenHeight - scaledHeight;

	else
		this.content.position.y = (this.screenHeight - scaledHeight) / 2;

	if (this.horizontalAlign == ContentScaler.LEFT)
		this.content.position.x = 0;

	else if (this.horizontalAlign == ContentScaler.RIGHT)
		this.content.position.x = this.screenWidth - scaledWidth;

	else
		this.content.position.x = (this.screenWidth - scaledWidth) / 2;

	var r = new PIXI.Rectangle(this.content.position.x, this.content.position.y, scaledWidth, scaledHeight);
	var right = r.x + r.width;
	var bottom = r.y + r.height;

	this.theMask.clear();

	if (this.maskContentEnabled) {
		this.theMask.beginFill(this.maskColor, 1);
		this.theMask.drawRect(0, 0, this.screenWidth, r.y);
		this.theMask.drawRect(0, 0, r.x, this.screenHeight);
		this.theMask.drawRect(right, 0, this.screenWidth - right, this.screenHeight);
		this.theMask.drawRect(0, bottom, this.screenWidth, this.screenHeight - bottom);
		this.theMask.endFill();
	}
}

/**
 * Get visible rectangle.
 * @method getVisibleRect
 */
ContentScaler.prototype.getVisibleRect = function() {
	var x = -this.content.position.x / this.content.scale.x;
	var y = -this.content.position.y / this.content.scale.y;

	var width = this.screenWidth / this.content.scale.x;
	var height = this.screenHeight / this.content.scale.y;
	// this.content.position, this.content.position, this.screenWidth, this.screenHeight

	return new PIXI.Rectangle(x, y, width, height);
}
},{"pixi.js":"pixi.js"}],3:[function(require,module,exports){
(function (global){
var ContentScaler = require("./ContentScaler");
var EventDispatcher = require("yaed");
var PIXI;

if (window.PIXI)
	PIXI = window.PIXI;

else
	PIXI = require("pixi.js");

/**
 * Manages the main loop and scaling of a PIXI application.
 * The intended way of using this class is to extend it, for example:
 *
 *     var PIXI = require("pixi.js");
 *     var PixiApp = require("PixiApp");
 *     var inherits = require("inherits");
 *
 *     function MyApp() {
 *         PixiApp.call(this);
 *
 *         var t = new PIXI.Text("Hello PIXI.js!");
 *         this.addChild(t);
 *     }
 *
 *     inherits(MyApp, PixiApp);
 *
 *     new MyApp();
 * @class PixiApp
 */
function PixiApp(width, height) {
	PIXI.Container.call(this);

	if (!width)
		width = 500;

	if (!height)
		height = width;

	this._applicationWidth = width;
	this._applicationHeight = height;
	this._elementWidth = width;
	this._elementHeight = height;
	this._backgroundColor = 0xffffff;
	this._antialias = false;
	this._superSampling = 1;
	this._viewElement = null;
	this._outerElement = null;
	this._parentElement = null;
	this.autoAttach = true;

	setTimeout(this.onCheckReadyTimeout.bind(this), 0);

	this.contentScaler = new ContentScaler(this);
}

module.exports = global.PixiApp = PixiApp;
PixiApp.prototype = Object.create(PIXI.Container.prototype);
PixiApp.prototype.constructor = PixiApp;

EventDispatcher.init(PixiApp);

/**
 * Dispatched if the app is resized.
 * @event resize
 */

/**
 * Dispatched every frame before rendering.
 * The time is send to the listening function as parameter.
 * @event frame
 */

PixiApp.TOP = ContentScaler.TOP;
PixiApp.MIDDLE = ContentScaler.MIDDLE;
PixiApp.BOTTOM = ContentScaler.BOTTOM;

PixiApp.LEFT = ContentScaler.LEFT;
PixiApp.CENTER = ContentScaler.CENTER;
PixiApp.RIGHT = ContentScaler.RIGHT;

PixiApp.NO_BORDER = ContentScaler.NO_BORDER;
PixiApp.NO_SCALE = ContentScaler.NO_SCALE;
PixiApp.SHOW_ALL = ContentScaler.SHOW_ALL;

/**
 * Check if it's time to attach ourselves.
 * @method onCheckReadyTimeout
 * @private
 */
PixiApp.prototype.onCheckReadyTimeout = function() {
	if (this._viewElement)
		return;

	if (!this.autoAttach)
		return false;

	if (!document.body) {
		setTimeout(this.onCheckReadyTimeout.bind(this), 0);
		return;
	}

	this.attachToElement();
}

/**
 * Attach to an element in the document.
 * If this function is not called, the app will be attached
 * to entire browser window.
 * @method attachToElement
 * @param element {DOMElement} The element to attach to.
 */
PixiApp.prototype.attachToElement = function(element) {
	if (this._viewElement)
		throw new Error("Already attached!");

	if (typeof element == "string") {
		element = document.getElementById(element);
		if (!element)
			throw new Error("That's not an element!");
	}

	// If element specified, set up parentElement to be
	// that element, otherwise set things up for attaching
	// to full window.
	if (element) {
		this._attachedToBody = false;
		this._parentElement = element;
	} else {
		this._attachedToBody = true;
		this._parentElement = document.body;
		document.body.style.margin = 0;
		document.body.style.padding = 0;
		document.body.style.overflow = "hidden";
		document.body.onresize = this.onWindowResize.bind(this);
		window.onresize = this.onWindowResize.bind(this);
	}

	// Create the outer element, and attach it to the
	// parent element.
	this._outerElement = document.createElement("div");
	this._outerElement.style.left = "0";
	this._outerElement.style.top = "0";
	this._outerElement.style.position = "relative";
	this._outerElement.style.transformOrigin = "0 0 0";
	this._outerElement.style.WebkitTransformOrigin = "0 0 0";
	this._outerElement.style.MsTransformOrigin = "0 0 0";
	this._parentElement.appendChild(this._outerElement);

	// Create the view element, and attach it to the outer element.
	if (navigator.isCocoonJS)
		this._viewElement = document.createElement('screencanvas');

	else
		this._viewElement = document.createElement('canvas');

	this._viewElement.style.margin = 0;
	this._viewElement.style.padding = 0;
	this._viewElement.style.position = "absolute";
	this._viewElement.style.left = 0;
	this._viewElement.style.top = 0;
	this._outerElement.appendChild(this._viewElement);

	// Create renderer, and update the content scaler for an
	// initial render. Set up other things.
	this.createRenderer();
	this.updateContentScaler();

	this._renderer.render(this.contentScaler);
	this._sizeDirty = false;

	window.requestAnimationFrame(this.onAnimationFrame.bind(this));
	this.trigger("resize");
}

/**
 * Create renderer.
 * @method createRenderer
 * @private
 */
PixiApp.prototype.createRenderer = function() {
	if (!this._viewElement)
		throw new Error("Can't create renderer, no view yet.");

	if (this._renderer)
		this._renderer.destroy();

	var options = {
		view: this._viewElement,
		antialias: this._antialias
	};

	this._renderer = new PIXI.autoDetectRenderer(this.getRendererWidth(), this.getRendererHeight(), options);
	this._renderer.backgroundColor = this._backgroundColor;
}

/**
 * Update the content scaler.
 * @method updateContentScaler
 * @private
 */
PixiApp.prototype.updateContentScaler = function() {
	var scale = 1 / this._superSampling;
	var transformString = "scale(" + scale + ")";

	if (this._superSampling == 1)
		transformString = null;

	//console.log("setting transform: " + transformString);

	this._outerElement.style.transform = transformString;
	this._outerElement.style.WebkitTransform = transformString;
	this._outerElement.style.MsTransform = transformString;

	this.contentScaler.setContentSize(this._applicationWidth, this._applicationHeight);
	this.contentScaler.setScreenSize(this.getRendererWidth(), this.getRendererHeight());
}

/**
 * Animation frame. Render ourselfs.
 * @method onAnimationFrame
 * @private
 */
PixiApp.prototype.onAnimationFrame = function(time) {
	//console.log("render");

	if (this._sizeDirty) {
		this.updateContentScaler();
		this._renderer.resize(this.getRendererWidth(), this.getRendererHeight());
		this._sizeDirty = false;
	}

	this.trigger("frame", time);

	this._renderer.render(this.contentScaler);
	//TWEEN.update(time);

	window.requestAnimationFrame(this.onAnimationFrame.bind(this));
}

/**
 * Handle window resize.
 * @method onWindowResize
 * @private
 */
PixiApp.prototype.onWindowResize = function() {
	this._sizeDirty = true;
	this.trigger("resize");
}

/**
 * Get height that the PIXI renderer should be, taking HTML element and
 * super sampling into consideration.
 * @method getRendererHeight
 * @private
 */
PixiApp.prototype.getRendererHeight = function() {
	if (this._attachedToBody)
		return window.innerHeight * this._superSampling;

	return this._elementHeight * this._superSampling;
}

/**
 * Get width that the PIXI renderer should be, taking HTML element and
 * super sampling into consideration.
 * @method getRendererWidth
 * @private
 */
PixiApp.prototype.getRendererWidth = function() {
	if (this._attachedToBody)
		return window.innerWidth * this._superSampling;

	return this._elementWidth * this._superSampling;
}

/**
 * The logic width of the application.
 * @property applicationWidth
 */
Object.defineProperty(PixiApp.prototype, 'applicationWidth', {
	get: function() {
		return this._applicationWidth;
	},
	set: function(value) {
		this._applicationWidth = value;
		this._sizeDirty = true;
	}
});

/**
 * The logic height of the application.
 * @property applicationHeight
 */
Object.defineProperty(PixiApp.prototype, 'applicationHeight', {
	get: function() {
		return this._applicationHeight;
	},
	set: function(value) {
		this._applicationHeight = value;
		this._sizeDirty = true;
	}
});

/**
 * Set the element size, if the app is displayed in an html element, 
 * rather than on the whole screen. This is a shorthand for setting
 * the elementWidth and elementHeight properties
 * @method setElementSize
 */
PixiApp.prototype.setElementSize = function(width, height) {
	this._elementWidth = width;
	this._elementHeight = height;
	this._sizeDirty = true;
}

/**
 * The width of the HTML element of the application.
 * This property does not have any effect if the application is
 * attached to the window.
 * @property elementWidth
 */
Object.defineProperty(PixiApp.prototype, 'elementWidth', {
	get: function() {
		return this._elementWidth;
	},
	set: function(value) {
		this._elementWidth = value;
		this._sizeDirty = true;
	}
});

/**
 * The width of the HTML element of the application.
 * This property does not have any effect if the application is
 * attached to the window.
 * @property elementHeight
 */
Object.defineProperty(PixiApp.prototype, 'elementHeight', {
	get: function() {
		return this._elementHeight;
	},
	set: function(value) {
		this._elementHeight = value;
		this._sizeDirty = true;
	}
});

/**
 * How the application should be vertically aligned in the window.
 * @property verticalAlign
 */
Object.defineProperty(PixiApp.prototype, "verticalAlign", {
	get: function() {
		return this.contentScaler.verticalAlign;
	},
	set: function(value) {
		this.contentScaler.setVerticalAlign(value)
	}
});

/**
 * How the application should be horizontally aligned in the window.
 * @property horizontalAlign
 */
Object.defineProperty(PixiApp.prototype, "horizontalAlign", {
	get: function() {
		return this.contentScaler.horizontalAlign;
	},
	set: function(value) {
		this.contentScaler.setHorizontalAlign(value)
	}
});

/**
 * How should the application be scaled to fit the window?
 * Available vaues are:
 * <ul>
 *   <li>
 *     `PixiApp.SHOW_ALL` - Ensure that the whole application as defined by
 *     `applicationWidth` and `applicationHeight` is visible on the screen.
 *   </li>
 *   <li>
 *     `PixiApp.NO_BORDER` - Show as much as possible of the application,
 *     but scale it so that there will be no border.
 *   </li>
 *   <li>
 *     `PixiApp.NO_SCALE` - Don't scale the application at all.
 *   </li>
 * </ul>
 * @property scaleMode
 */
Object.defineProperty(PixiApp.prototype, "scaleMode", {
	get: function() {
		return this.contentScaler.scaleMode;
	},
	set: function(value) {
		this.contentScaler.setScaleMode(value)
	}
});

/**
 * Get or set the minimum allowed scale value.
 * @property minScale
 */
Object.defineProperty(PixiApp.prototype, "minScale", {
	get: function() {
		return this.contentScaler.minScale;
	},
	set: function(value) {
		this.contentScaler.setMinScale(value)
	}
});

/**
 * Get or set the maximum allowed scale value.
 * @property minScale
 */
Object.defineProperty(PixiApp.prototype, "maxScale", {
	get: function() {
		return this.contentScaler.maxScale;
	},
	set: function(value) {
		this.contentScaler.setMaxScale(value)
	}
});

/**
 * Should there be a letterbox matte around the content? I.e.
 * should the content outside the application area be masked
 * away?
 * @property matte
 */
Object.defineProperty(PixiApp.prototype, "matte", {
	get: function() {
		return this.contentScaler.maskContentEnabled
	},
	set: function(value) {
		this.contentScaler.setMaskContentEnabled(value);
	}
});

/**
 * The color of the letterbox matte. This has effect only if the
 * letter box matte is enabled using the matte property.
 * @property matteColor
 */
Object.defineProperty(PixiApp.prototype, "matteColor", {
	get: function() {
		return this.contentScaler.maskColor;
	},
	set: function(value) {
		this.contentScaler.setMaskColor(value);
	}
});

/**
 * Gets the rectangle on the screen that is currently visible.
 * The rectangle is represented in application coordinates.
 * @property visibleRect
 */
Object.defineProperty(PixiApp.prototype, "visibleRect", {
	get: function() {
		if (this._sizeDirty) {
			this.updateContentScaler();

			if (this._renderer) {
				this._renderer.resize(this.getRendererWidth(), this.getRendererHeight());
				this._sizeDirty = false;
			}
		}

		return this.contentScaler.getVisibleRect();
	},
});

/**
 * The background color for the application.
 * Default is 0xffffff, i.e. white.
 * @property backgroundColor
 */
Object.defineProperty(PixiApp.prototype, "backgroundColor", {
	get: function() {
		return this._backgroundColor;
	},
	set: function(value) {
		this._backgroundColor = value;
		/*if (this.stage)
			this.stage.setBackgroundColor(this._backgroundColor);*/

		if (this._renderer)
			this._renderer.backgroundColor = this._backgroundColor;
	}
});

/**
 * Should antialias be used?
 * This needs to be set befor the app is attached to the window.
 * @property antialias
 */
Object.defineProperty(PixiApp.prototype, "antialias", {
	get: function() {
		return this._antialias;
	},
	set: function(value) {
		this._antialias = value;

		if (this._viewElement) {
			throw new Error("antialias needs to be set before attaching");
			this.createRenderer();
		}
	}
});

/**
 * The super sampling factor.
 * Default is 1, i.e. no super sampling.
 * @property superSampling
 */
Object.defineProperty(PixiApp.prototype, "superSampling", {
	get: function() {
		return this._superSampling;
	},
	set: function(value) {
		this._superSampling = value;
		this._sizeDirty = true;
	}
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ContentScaler":2,"pixi.js":"pixi.js","yaed":8}],4:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
(function(window) {
    var re = {
        not_string: /[^s]/,
        number: /[diefg]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[\+\-]/
    }

    function sprintf() {
        var key = arguments[0], cache = sprintf.cache
        if (!(cache[key] && cache.hasOwnProperty(key))) {
            cache[key] = sprintf.parse(key)
        }
        return sprintf.format.call(null, cache[key], arguments)
    }

    sprintf.format = function(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, node_type = "", arg, output = [], i, k, match, pad, pad_character, pad_length, is_positive = true, sign = ""
        for (i = 0; i < tree_length; i++) {
            node_type = get_type(parse_tree[i])
            if (node_type === "string") {
                output[output.length] = parse_tree[i]
            }
            else if (node_type === "array") {
                match = parse_tree[i] // convenience purposes only
                if (match[2]) { // keyword argument
                    arg = argv[cursor]
                    for (k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]))
                        }
                        arg = arg[match[2][k]]
                    }
                }
                else if (match[1]) { // positional argument (explicit)
                    arg = argv[match[1]]
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++]
                }

                if (get_type(arg) == "function") {
                    arg = arg()
                }

                if (re.not_string.test(match[8]) && re.not_json.test(match[8]) && (get_type(arg) != "number" && isNaN(arg))) {
                    throw new TypeError(sprintf("[sprintf] expecting number but found %s", get_type(arg)))
                }

                if (re.number.test(match[8])) {
                    is_positive = arg >= 0
                }

                switch (match[8]) {
                    case "b":
                        arg = arg.toString(2)
                    break
                    case "c":
                        arg = String.fromCharCode(arg)
                    break
                    case "d":
                    case "i":
                        arg = parseInt(arg, 10)
                    break
                    case "j":
                        arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0)
                    break
                    case "e":
                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential()
                    break
                    case "f":
                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg)
                    break
                    case "g":
                        arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg)
                    break
                    case "o":
                        arg = arg.toString(8)
                    break
                    case "s":
                        arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg)
                    break
                    case "u":
                        arg = arg >>> 0
                    break
                    case "x":
                        arg = arg.toString(16)
                    break
                    case "X":
                        arg = arg.toString(16).toUpperCase()
                    break
                }
                if (re.json.test(match[8])) {
                    output[output.length] = arg
                }
                else {
                    if (re.number.test(match[8]) && (!is_positive || match[3])) {
                        sign = is_positive ? "+" : "-"
                        arg = arg.toString().replace(re.sign, "")
                    }
                    else {
                        sign = ""
                    }
                    pad_character = match[4] ? match[4] === "0" ? "0" : match[4].charAt(1) : " "
                    pad_length = match[6] - (sign + arg).length
                    pad = match[6] ? (pad_length > 0 ? str_repeat(pad_character, pad_length) : "") : ""
                    output[output.length] = match[5] ? sign + arg + pad : (pad_character === "0" ? sign + pad + arg : pad + sign + arg)
                }
            }
        }
        return output.join("")
    }

    sprintf.cache = {}

    sprintf.parse = function(fmt) {
        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = match[0]
            }
            else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = "%"
            }
            else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1
                    var field_list = [], replacement_field = match[2], field_match = []
                    if ((field_match = re.key.exec(replacement_field)) !== null) {
                        field_list[field_list.length] = field_match[1]
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1]
                            }
                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list[field_list.length] = field_match[1]
                            }
                            else {
                                throw new SyntaxError("[sprintf] failed to parse named argument key")
                            }
                        }
                    }
                    else {
                        throw new SyntaxError("[sprintf] failed to parse named argument key")
                    }
                    match[2] = field_list
                }
                else {
                    arg_names |= 2
                }
                if (arg_names === 3) {
                    throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported")
                }
                parse_tree[parse_tree.length] = match
            }
            else {
                throw new SyntaxError("[sprintf] unexpected placeholder")
            }
            _fmt = _fmt.substring(match[0].length)
        }
        return parse_tree
    }

    var vsprintf = function(fmt, argv, _argv) {
        _argv = (argv || []).slice(0)
        _argv.splice(0, 0, fmt)
        return sprintf.apply(null, _argv)
    }

    /**
     * helpers
     */
    function get_type(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase()
    }

    function str_repeat(input, multiplier) {
        return Array(multiplier + 1).join(input)
    }

    /**
     * export to either browser or node.js
     */
    if (typeof exports !== "undefined") {
        exports.sprintf = sprintf
        exports.vsprintf = vsprintf
    }
    else {
        window.sprintf = sprintf
        window.vsprintf = vsprintf

        if (typeof define === "function" && define.amd) {
            define(function() {
                return {
                    sprintf: sprintf,
                    vsprintf: vsprintf
                }
            })
        }
    }
})(typeof window === "undefined" ? this : window);

},{}],6:[function(require,module,exports){
(function (process){
/**
 * A subset of Promises/A+.
 * @class Thenable
 */
function Thenable() {
	if (!(this instanceof Thenable))
		return new Thenable();

	this.decided = false;
	this.handlersUsed = false;
}

/**
 * Then.
 * @method resolve
 */
Thenable.prototype.then = function(resolutionHandler, rejectionHandler) {
	if (this.handlersUsed)
		throw new Error("Handlers already registered or called.");

	this.handlersUsed = true;

	if ((typeof resolutionHandler) == "object" &&
		resolutionHandler && !rejectionHandler &&
		resolutionHandler.then) {
		var chained = resolutionHandler;

		this.resolutionHandler = chained.resolve.bind(chained);
		this.rejectionHandler = chained.reject.bind(chained);
		return;
	}

	/*	if (typeof resolutionHandler == "object" &&
		}*/

	this.resolutionHandler = resolutionHandler;
	this.rejectionHandler = rejectionHandler;
}

/**
 * Resolve.
 * @method resolve
 */
Thenable.prototype.resolve = function(result) {
	if (this.decided)
		throw new Error("Already decided.");

	this.decided = true;
	process.nextTick(this.callHandler.bind(this, true, result));
}

/**
 * Reject.
 * @method resolve
 */
Thenable.prototype.reject = function(reason) {
	if (this.decided)
		throw new Error("Already decided.");

	this.decided = true;
	process.nextTick(this.callHandler.bind(this, false, reason));
}

/**
 * Call handler.
 * @method callHandler
 * @private
 */
Thenable.prototype.callHandler = function(resolved, parameter) {
	this.handlersUsed = true;

	var handler;

	if (resolved)
		handler = this.resolutionHandler;

	else
		handler = this.rejectionHandler;

	//console.log("in callHandler, handler=" + handler);

	if (handler) {
		try {
			handler(parameter);
		} catch (e) {
			console.error("Unhandled: " + e);
			console.log(e.stack);
			throw e;
		}
	}
}

/**
 * Return a resolved thenable.
 * @method resolved
 */
Thenable.resolved = function(parameter) {
	var t = new Thenable();
	t.resolve(parameter);
	return t;
}

/**
 * Return a rejected thenable.
 * @method rejected
 */
Thenable.rejected = function(parameter) {
	var t = new Thenable();
	t.reject(parameter);
	return t;
}

/**
 * Wait for all to resolve or any to reject.
 * @method all
 */
Thenable.all = function( /* ... */ ) {
	var thenable = new Thenable();
	var i;
	var thenables = [];
	var decided = false;
	var resolvedCount = 0;

	for (i = 0; i < arguments.length; i++)
		thenables = thenables.concat(arguments[i]);

	if (!thenables.length)
		return Thenable.resolved();

	function onResolved() {
		resolvedCount++;

		if (!decided && resolvedCount >= thenables.length) {
			decided = true;
			thenable.resolve();
		}
	}

	function onRejected(e) {
		if (!decided) {
			decided = true;
			thenable.reject(e);
		}
	}

	for (i = 0; i < thenables.length; i++) {
		if (!thenables[i])
			onResolved();

		else
			thenables[i].then(onResolved, onRejected);
	}

	return thenable;
}

/**
 * Wait for any to resolve or all to reject.
 * @method all
 */
Thenable.race = function( /* ... */ ) {
	var thenable = new Thenable();
	var i;
	var thenables = [];
	var decided = false;
	var resolvedCount = 0;

	for (i = 0; i < arguments.length; i++)
		thenables = thenables.concat(arguments[i]);

	function onRejected() {
		resolvedCount++;

		if (!decided && resolvedCount >= thenables.length) {
			decided = true;
			thenable.reject();
		}
	}

	function onResolved(r) {
		if (!decided) {
			decided = true;
			thenable.resolve(r);
		}
	}

	for (i = 0; i < thenables.length; i++) {
		thenables[i].then(onResolved, onRejected);
	}

	return thenable;
}

/**
 * Create a resolved Thenable.
 * @method resolved
 */
Thenable.resolved = function(result) {
	var t = new Thenable;
	t.resolve(result);

	return t;
}

/**
 * Create a rejected Thenable.
 * @method rejected
 */
Thenable.rejected = function(reason) {
	var t = new Thenable;
	t.reject(reason);

	return t;
}

/**
 * Resolve thenable after specified number of millisecs.
 * @method delay
 * @param {Number} millis The number of milliseconds to wait for.
 * @static
 * @return {Thenable} A thenable that resolves after the specified number
 *                    of millisecs.
 */
Thenable.delay = function(millis) {
	var t = new Thenable();

	setTimeout(function() {
		t.resolve();
	}, millis);

	return t;
}

module.exports = Thenable;
}).call(this,require('_process'))
},{"_process":4}],7:[function(require,module,exports){
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

// Include a performance.now polyfill
(function () {

	if ('performance' in window === false) {
		window.performance = {};
	}

	// IE 8
	Date.now = (Date.now || function () {
		return new Date().getTime();
	});

	if ('now' in window.performance === false) {
		var offset = window.performance.timing && window.performance.timing.navigationStart ? window.performance.timing.navigationStart
		                                                                                    : Date.now();

		window.performance.now = function () {
			return Date.now() - offset;
		};
	}

})();

var TWEEN = TWEEN || (function () {

	var _tweens = [];

	return {

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function (tween) {

			_tweens.push(tween);

		},

		remove: function (tween) {

			var i = _tweens.indexOf(tween);

			if (i !== -1) {
				_tweens.splice(i, 1);
			}

		},

		update: function (time) {

			if (_tweens.length === 0) {
				return false;
			}

			var i = 0;

			time = time !== undefined ? time : window.performance.now();

			while (i < _tweens.length) {

				if (_tweens[i].update(time)) {
					i++;
				} else {
					_tweens.splice(i, 1);
				}

			}

			return true;

		}
	};

})();

TWEEN.Tween = function (object) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	// Set all starting values present on the target object
	for (var field in object) {
		_valuesStart[field] = parseFloat(object[field], 10);
	}

	this.to = function (properties, duration) {

		if (duration !== undefined) {
			_duration = duration;
		}

		_valuesEnd = properties;

		return this;

	};

	this.start = function (time) {

		TWEEN.add(this);

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : window.performance.now();
		_startTime += _delayTime;

		for (var property in _valuesEnd) {

			// Check if an Array was provided as property value
			if (_valuesEnd[property] instanceof Array) {

				if (_valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				_valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);

			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (_valuesStart[property] === undefined) {
				continue;
			}

			_valuesStart[property] = _object[property];

			if ((_valuesStart[property] instanceof Array) === false) {
				_valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[property] = _valuesStart[property] || 0;

		}

		return this;

	};

	this.stop = function () {

		if (!_isPlaying) {
			return this;
		}

		TWEEN.remove(this);
		_isPlaying = false;

		if (_onStopCallback !== null) {
			_onStopCallback.call(_object);
		}

		this.stopChainedTweens();
		return this;

	};

	this.stopChainedTweens = function () {

		for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
			_chainedTweens[i].stop();
		}

	};

	this.delay = function (amount) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function (times) {

		_repeat = times;
		return this;

	};

	this.yoyo = function (yoyo) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function (easing) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function (interpolation) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function (callback) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function (callback) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function (callback) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function (callback) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function (time) {

		var property;
		var elapsed;
		var value;

		if (time < _startTime) {
			return true;
		}

		if (_onStartCallbackFired === false) {

			if (_onStartCallback !== null) {
				_onStartCallback.call(_object);
			}

			_onStartCallbackFired = true;

		}

		elapsed = (time - _startTime) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction(elapsed);

		for (property in _valuesEnd) {

			// Don't update properties that do not exist in the source object
			if (_valuesStart[property] === undefined) {
				continue;
			}

			var start = _valuesStart[property] || 0;
			var end = _valuesEnd[property];

			if (end instanceof Array) {

				_object[property] = _interpolationFunction(end, value);

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof (end) === 'string') {

					if (end.startsWith('+') || end.startsWith('-')) {
						end = start + parseFloat(end, 10);
					} else {
						end = parseFloat(end, 10);
					}
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
					_object[property] = start + (end - start) * value;
				}

			}

		}

		if (_onUpdateCallback !== null) {
			_onUpdateCallback.call(_object, value);
		}

		if (elapsed === 1) {

			if (_repeat > 0) {

				if (isFinite(_repeat)) {
					_repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (property in _valuesStartRepeat) {

					if (typeof (_valuesEnd[property]) === 'string') {
						_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property], 10);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[property];

						_valuesStartRepeat[property] = _valuesEnd[property];
						_valuesEnd[property] = tmp;
					}

					_valuesStart[property] = _valuesStartRepeat[property];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				_startTime = time + _delayTime;

				return true;

			} else {

				if (_onCompleteCallback !== null) {
					_onCompleteCallback.call(_object);
				}

				for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					_chainedTweens[i].start(_startTime + _duration);
				}

				return false;

			}

		}

		return true;

	};

};


TWEEN.Easing = {

	Linear: {

		None: function (k) {

			return k;

		}

	},

	Quadratic: {

		In: function (k) {

			return k * k;

		},

		Out: function (k) {

			return k * (2 - k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return - 0.5 * (--k * (k - 2) - 1);

		}

	},

	Cubic: {

		In: function (k) {

			return k * k * k;

		},

		Out: function (k) {

			return --k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k + 2);

		}

	},

	Quartic: {

		In: function (k) {

			return k * k * k * k;

		},

		Out: function (k) {

			return 1 - (--k * k * k * k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return - 0.5 * ((k -= 2) * k * k * k - 2);

		}

	},

	Quintic: {

		In: function (k) {

			return k * k * k * k * k;

		},

		Out: function (k) {

			return --k * k * k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k * k * k + 2);

		}

	},

	Sinusoidal: {

		In: function (k) {

			return 1 - Math.cos(k * Math.PI / 2);

		},

		Out: function (k) {

			return Math.sin(k * Math.PI / 2);

		},

		InOut: function (k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));

		}

	},

	Exponential: {

		In: function (k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);

		},

		Out: function (k) {

			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

		}

	},

	Circular: {

		In: function (k) {

			return 1 - Math.sqrt(1 - k * k);

		},

		Out: function (k) {

			return Math.sqrt(1 - (--k * k));

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return - 0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function (k) {

			var s;
			var a = 0.1;
			var p = 0.4;

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}

			return - (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));

		},

		Out: function (k) {

			var s;
			var a = 0.1;
			var p = 0.4;

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}

			return (a * Math.pow(2, - 10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);

		},

		InOut: function (k) {

			var s;
			var a = 0.1;
			var p = 0.4;

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if (!a || a < 1) {
				a = 1;
				s = p / 4;
			} else {
				s = p * Math.asin(1 / a) / (2 * Math.PI);
			}

			if ((k *= 2) < 1) {
				return - 0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
			}

			return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;

		}

	},

	Back: {

		In: function (k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);

		},

		Out: function (k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;

		},

		InOut: function (k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	Bounce: {

		In: function (k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);

		},

		Out: function (k) {

			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}

		},

		InOut: function (k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.Linear;

		if (k < 0) {
			return fn(v[0], v[1], f);
		}

		if (k > 1) {
			return fn(v[m], v[m - 1], m - f);
		}

		return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

	},

	Bezier: function (v, k) {

		var b = 0;
		var n = v.length - 1;
		var pw = Math.pow;
		var bn = TWEEN.Interpolation.Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;

	},

	CatmullRom: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.CatmullRom;

		if (v[0] === v[m]) {

			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}

			return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

		} else {

			if (k < 0) {
				return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
			}

			if (k > 1) {
				return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
			}

			return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

		}

	},

	Utils: {

		Linear: function (p0, p1, t) {

			return (p1 - p0) * t + p0;

		},

		Bernstein: function (n, i) {

			var fc = TWEEN.Interpolation.Utils.Factorial;

			return fc(n) / fc(i) / fc(n - i);

		},

		Factorial: (function () {

			var a = [1];

			return function (n) {

				var s = 1;

				if (a[n]) {
					return a[n];
				}

				for (var i = n; i > 1; i--) {
					s *= i;
				}

				a[n] = s;
				return s;

			};

		})(),

		CatmullRom: function (p0, p1, p2, p3, t) {

			var v0 = (p2 - p0) * 0.5;
			var v1 = (p3 - p1) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

		}

	}

};

// UMD (Universal Module Definition)
(function (root) {

	if (typeof define === 'function' && define.amd) {

		// AMD
		define([], function () {
			return TWEEN;
		});

	} else if (typeof module !== 'undefined' && typeof exports === 'object') {

		// Node.js
		module.exports = TWEEN;

	} else if (root !== undefined) {

		// Global variable
		root.TWEEN = TWEEN;

	}

})(this);

},{}],8:[function(require,module,exports){
/**
 * AS3/jquery style event dispatcher. Slightly modified. The
 * jquery style on/off/trigger style of adding listeners is
 * currently the preferred one.
 *
 * The on method for adding listeners takes an extra parameter which is the
 * scope in which listeners should be called. So this:
 *
 *     object.on("event", listener, this);
 *
 * Has the same function when adding events as:
 *
 *     object.on("event", listener.bind(this));
 *
 * However, the difference is that if we use the second method it
 * will not be possible to remove the listeners later, unless
 * the closure created by bind is stored somewhere. If the
 * first method is used, we can remove the listener with:
 *
 *     object.off("event", listener, this);
 *
 * @class EventDispatcher
 */
function EventDispatcher() {
	this.listenerMap = {};
}

/**
 * Add event listener.
 * @method addEventListener
 */
EventDispatcher.prototype.addEventListener = function(eventType, listener, scope) {
	if (!this.listenerMap)
		this.listenerMap = {};

	if (!eventType)
		throw new Error("Event type required for event dispatcher");

	if (!listener)
		throw new Error("Listener required for event dispatcher");

	this.removeEventListener(eventType, listener, scope);

	if (!this.listenerMap.hasOwnProperty(eventType))
		this.listenerMap[eventType] = [];

	this.listenerMap[eventType].push({
		listener: listener,
		scope: scope
	});
}

/**
 * Remove event listener.
 * @method removeEventListener
 */
EventDispatcher.prototype.removeEventListener = function(eventType, listener, scope) {
	if (!this.listenerMap)
		this.listenerMap = {};

	if (!this.listenerMap.hasOwnProperty(eventType))
		return;

	var listeners = this.listenerMap[eventType];

	for (var i = 0; i < listeners.length; i++) {
		var listenerObj = listeners[i];

		if (listener == listenerObj.listener && scope == listenerObj.scope) {
			listeners.splice(i, 1);
			i--;
		}
	}

	if (!listeners.length)
		delete this.listenerMap[eventType];
}

/**
 * Dispatch event.
 * @method dispatchEvent
 */
EventDispatcher.prototype.dispatchEvent = function(event /* ... */ ) {
	if (!this.listenerMap)
		this.listenerMap = {};

	var eventType;
	var listenerParams;

	if (typeof event == "string") {
		eventType = event;

		if (arguments.length > 1)
			listenerParams = Array.prototype.slice.call(arguments, 1);

		else listenerParams = [{
			type: eventType,
			target: this
		}];
	} else {
		eventType = event.type;
		event.target = this;
		listenerParams = [event];
	}

	if (!this.listenerMap.hasOwnProperty(eventType))
		return;

	var map = [];
	for (var i = 0; i < this.listenerMap[eventType].length; i++)
		map.push(this.listenerMap[eventType][i])

	for (var i = 0; i < map.length; i++) {
		var listenerObj = map[i];
		listenerObj.listener.apply(listenerObj.scope, listenerParams);
	}
}

/**
 * Jquery style alias for addEventListener
 * @method on
 */
EventDispatcher.prototype.on = EventDispatcher.prototype.addEventListener;

/**
 * Jquery style alias for removeEventListener
 * @method off
 */
EventDispatcher.prototype.off = EventDispatcher.prototype.removeEventListener;

/**
 * Jquery style alias for dispatchEvent
 * @method trigger
 */
EventDispatcher.prototype.trigger = EventDispatcher.prototype.dispatchEvent;

/**
 * Make something an event dispatcher. Can be used for multiple inheritance.
 * @method init
 * @static
 */
EventDispatcher.init = function(cls) {
	cls.prototype.addEventListener = EventDispatcher.prototype.addEventListener;
	cls.prototype.removeEventListener = EventDispatcher.prototype.removeEventListener;
	cls.prototype.dispatchEvent = EventDispatcher.prototype.dispatchEvent;
	cls.prototype.on = EventDispatcher.prototype.on;
	cls.prototype.off = EventDispatcher.prototype.off;
	cls.prototype.trigger = EventDispatcher.prototype.trigger;
}

if (typeof module !== 'undefined') {
	module.exports = EventDispatcher;
}
},{}],9:[function(require,module,exports){
(function (global){
var inherits = require("inherits");
var PixiApp = require("pixiapp");
var GameView = require("../view/GameView");
var GameController = require("../controller/GameController");
var GameModel = require("../model/GameModel");
var SymbolView = require("../view/SymbolView");
var TWEEN = require("tween.js");
var EventDispatcher = require("yaed");

/**
 * The app.
 */
function SlotApp(options) {
	PixiApp.call(this, 1024, 576);
	this.on("frame", TWEEN.update);
	this.matte = true;

	this.gameModel = new GameModel(options);
	this.gameModel.on("displayBalanceChange", function() {
		this.trigger("balance", this.gameModel.getDisplayBalance(), this.gameModel.getCurrency());
	}.bind(this));

	this.gameModel.on("error", function(e) {
		console.log("game model error: " + e);
		this.trigger("error", e);
	}.bind(this));

	this.gameModel.init().then(
		this.onGameModelInit.bind(this),
		this.onGameModelError.bind(this)
	);
}

inherits(SlotApp, PixiApp);
EventDispatcher.init(SlotApp);
module.exports = SlotApp;
global.SlotApp = SlotApp;

/**
 * Game model initialized.
 * Load assets.
 */
SlotApp.prototype.onGameModelInit = function() {
	this.options = this.gameModel.getOptions();

	GameView.populateAssetLoader(this.options);
	PIXI.loader.on("progress", this.onAssetsProgress.bind(this));
	PIXI.loader.on("error", this.onAssetsError.bind(this));
	PIXI.loader.load(this.onAssetsLoaded.bind(this));
}

/**
 * Game model error.
 */
SlotApp.prototype.onGameModelError = function(error) {
	this.trigger("error", error);
}

/**
 * Run after assets loaded.
 */
SlotApp.prototype.onAssetsLoaded = function() {
	console.log("assets loaded");

	this.gameView = new GameView(this.options);
	this.addChild(this.gameView);

	this.gameController = new GameController(this.options, this.gameView, this.gameModel);
	setTimeout(function() {
		if (this.haveError)
			return;

		this.trigger("complete");
	}.bind(this), 0);
}

/**
 * Assets progress.
 */
SlotApp.prototype.onAssetsProgress = function(ev) {
	this.trigger("progress", ev.progress);
}

/**
 * Assets progress.
 */
SlotApp.prototype.onAssetsError = function(ev) {
	this.haveError = true;
	this.trigger("error", "ERROR LOADING ASSETS");
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../controller/GameController":10,"../model/GameModel":12,"../view/GameView":24,"../view/SymbolView":29,"inherits":1,"pixiapp":3,"tween.js":7,"yaed":8}],10:[function(require,module,exports){
var Thenable = require("tinp");

/**
 * Game controller.
 */
function GameController(options, gameView, gameModel) {
	this.options = options;
	this.gameView = gameView;
	this.gameModel = gameModel;

	for (var i = 0; i < this.options.numReels; i++)
		this.gameView.getReelViewAt(i).setSymbols(this.gameModel.getReelSymbols(i));

	this.gameView.on("spinButtonClick", this.onGameViewSpinButtonClick, this);
	this.gameView.on("selectedBetLineChange", this.onSelectedBetLineChange, this);
	this.updateKeypadButtonsEnabled();

	this.gameView.setNumEnabledBetLines(this.gameModel.getUserBetLines());

	this.gameModel.on("stateChange", this.onGameModelStateChange.bind(this));
	this.gameModel.on("displayBalanceChange", this.onDisplayBalanceChange.bind(this));
	this.gameModel.on("betChange", this.onBetChange.bind(this));

	var keypadView = this.gameView.getKeypadView();
	keypadView.on("linesIncButtonClick", function() {
		if (this.gameModel.getState() == "stopped") {
			this.gameModel.setUserBetLines(this.gameModel.getUserBetLines() + 1);
			this.gameView.setNumEnabledBetLines(this.gameModel.getUserBetLines());
		}
	}.bind(this));

	keypadView.on("linesDecButtonClick", function() {
		if (this.gameModel.getState() == "stopped") {
			this.gameModel.setUserBetLines(this.gameModel.getUserBetLines() - 1);
			this.gameView.setNumEnabledBetLines(this.gameModel.getUserBetLines());
		}
	}.bind(this));

	keypadView.on("betIncButtonClick", function() {
		if (this.gameModel.getState() == "stopped")
			this.gameModel.nextBet();

//			this.gameModel.setBet(this.gameModel.getBet() + this.gameModel.getBetIncrease());
	}.bind(this));

	keypadView.on("betDecButtonClick", function() {
		if (this.gameModel.getState() == "stopped")
			this.gameModel.prevBet();
//			this.gameModel.setBet(this.gameModel.getBet() - this.gameModel.getBetIncrease());
	}.bind(this));

	keypadView.on("paytableButtonClick", function() {
		this.gameView.getPaytableView().toggleShown();
	}.bind(this));

	this.updateKeypadFields();

	var paytableView = this.gameView.getPaytableView();
	paytableView.on("nextButtonClick", function() {
		paytableView.setCurrentPageIndex(paytableView.getCurrentPageIndex() + 1);
	});

	paytableView.on("prevButtonClick", function() {
		paytableView.setCurrentPageIndex(paytableView.getCurrentPageIndex() - 1);
	});

	paytableView.hide();

	this.gameView.setFlashMessage(this.gameModel.getFlashMessage());
	this.showDialogIfApplicable();
}

module.exports = GameController;

/**
 * Game model state change.
 */
GameController.prototype.onGameModelStateChange = function() {
	this.updateKeypadButtonsEnabled();

	if (this.gameModel.getState() == "stopped")
		this.showDialogIfApplicable();
}

/**
 * Selected bet line change.
 */
GameController.prototype.onSelectedBetLineChange = function() {
	if (this.gameModel.getState() == "stopped")
		this.gameView.highlightBetLine(this.gameView.getSelectedBetLine());
}

/**
 * Show the dialog if it should be shown.
 */
GameController.prototype.showDialogIfApplicable = function() {
	if (!this.gameModel.getDisplayBalance())
		this.gameView.showDialog(
			"You are currently out of funds,\nplease top up your account!"
		);
}

/**
 * Update enabled state of the spin button.
 */
GameController.prototype.updateKeypadButtonsEnabled = function() {
	switch (this.gameModel.getState()) {
		case "stopped":
			if (this.gameModel.getDisplayBalance())
				this.gameView.setSpinButtonEnabled(true);

			else
				this.gameView.setSpinButtonEnabled(false);

			this.gameView.setBetButtonsEnabled(true);
			break;

		case "spinResponse":
			this.gameView.setSpinButtonEnabled(true);
			this.gameView.setBetButtonsEnabled(false);
			break;

		case "spinStarted":
		case "spinStopping":
			this.gameView.setSpinButtonEnabled(false);
			this.gameView.setBetButtonsEnabled(false);
			break;

		default:
			throw new Error("unknown state: " + this.gameModel.getState());
	}
}

/**
 * Game view spin button click.
 */
GameController.prototype.onGameViewSpinButtonClick = function() {
	this.gameView.highlightBetLine(null);

	switch (this.gameModel.getState()) {
		case "stopped":
			this.gameView.getPaytableView().hide();
			this.gameView.getWinView().resetAccumulatedWin();
			for (var i = 0; i < this.options.numReels; i++)
				this.gameView.getReelViewAt(i).startSpin();

			this.stopThenable = new Thenable();

			Thenable.all(
				this.gameModel.spin(),
				Thenable.race(
					this.stopThenable,
					Thenable.delay(this.options.spinDuration)
				)
			).then(this.onSpinComplete.bind(this));
			break;

		case "spinResponse":
			this.stopThenable.resolve();
			this.gameModel.notifySpinStopping();
			break;

		default:
			console.log("spin button has no function in this state: " + this.gameModel.getState());
			break;
	}
}

/**
 * Spin complete.
 */
GameController.prototype.onSpinComplete = function() {
	if (this.gameModel.getState() == "spinResponse")
		this.gameModel.notifySpinStopping();

	var t = [];

	for (var i = 0; i < this.options.numReels; i++)
		t.push(this.gameView.getReelViewAt(i).stopSpin(this.gameModel.getReelSymbols(i)));

	Thenable.all(t).then(function() {
		this.winBetLineIndex = 0;
		this.playBetLineWin();
	}.bind(this));
}

/**
 * Play next bet line win.
 */
GameController.prototype.playBetLineWin = function() {
	if (this.winBetLineIndex >= this.gameModel.getNumWinBetLines()) {
		this.gameModel.notifySpinComplete();
		return;
	}

	var betLineIndex = this.gameModel.getWinBetLineIndex(this.winBetLineIndex);
	this.gameView.highlightBetLine(betLineIndex);

	var winBetLine = this.gameModel.getWinBetLine(this.winBetLineIndex);
	var t = [];

	for (var i = 0; i < winBetLine.length; i++)
		t.push(this.gameView.getSymbolViewAt(i, winBetLine[i]).playBetLineWin());

	var a = this.gameModel.getWinBetLineAmount(this.winBetLineIndex);
	t.push(this.gameView.getWinView().showWin(a));

	var a = this.gameModel.getAccumulatedWinAmount(this.winBetLineIndex);
	this.gameView.getWinView().showAccumulatedWin(a);

	Thenable.all(t).then(function() {
		this.gameView.highlightBetLine(null);
		this.winBetLineIndex++;
		this.playBetLineWin();
	}.bind(this));
}

/**
 * The display balance was changed.
 */
GameController.prototype.onDisplayBalanceChange = function() {
	this.updateKeypadFields();
}

/**
 * Bet change.
 */
GameController.prototype.onBetChange = function() {
	this.updateKeypadFields();
}

/**
 * Update keypad fields.
 */
GameController.prototype.updateKeypadFields = function() {
	var keypad = this.gameView.getKeypadView();

	keypad.setBalance(this.gameModel.getDisplayBalance());
	keypad.setTotalBet(this.gameModel.getTotalBet());
	keypad.setLines(this.gameModel.getUserBetLines());
	keypad.setBet(this.gameModel.getBet());
}
},{"tinp":6}],11:[function(require,module,exports){
module.exports = {
	baseUrl: "",
	background: "res/background.png",
	foreground: "res/foreground.png",
	symbolFormat: "res/symbols/sym#.png",
	buttonHighlight: "res/highlight.png",
	paytableBackground: "res/paytable.png",
	symbols: "res/symbols.png",
	spinButtonPosition: [512, 480],
	betIncPosition: [765, 484],
	betDecPosition: [600, 484],
	linesFieldPosition: [336, 483],
	betFieldPosition: [684, 483],
	balanceFieldPosition: [884, 456],
	totalBetFieldPosition: [884, 525],
	linesIncPosition: [418, 484],
	linesDecPosition: [254, 484],
	paytableButtonPosition: [140, 482],
	paytableOffset: [100, 75],
	paytableRowSpacing: 150,
	paytableColSpacing: 300,
	paytablePrevButtonPosition: [416, 367],
	paytableNextButtonPosition: [603, 367],
	paytablePageFieldPosition: [510, 367],
	reelSpacing: 171,
	rowSpacing: 120,
	gridOffset: [165, 105],
	numReels: 5,
	numRows: 3,
	numSymbols: 9,
	reelSpeed: 1000,
	numRandomSymbols: 3,
	reelDelay: 200,
	spinDuration: 3000,
	winFieldX: 1024 / 2,
	winFieldY: 200,
	winPlateX: 1024 / 2,
	winPlateY: 340,
	betLineButtonsLeft: 50,
	betLineButtonsRight: 970,
	betLineButtonsTop: 70,
	betLineButtonsDistance: 35,
	betLevels: [1, 2, 5, 10, 20, 50, 100],
	/*	minBet: 1,
		maxBet: 10,*/
	betLines: [
		[1, 1, 1, 1, 1],
		[0, 0, 0, 0, 0],
		[2, 2, 2, 2, 2],
		[0, 1, 2, 1, 0],
		[2, 1, 0, 1, 2],
		[0, 0, 1, 0, 0],
		[2, 2, 1, 2, 2],
		[1, 2, 2, 2, 1],
		[1, 0, 0, 0, 1],
		[1, 0, 1, 0, 1],
		[1, 2, 1, 2, 1],
		[0, 1, 0, 1, 0],
		[2, 1, 2, 1, 2],
		[1, 1, 0, 1, 1],
		[1, 1, 2, 1, 1],
		[0, 1, 1, 1, 0],
		[2, 1, 1, 1, 2],
		[0, 1, 2, 2, 2],
		[2, 1, 0, 0, 0],
		[0, 2, 0, 2, 0]
	],
	paytable: [
		[0, 0, 2, 3, 4],
		[0, 0, 2, 3, 4],
		[0, 0, 2, 3, 4],
		[0, 0, 2, 3, 4],
		[0, 0, 2, 3, 4],
		[0, 0, 2, 3, 4],
		[0, 0, 10, 11, 12],
		[0, 0, 10, 11, 12],
		[0, 0, 10, 11, 12],
	],
	balance: 123,
	balanceText: null,
	flashMessage: null,
	currency: "none"
};
},{}],12:[function(require,module,exports){
var Xhr = require("../utils/Xhr");
var Thenable = require("tinp");
var EventDispatcher = require("yaed");
var DefaultOptions = require("./DefaultOptions");

/**
 * Contains the model for the game client.
 * @class GameModel
 */
function GameModel(options) {
	this.options = options;
	if (!this.options)
		this.options = {};

	this.state = "stopped";
	this.spinThenable = null;
	this.betLineWins = [];
	this.userBetLines = 1;
}

EventDispatcher.init(GameModel);

/**
 * Initialize model.
 */
GameModel.prototype.init = function() {
	if (this.initThenable)
		throw new Error("Already initialized");

	this.initThenable = new Thenable();

	if (this.options.initUrl) {
		this.initCall = new Xhr(this.options.initUrl);
		this.initCall.setResponseEncoding(Xhr.JSON);
		this.initCall.send().then(
			this.onInitCallComplete.bind(this),
			this.onInitCallError.bind(this)
		);
	} else {
		this.postInit();
		this.initThenable.resolve();
	}

	return this.initThenable;
}

/**
 * Get currency.
 */
GameModel.prototype.getCurrency = function() {
	return this.options.currency;
}

/**
 * Init call complete.
 */
GameModel.prototype.onInitCallComplete = function(initResponse) {
	if (initResponse.error) {
		this.initThenable.reject(initResponse.error);
		return;
	}

	for (var option in initResponse)
		this.options[option] = initResponse[option];

	this.postInit();
	this.initThenable.resolve();
}

/**
 * Init call failed.
 */
GameModel.prototype.onInitCallError = function(e) {
	this.initThenable.reject("Init call failed: " + e);
}

/**
 * Get model options.
 */
GameModel.prototype.getOptions = function() {
	return this.options;
}

/**
 * Get the total bet
 */
GameModel.prototype.getTotalBet = function() {
	return this.getBet() * this.getUserBetLines();
}

/**
 * Apply default options.
 */
GameModel.prototype.postInit = function() {
	for (var option in DefaultOptions)
		if (this.options[option] === undefined)
			this.options[option] = DefaultOptions[option];

	if (!this.reels || !this.reels.length)
		this.randomizeReelSymbols();

	this.betIndex = 0;
	this.userBetLines = this.options.betLines.length;
	this.balance = this.options.balance;

	this.ensureBetInRange();
}

/**
 * Ensure that the bet is not bigger than the balance.
 */
GameModel.prototype.ensureBetInRange = function() {
	while (this.getTotalBet() > this.balance && this.userBetLines > 1)
		this.userBetLines--;

	while (this.getTotalBet() > this.balance && this.betIndex > 0)
		this.betIndex--;
}

/**
 * Randomize the symbols on the reel.
 * This function exists mainly for debugging purposes, it's
 * generally not a good idea to do this on the client side.
 * @method randomizeReelSymbols
 * @private
 */
GameModel.prototype.randomizeReelSymbols = function() {
	this.reels = [];

	for (var reelIndex = 0; reelIndex < this.options.numReels; reelIndex++) {
		var reel = [];

		for (var rowIndex = 0; rowIndex < this.options.numRows; rowIndex++)
			reel.push(Math.floor(Math.random() * this.options.numSymbols));

		this.reels.push(reel);
	}
}

/**
 * Get the current reel symbols for the specified reel.
 * @method getReelSymbols
 */
GameModel.prototype.getReelSymbols = function(reelIndex) {
	return this.reels[reelIndex];
}

/**
 * Start the spin and send the spin request to the server.
 * The state needs to be "stopped".
 * @method spin
 */
GameModel.prototype.spin = function() {
	if (this.state != "stopped")
		throw new Error("need to be in stopped state to spin");

	if (!this.options.spinUrl)
		throw new Error("no spin url to call");

	this.state = "spinStarted";

	this.spinThenable = new Thenable();

	this.spinRequest = new Xhr(this.options.spinUrl);
	this.spinRequest.setResponseEncoding(Xhr.JSON);
	this.spinRequest.setParameter("betLines", this.getUserBetLines());
	this.spinRequest.setParameter("bet", this.getBet());
	this.spinRequest.send().then(
		this.onSpinRequestComplete.bind(this),
		this.onSpinRequestError.bind(this)
	);

	this.trigger("stateChange");
	this.trigger("displayBalanceChange");
	return this.spinThenable;
}

/**
 * Get the current state of the game.
 * Available states:
 *   stopped      - The game is currently stopped.
 *   spinStarted  - The request has been sent to the server,
 *                  but we have not yet received the response.
 *   spinResponse - We have received the response from the server.
 *   spinStopping - The user has requested to quick stop the spin.
 */
GameModel.prototype.getState = function() {
	return this.state;
}

/**
 * We got the response from the server.
 * @method onSpinRequestComplete
 * @private
 */
GameModel.prototype.onSpinRequestComplete = function(response) {
	if (!response.reels)
		throw new Error("got no reels in spin response");

	if (response.reels.length != this.options.numReels)
		throw new Error("wrong number of reels");

	if (response.reels[0].length != this.options.numRows)
		throw new Error("wrong number of rows");

	this.state = "spinResponse";
	this.reels = response.reels;
	this.betLineWins = response.betLineWins;
	this.balance = response.balance;
	this.spinBalance = response.spinBalance;

	this.spinThenable.resolve();
	this.spinThenable = null;
	this.trigger("stateChange");
	this.trigger("displayBalanceChange");
}

/**
 * There was an error with the spin request.
 * @method onSpinRequestError
 * @private
 */
GameModel.prototype.onSpinRequestError = function(error) {
	console.log("spin error");

	this.state = "stopped";
	this.trigger("stateChange");
	this.trigger("displayBalanceChange");
	this.trigger("betChange");
	this.trigger("error", error);
}

/**
 * Notify model that the spin is stopping on user request.
 * @method notifySpinStopping
 */
GameModel.prototype.notifySpinStopping = function() {
	if (this.state != "spinResponse")
		throw new Error("can only stop in the spinResponse state");

	this.state = "spinStopping";
	this.trigger("stateChange");
	this.trigger("displayBalanceChange");
}

/**
 * Notify model that the spin is complete, we are ready for the next game.
 * @method notifySpinComplete
 */
GameModel.prototype.notifySpinComplete = function() {
	if (this.state != "spinResponse" && this.state != "spinStopping")
		throw new Error("spin can't be complete in this state: " + this.state);

	this.ensureBetInRange();

	this.state = "stopped";
	this.trigger("stateChange");
	this.trigger("displayBalanceChange");
	this.trigger("betChange");
}

/**
 * Get number of winning betlines.
 */
GameModel.prototype.getNumWinBetLines = function() {
	return this.betLineWins.length;
}

/**
 * Get winning betline.
 */
GameModel.prototype.getFullWinBetLine = function(winIndex) {
	var betLineIndex = this.betLineWins[winIndex].betLine;
	return this.options.betLines[betLineIndex];
}

/**
 * Get winning betline.
 */
GameModel.prototype.getWinBetLine = function(winIndex) {
	return this.getFullWinBetLine(winIndex).slice(0, this.betLineWins[winIndex].numSymbols);
}

/**
 * Get amount for a winning bet line.
 */
GameModel.prototype.getWinBetLineAmount = function(winIndex) {
	return this.betLineWins[winIndex].amount;
}

/**
 * Get winning bet line by win index.
 */
GameModel.prototype.getWinBetLineIndex = function(winIndex) {
	return this.betLineWins[winIndex].betLine;
}

/**
 * Get accumulated win amount.
 */
GameModel.prototype.getAccumulatedWinAmount = function(winIndex) {
	var accumulated = 0;

	for (var i = 0; i < winIndex + 1; i++)
		accumulated += this.betLineWins[winIndex].amount;

	return accumulated;
}

/**
 * Get flash message.
 */
GameModel.prototype.getFlashMessage = function() {
	return this.options.flashMessage;
}

/**
 * Get the balance that should be displayed depending on state.
 */
GameModel.prototype.getDisplayBalance = function() {
	if (this.options.balanceText)
		return this.options.balanceText;

	switch (this.state) {
		case "stopped":
			return this.balance;
			break;

		case "spinStarted":
			return this.balance - this.getTotalBet();
			break;

		case "spinResponse":
		case "spinStopping":
			return this.spinBalance;
			break;

		default:
			throw new Error("unknown state");
	}
}

/**
 * Get number of bet lines for the user bet.
 */
GameModel.prototype.getUserBetLines = function() {
	return this.userBetLines;
}

/**
 * Set number of bet lines for the current user bet.
 */
GameModel.prototype.setUserBetLines = function(userBetLines) {
	if (this.state != "stopped")
		throw new Error("state needs to be stopped to change bet lines");

	var old = this.userBetLines;
	this.userBetLines = userBetLines;

	if (this.userBetLines > this.options.betLines.length)
		this.userBetLines = this.options.betLines.length;

	if (this.userBetLines < 1)
		this.userBetLines = 1;

	if (this.getTotalBet() > this.balance)
		this.userBetLines = old;

	this.trigger("betChange");
}

/**
 * Get current bet.
 */
GameModel.prototype.getBet = function() {
	return this.options.betLevels[this.betIndex];
}

/**
 * Prev bet.
 */
GameModel.prototype.nextBet = function() {
	this.betIndex++;

	if (this.betIndex >= this.options.betLevels.length)
		this.betIndex = this.options.betLevels.length - 1;

	this.ensureBetInRange();
	this.trigger("betChange");
}

/**
 * Prev bet.
 */
GameModel.prototype.prevBet = function() {
	this.betIndex--;

	if (this.betIndex < 0)
		this.betIndex = 0;

	this.trigger("betChange");
}

module.exports = GameModel;
},{"../utils/Xhr":17,"./DefaultOptions":11,"tinp":6,"yaed":8}],13:[function(require,module,exports){
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
},{"inherits":1}],14:[function(require,module,exports){
/**
 * Cur out sprites from an image representing a grid of sprites.
 */
function GridSheet(texture) {
    this.texture = texture;

    this.gridRows = 3;
    this.gridCols = 3;
}

module.exports = GridSheet;

/**
 * Create a sprite given an index.
 */
GridSheet.prototype.createSprite = function(index) {
    var t = this.texture.clone();
    var row = Math.floor(index / this.gridRows);
    var col = index % this.gridCols;

    t.frame = new PIXI.Rectangle(
        col * t.width / this.gridCols,
        row * t.height / this.gridRows,
        t.width / this.gridCols,
        t.height / this.gridRows);

    return new PIXI.Sprite(t);
}

},{}],15:[function(require,module,exports){
function PixiUtil() {}
module.exports = PixiUtil;

PixiUtil.findParentOfType = function(child, parentType) {
	if (!child)
		return null;

	if (child instanceof parentType)
		return child;

	if (!child.parent)
		return null;

	return PixiUtil.findParentOfType(child.parent, parentType);
}
},{}],16:[function(require,module,exports){
/**
 * Utl utilities class.
 * @class UrlUtil
 */
function UrlUtil() {}

/**
 * For something empty, return empty.
 * For an absolute url, return the url.
 * For something else, assume relative url and
 * append the base url.
 * @method makeAbsolute
 * @static
 */
UrlUtil.makeAbsolute = function(url, baseUrl) {
    if (!url)
        return null;

    if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0)
        return url;

    return baseUrl + url;
}

module.exports = UrlUtil;

},{}],17:[function(require,module,exports){
var Thenable = require("tinp");

/**
 * Wrapper for XMLHttpRequest.
 */
function Xhr(url) {
	this.url = url;
	this.responseEncoding = Xhr.NONE;
	this.method = "GET";
	this.parameters = {};
}

module.exports = Xhr;

Xhr.NONE = "none";
Xhr.JSON = "json";

/**
 * Set url.
 */
Xhr.prototype.setUrl = function(url) {
	this.url = url;
}

/**
 * Set response encoding.
 */
Xhr.prototype.setResponseEncoding = function(encoding) {
	this.responseEncoding = encoding;
}

/**
 * Set parameter.
 */
Xhr.prototype.setParameter = function(parameter, value) {
	this.parameters[parameter] = value;
}

/**
 * Send.
 */
Xhr.prototype.send = function() {
	if (this.sendThenable || this.request)
		throw new Exception("Already used");

	this.sendThenable = new Thenable();

	var url = this.url;

	for (parameter in this.parameters) {
		if (url.indexOf("?") >= 0)
			url += "&";

		else
			url += "?";

		url += parameter + "=" + encodeURIComponent(this.parameters[parameter]);
	}

	this.request = new XMLHttpRequest();
	this.request.onreadystatechange = this.onRequestReadyStateChange.bind(this);
	this.request.open(this.method, url, true);
	this.request.send();

	return this.sendThenable;
}

/**
 * Ready state change.
 */
Xhr.prototype.onRequestReadyStateChange = function() {
	if (this.request.readyState != 4)
		return;

	this.response = this.request.responseText;

	switch (this.responseEncoding) {
		case Xhr.JSON:
			try {
				this.response = JSON.parse(this.response);
			} catch (e) {
				this.sendThenable.reject("Unable to parse JSON");
				return;
			}
			break;
	}

	if (this.response.error || this.request.status != 200) {
		if (this.response.error)
			this.sendThenable.reject(this.response.error);

		else if (this.response)
			this.sendThenable.reject(this.response);

		else
			this.sendThenable.reject(this.request.statusText);
		return;
	}

	this.sendThenable.resolve(this.response);
}
},{"tinp":6}],18:[function(require,module,exports){
var inherits = require("inherits");

/**
 * Button to highlight a bet line.
 * @class BetLineButton
 * @extends PIXI.Container
 * @constructor
 */
function BetLineButton() {
	PIXI.Container.call(this);

	var style = {
		font: "bold 20px sans",
		dropShadow: true,
		fill: "#ffffff",
		dropShadowColor: "#000000",
		dropShadowDistance: 2,
		dropShadowAngle: Math.PI / 4
	};

	this.labelField = new PIXI.Text("", style);
	this.addChild(this.labelField);

	this.setBetLineIndex(0);
}

inherits(BetLineButton, PIXI.Container);
module.exports = BetLineButton;

/**
 * Set bet line index.
 * @method setBetLineIndex
 * @param {Number} index The index of the bet line.
 */
BetLineButton.prototype.setBetLineIndex = function(index) {
	var betLineColors = [
		0xff8080,
		0x80ff80,
		0xffff80,
		0x8080ff,
		0xff80ff,
		0x80ffff,
	];

	this.labelField.text = (index + 1);
	this.labelField.x = -this.labelField.width / 2;
	this.labelField.y = -this.labelField.height / 2;

	if (this.highlight)
		this.removeChild(this.highlight);

	this.highlight = new PIXI.Graphics();
	this.highlight.beginFill(0, .5);
	this.highlight.drawCircle(0, 0, 21);
	this.highlight.beginFill(betLineColors[index % betLineColors.length], 1);
	this.highlight.drawCircle(0, 0, 19);
	this.highlight.visible = false;
	this.addChildAt(this.highlight, 0);
}

/**
 * Set highlight.
 * @method setHighlight
 */
BetLineButton.prototype.setHighlight = function(highlight) {
	this.highlight.visible = highlight;
}

/**
 * Enabled or not?
 * @method setEnabled
 */
BetLineButton.prototype.setEnabled = function(enabled) {
	if (enabled)
		this.alpha = 1;

	else
		this.alpha = .5;
}

/**
 * Enabled or not?
 * @method isEnabled
 */
BetLineButton.prototype.isEnabled = function(enabled) {
	return (this.alpha == 1);
}
},{"inherits":1}],19:[function(require,module,exports){
var inherits = require("inherits");
var EventDispatcher = require("yaed");
var BetLineButton = require("./BetLineButton");

/**
 * Manages the bet line highlight buttons.
 * @class BetLineButtonsView
 * @extends PIXI.Container
 * @constructor
 * @param {Object} options Game options.
 */
function BetLineButtonsView(options) {
	PIXI.Container.call(this);

	this.options = options;

	var g = new PIXI.Graphics();
	g.beginFill(0xff0000, 1);
	g.drawRect(0, 0, 100, 100);
	this.addChild(g);

	this.selectedBetLine = null;

	this.createBetLineButtons();
}

inherits(BetLineButtonsView, PIXI.Container);
EventDispatcher.init(BetLineButtonsView);
module.exports = BetLineButtonsView;

/**
 * Set number of bet lines.
 * @method createBetLineButtons
 * @param {Number} num The number of bet lines available in the game.
 */
BetLineButtonsView.prototype.createBetLineButtons = function() {
	this.removeChildren();
	this.buttons = [];

	this.numButtons = this.options.betLines.length;
	var halfNumButtons = Math.floor(this.numButtons / 2);

	for (var i = 0; i < this.numButtons; i++) {
		var button = new BetLineButton();
		this.buttons.push(button);

		if (!halfNumButtons || i < halfNumButtons) {
			button.x = this.options.betLineButtonsLeft;
			button.y = this.options.betLineButtonsTop +
				i * this.options.betLineButtonsDistance;
		} else {
			button.x = this.options.betLineButtonsRight;
			button.y = this.options.betLineButtonsTop +
				(i - halfNumButtons) * this.options.betLineButtonsDistance;
		}

		button.setBetLineIndex(i);
		this.addChild(button);

		button.interactive = true;
		button.mouseover = function(num) {
			if (this.buttons[num].isEnabled())
				this.selectedBetLine = num;

			else
				this.selectedBetLine = null;

			this.trigger("selectedBetLineChange")
		}.bind(this, i);
		button.mouseout = function(num) {
			if (num == this.selectedBetLine)
				this.selectedBetLine = null;
			this.trigger("selectedBetLineChange")
		}.bind(this, i);
	}
}

/**
 * Set number of enabled bet lines.
 * @method setNumEnabledBetLines
 */
BetLineButtonsView.prototype.setNumEnabledBetLines = function(numLines) {
	for (var i = 0; i < this.buttons.length; i++)
		if (i < numLines)
			this.buttons[i].setEnabled(true);

		else
			this.buttons[i].setEnabled(false);
}

/**
 * Get currently selected bet line.
 * @method getSelectedBetLine
 * @return {Number} The currently selected bet line. If no bet line is
 *                  this function returns null. Please note that 0
 *                  has a different meaning than null.
 */
BetLineButtonsView.prototype.getSelectedBetLine = function() {
	return this.selectedBetLine;
}

/**
 * Highligh a bet line.
 */
BetLineButtonsView.prototype.highlightBetLine = function(betLineIndex) {
	for (var i = 0; i < this.buttons.length; i++)
		this.buttons[i].setHighlight(false);

	if (betLineIndex == null)
		return;

	this.buttons[betLineIndex].setHighlight(true);
}
},{"./BetLineButton":18,"inherits":1,"yaed":8}],20:[function(require,module,exports){
var inherits = require("inherits");

/**
 * Bet line view.
 */
function BetLineView(options) {
	PIXI.Container.call(this);
	this.options = options;

	this.betLineGraphics = new PIXI.Graphics();
	this.addChild(this.betLineGraphics);
}

inherits(BetLineView, PIXI.Container);
module.exports = BetLineView;

/**
 * Show bet line by index.
 */
BetLineView.prototype.showBetLineIndex = function(index) {
	var betLineColors = [
		0xff8080,
		0x80ff80,
		0xffff80,
		0x8080ff,
		0xff80ff,
		0x80ffff,
	];

	var betLine = this.options.betLines[index];

	if (!betLine)
		throw new Error("Bet line with index " + index + " doesn't exist");

	this.showBetLine(betLine, betLineColors[index % betLineColors.length]);
}

/**
 * Show bet line.
 */
BetLineView.prototype.showBetLine = function(betLine, color) {
	if (!color)
		color = 0xffffff;

	if (betLine.length != this.options.numReels)
		throw new Error("wrong number of entries in betLine");

	var g = this.betLineGraphics;

	g.visible = true;
	g.clear();

	g.lineStyle(10, 0x000000, .5);
	this.drawBetLine(betLine);

	g.lineStyle(9, 0x000000, 1);
	this.drawBetLine(betLine);

	g.lineStyle(6, color, .5);
	this.drawBetLine(betLine);

	g.lineStyle(5, color, 1);
	this.drawBetLine(betLine);
}

/**
 * Hide the bet line view.
 */
BetLineView.prototype.hide = function() {
	this.betLineGraphics.visible = false;
}

/**
 * Draw bet line
 * @private
 */
BetLineView.prototype.drawBetLine = function(betLine) {
	var g = this.betLineGraphics;

	g.moveTo(
		this.options.gridOffset[0],
		this.options.gridOffset[1] + betLine[0] * this.options.rowSpacing);

	for (var i = 1; i < this.options.numReels; i++) {
		g.lineTo(
			this.options.gridOffset[0] + i * this.options.reelSpacing,
			this.options.gridOffset[1] + betLine[i] * this.options.rowSpacing
		);
	}
}
},{"inherits":1}],21:[function(require,module,exports){
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

	this.mouseout = this.touchend = function() {
		this.alpha = 0;
	}.bind(this)

	this.mousedown = this.touchstart = function() {
		this.brightnessFilter.brightness = 0;
		this.alpha = .5;
	}.bind(this)

	this.click = this.tap = function() {
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
},{"../utils/BrightnessFilter":13,"../utils/PixiUtil":15,"inherits":1,"yaed":8}],22:[function(require,module,exports){
var inherits = require("inherits");

/**
 * Dialog.
 */
function DialogView(options) {
	PIXI.Container.call(this);
	this.options = options;

	var style = {
		font: "bold 30px sans",
		fill: "#ffffff",
		dropShadow: true,
		dropShadowColor: "#000000",
		dropShadowDistance: 0,
		dropShadowBlur: 5,
		dropShadowAngle: Math.PI / 4,
		stroke: "#000000",
		strokeThickness: 3,
		align: "center"

	}

	this.messageField = new PIXI.Text("HELLO", style);
	this.messageField.y = 190;
	this.addChild(this.messageField);

	this.visible = false;
}

inherits(DialogView, PIXI.Container);
module.exports = DialogView;

/**
 * Set message.
 */
DialogView.prototype.show = function(message) {
	console.log("show");
	if (!message)
		message = "";

	this.visible = true;
	this.messageField.text = message;
	this.messageField.x = 1024 / 2 - this.messageField.width / 2;
}
},{"inherits":1}],23:[function(require,module,exports){
var inherits = require("inherits");

/**
 * The keypad.
 */
function FlashMessageView(options) {
	PIXI.Container.call(this);
	this.options = options;

	var style = {
		font: "bold 40px sans",
		fill: "#ff0000"
	}

	this.messageField = new PIXI.Text("HELLO", style);
	this.messageField.alpha = .5;
	this.messageField.y = 360;
	this.addChild(this.messageField);

	this.timeoutId = null;
	this.flash();
}

inherits(FlashMessageView, PIXI.Container);
module.exports = FlashMessageView;

/**
 * Set message.
 */
FlashMessageView.prototype.setMessage = function(message) {
	if (!message)
		message = "";

	this.messageField.text = message;

	this.messageField.x = 1024 / 2 - this.messageField.width / 2;
}

/**
 * Force flash.
 */
FlashMessageView.prototype.flash = function() {
	if (this.timeoutId)
		clearTimeout(this.timeoutId);

	this.messageField.visible = true;
	setTimeout(this.onFlashTimeout.bind(this), 1000);
}

/**
 * Flash timeout.
 */
FlashMessageView.prototype.onFlashTimeout = function() {
	this.messageField.visible = !this.messageField.visible;
	setTimeout(this.onFlashTimeout.bind(this), 1000);
}
},{"inherits":1}],24:[function(require,module,exports){
var inherits = require("inherits");
var EventDispatcher = require("yaed");
var ReelView = require("./ReelView");
var BetLineButtonsView = require("./BetLineButtonsView");
var BetLineView = require("./BetLineView");
var WinView = require("./WinView");
var KeypadView = require("./KeypadView");
var SymbolView = require("./SymbolView");
var FlashMessageView = require("./FlashMessageView");
var PaytableView = require("./PaytableView");
var UrlUtil = require("../utils/UrlUtil");
var DialogView = require("./DialogView");

/**
 * The main view of the game.
 * @class GameView
 */
function GameView(options) {
    PIXI.Container.call(this);

    this.options = options;

    this.background = PIXI.Sprite.fromFrame(UrlUtil.makeAbsolute(this.options.background, options.baseUrl));
    this.addChild(this.background);

    this.reelViews = [];
    for (var i = 0; i < this.options.numReels; i++) {
        var reelView = new ReelView(this.options);
        reelView.setReelIndex(i);
        this.reelViews.push(reelView);
        this.addChild(reelView);
    }

    this.foreground = PIXI.Sprite.fromFrame(UrlUtil.makeAbsolute(this.options.foreground, options.baseUrl));
    this.addChild(this.foreground);

    this.keypadView = new KeypadView(this.options);
    this.keypadView.on("spinButtonClick", this.trigger.bind(this, "spinButtonClick"));
    this.addChild(this.keypadView);

    this.betLineButtonsView = new BetLineButtonsView(this.options);
    this.betLineButtonsView.on("selectedBetLineChange", function() {
        this.trigger("selectedBetLineChange");
    }.bind(this));
    this.addChild(this.betLineButtonsView);

    this.betLineView = new BetLineView(this.options);
    this.addChild(this.betLineView);

    this.winView = new WinView(this.options);
    this.addChild(this.winView);

    this.flashMessageView = new FlashMessageView(this.options);
    this.addChild(this.flashMessageView);

    this.dialogView = new DialogView(this.options);
    this.addChild(this.dialogView);

    this.paytableView = new PaytableView(this.options);
    this.addChild(this.paytableView);
}

inherits(GameView, PIXI.Container);
EventDispatcher.init(GameView);
module.exports = GameView;

/**
 * Show dialog.
 */
GameView.prototype.showDialog = function(message) {
    this.dialogView.show(message);
}

/**
 * Get flashing message.
 */
GameView.prototype.setFlashMessage = function(message) {
    this.flashMessageView.setMessage(message);
}

/**
 * Highlight a bet line.
 */
GameView.prototype.highlightBetLine = function(betLineIndex) {
    if (betLineIndex === null) {
        this.betLineView.hide();
        this.betLineButtonsView.highlightBetLine(null);
        return;
    }

    this.betLineView.showBetLineIndex(betLineIndex);
    this.betLineButtonsView.highlightBetLine(betLineIndex);
}

/**
 * Get reference to win view.
 * @method getWinView
 */
GameView.prototype.getWinView = function() {
    return this.winView;
}

/**
 * Get selected bet line.
 */
GameView.prototype.getSelectedBetLine = function() {
    return this.betLineButtonsView.getSelectedBetLine();
}

/**
 * Get selected bet line.
 */
GameView.prototype.setNumEnabledBetLines = function(num) {
    return this.betLineButtonsView.setNumEnabledBetLines(num);
}

/**
 * Get bet line view.
 */
GameView.prototype.getBetLineView = function() {
    return this.betLineView;
}

/**
 * Get reel view at index.
 */
GameView.prototype.getReelViewAt = function(index) {
    return this.reelViews[index];
}

/**
 * Get symbol view ar reel and row.
 */
GameView.prototype.getSymbolViewAt = function(reelIndex, rowIndex) {
    return this.getReelViewAt(reelIndex).getSymbolViewAt(rowIndex);
}

/**
 * Set spin button enabled.
 */
GameView.prototype.setSpinButtonEnabled = function(enabled) {
    this.keypadView.setSpinButtonEnabled(enabled);
}

/**
 * Set bet buttons enabled.
 */
GameView.prototype.setBetButtonsEnabled = function(enabled) {
    this.keypadView.setBetButtonsEnabled(enabled);
}

/**
 * Get keypad view.
 */
GameView.prototype.getKeypadView = function() {
    return this.keypadView;
}

/**
 * Paytable view.
 */
GameView.prototype.getPaytableView = function() {
    return this.paytableView;
}

/**
 * Populate pixi loader according to options.
 */
GameView.populateAssetLoader = function(options) {
    for (var i = 0; i < options.numSymbols; i++) {
        var symbolId = SymbolView.generateSymbolFrameId(options.symbolFormat, i);
        PIXI.loader.add(symbolId, UrlUtil.makeAbsolute(symbolId, options.baseUrl));
    }

    PIXI.loader.add(UrlUtil.makeAbsolute(options.background, options.baseUrl));
    PIXI.loader.add(options.foreground, UrlUtil.makeAbsolute(options.foreground, options.baseUrl));
    PIXI.loader.add(options.paytableBackground, UrlUtil.makeAbsolute(options.paytableBackground, options.baseUrl));
    PIXI.loader.add(options.buttonHighlight, UrlUtil.makeAbsolute(options.buttonHighlight, options.baseUrl));

    if (options.symbols)
        PIXI.loader.add(UrlUtil.makeAbsolute(options.symbols, options.baseUrl));
}
},{"../utils/UrlUtil":16,"./BetLineButtonsView":19,"./BetLineView":20,"./DialogView":22,"./FlashMessageView":23,"./KeypadView":25,"./PaytableView":27,"./ReelView":28,"./SymbolView":29,"./WinView":30,"inherits":1,"yaed":8}],25:[function(require,module,exports){
var inherits = require("inherits");
var EventDispatcher = require("yaed");
var ButtonHighlight = require("./ButtonHighlight");

/**
 * The keypad.
 */
function KeypadView(options) {
	PIXI.Container.call(this);
	this.options = options;

	this.spinButton = new ButtonHighlight(this.options, 60);
	this.spinButton.x = this.options.spinButtonPosition[0];
	this.spinButton.y = this.options.spinButtonPosition[1];
	this.spinButton.on("click", this.trigger.bind(this, "spinButtonClick"));
	this.spinButton.setEnabled(false);
	this.addChild(this.spinButton);

	this.betIncButton = new ButtonHighlight(this.options, 20);
	this.betIncButton.x = this.options.betIncPosition[0];
	this.betIncButton.y = this.options.betIncPosition[1];
	this.betIncButton.on("click", this.trigger.bind(this, "betIncButtonClick"));
	this.addChild(this.betIncButton);

	this.betDecButton = new ButtonHighlight(this.options, 20);
	this.betDecButton.x = this.options.betDecPosition[0];
	this.betDecButton.y = this.options.betDecPosition[1];
	this.betDecButton.on("click", this.trigger.bind(this, "betDecButtonClick"));
	this.addChild(this.betDecButton);

	this.linesIncButton = new ButtonHighlight(this.options, 20);
	this.linesIncButton.x = this.options.linesIncPosition[0];
	this.linesIncButton.y = this.options.linesIncPosition[1];
	this.linesIncButton.on("click", this.trigger.bind(this, "linesIncButtonClick"));
	this.addChild(this.linesIncButton);

	this.linesDecButton = new ButtonHighlight(this.options, 20);
	this.linesDecButton.x = this.options.linesDecPosition[0];
	this.linesDecButton.y = this.options.linesDecPosition[1];
	this.linesDecButton.on("click", this.trigger.bind(this, "linesDecButtonClick"));
	this.addChild(this.linesDecButton);

	this.paytableButton = new ButtonHighlight(this.options, 40);
	this.paytableButton.x = this.options.paytableButtonPosition[0];
	this.paytableButton.y = this.options.paytableButtonPosition[1];
	this.paytableButton.on("click", this.trigger.bind(this, "paytableButtonClick"));
	this.addChild(this.paytableButton);

	var style = {
		font: "bold 20px sans",
		fill: "#00ff00",
	}

	this.linesField = new PIXI.Text("<lines>", style);
	this.addChild(this.linesField);

	this.betField = new PIXI.Text("<bet>", style);
	this.addChild(this.betField);

	this.balanceField = new PIXI.Text("<balance>", style);
	this.addChild(this.balanceField);

	this.totalBetField = new PIXI.Text("<total bet>", style);
	this.addChild(this.totalBetField);

	this.updateFieldPositions();
}

inherits(KeypadView, PIXI.Container);
EventDispatcher.init(KeypadView);
module.exports = KeypadView;

/**
 * Update positions for text fields.
 */
KeypadView.prototype.updateFieldPositions = function() {
	this.linesField.x = this.options.linesFieldPosition[0] - this.linesField.width / 2;
	this.linesField.y = this.options.linesFieldPosition[1] - this.linesField.height / 2;

	this.betField.x = this.options.betFieldPosition[0] - this.betField.width / 2;
	this.betField.y = this.options.betFieldPosition[1] - this.betField.height / 2;

	this.balanceField.x = this.options.balanceFieldPosition[0] - this.balanceField.width / 2;
	this.balanceField.y = this.options.balanceFieldPosition[1] - this.balanceField.height / 2;

	this.totalBetField.x = this.options.totalBetFieldPosition[0] - this.totalBetField.width / 2;
	this.totalBetField.y = this.options.totalBetFieldPosition[1] - this.totalBetField.height / 2;
}

/**
 * Set spin button enabled.
 */
KeypadView.prototype.setSpinButtonEnabled = function(enabled) {
	this.spinButton.setEnabled(enabled);
}

/**
 * Should the bet buttons be enabled?
 */
KeypadView.prototype.setBetButtonsEnabled = function(enabled) {
	this.betIncButton.setEnabled(enabled);
	this.betDecButton.setEnabled(enabled);
	this.linesIncButton.setEnabled(enabled);
	this.linesDecButton.setEnabled(enabled);
}

/**
 * Set bet.
 */
KeypadView.prototype.setBet = function(bet) {
	this.betField.text = bet;
	this.updateFieldPositions();
}

/**
 * Set total bet.
 */
KeypadView.prototype.setTotalBet = function(totalBet) {
	this.totalBetField.text = totalBet;
	this.updateFieldPositions();
}

/**
 * Set balance.
 */
KeypadView.prototype.setBalance = function(balance) {
	this.balanceField.text = balance;
	this.updateFieldPositions();
}

/**
 * Set bet.
 */
KeypadView.prototype.setLines = function(lines) {
	this.linesField.text = lines;
	this.updateFieldPositions();
}
},{"./ButtonHighlight":21,"inherits":1,"yaed":8}],26:[function(require,module,exports){
var inherits = require("inherits");
var SymbolView = require("./SymbolView");

/**
 * Shows one entry for the paytable.
 */
function PaytableEntryView(options) {
	PIXI.Container.call(this);
	this.options = options;

	var style = {
		font: "bold 24px sans",
		dropShadow: true,
		fill: "#ffffff",
		dropShadowColor: "#000000",
		dropShadowDistance: 2,
		dropShadowAngle: Math.PI / 4
	};

	this.payoutField = new PIXI.Text("3 - 1x\n4 - 2x\n5 - 3x", style);
	this.addChild(this.payoutField);
}

inherits(PaytableEntryView, PIXI.Container);
module.exports = PaytableEntryView;

/**
 * Set symbol id.
 */
PaytableEntryView.prototype.setSymbolId = function(symbolId) {
	if (this.symbol)
		this.removeChild(this.symbol);

    this.symbol = SymbolView.getSymbolSheet(this.options).createSprite(symbolId);

/*	var imageId = SymbolView.generateSymbolFrameId(this.options.baseUrl + this.options.symbolFormat, symbolId);
	this.symbol = PIXI.Sprite.fromImage(imageId);*/
	this.addChild(this.symbol);

	this.updateFieldPosition();
}

/**
 * Set payouts.
 */
PaytableEntryView.prototype.setPayouts = function(payouts) {
	var s = "";
	for (var i = 0; i < this.options.numReels; i++) {
		if (payouts[i]) {
			if (s)
				s+="\n";

			s += (i + 1) + ": " + payouts[i] + "x";
		}
	}

	this.payoutField.text = s;
	this.updateFieldPosition();
}

/**
 * Update field position.
 * @private
 */
PaytableEntryView.prototype.updateFieldPosition = function() {
	this.payoutField.x = this.symbol.width + 20;
	this.payoutField.y = (this.symbol.height - this.payoutField.height) / 2;
}
},{"./SymbolView":29,"inherits":1}],27:[function(require,module,exports){
var inherits = require("inherits");
var PaytableEntryView = require("./PaytableEntryView");
var ButtonHighlight = require("./ButtonHighlight");
var EventDispatcher = require("yaed");
var UrlUtil = require("../utils/UrlUtil");

/**
 * Show the paytable.
 */
function PaytableView(options) {
    PIXI.Container.call(this);

    this.options = options;

    this.background = PIXI.Sprite.fromFrame(UrlUtil.makeAbsolute(this.options.paytableBackground, this.options.baseUrl));
    this.addChild(this.background);

    this.nextButton = new ButtonHighlight(this.options, 20);
    this.nextButton.x = this.options.paytableNextButtonPosition[0];
    this.nextButton.y = this.options.paytableNextButtonPosition[1];
    this.nextButton.on("click", this.trigger.bind(this, "nextButtonClick"))
    this.addChild(this.nextButton);

    this.prevButton = new ButtonHighlight(this.options, 20);
    this.prevButton.x = this.options.paytablePrevButtonPosition[0];
    this.prevButton.y = this.options.paytablePrevButtonPosition[1];
    this.prevButton.on("click", this.trigger.bind(this, "prevButtonClick"))
    this.addChild(this.prevButton);

    var style = {
        font: "bold 24px sans",
        dropShadow: true,
        fill: "#ffffff",
        dropShadowColor: "#000000",
        dropShadowDistance: 2,
        dropShadowAngle: Math.PI / 4
    };

    this.pageField = new PIXI.Text("1/2", style);
    this.pageField.x = this.options.paytablePageFieldPosition[0] - this.pageField.width / 2;
    this.pageField.y = this.options.paytablePageFieldPosition[1] - this.pageField.height / 2;
    this.addChild(this.pageField);

    this.createEntries();
}

inherits(PaytableView, PIXI.Container);
EventDispatcher.init(PaytableView);
module.exports = PaytableView;

/**
 * Hide the paytable.
 */
PaytableView.prototype.hide = function() {
    this.visible = false;
}

/**
 * Toggle visibility of the paytable.
 */
PaytableView.prototype.toggleShown = function() {
    if (this.visible)
        this.visible = false;

    else
        this.visible = true;
}

/**
 * Create entries.
 */
PaytableView.prototype.createEntries = function() {
    var x = 0;
    var y = 0;
    var page;

    this.pages = [];

    for (var i = 0; i < this.options.numSymbols; i++) {
        if (!page) {
            page = new PIXI.Container();
            this.pages.push(page);
            this.addChild(page);
        }

        var entry = new PaytableEntryView(this.options);
        entry.x = this.options.paytableOffset[0] + x * this.options.paytableColSpacing;
        entry.y = this.options.paytableOffset[1] + y * this.options.paytableRowSpacing;
        entry.setSymbolId(i);
        entry.setPayouts(this.options.paytable[i]);
        page.addChild(entry);

        x++;
        if (x > 2) {
            x = 0;
            y++;

            if (y > 1) {
                y = 0;
                page = null;
            }
        }
    }

    this.currentPageIndex = 0;
    this.updateCurrentPage();
}

/**
 * Update current page.
 */
PaytableView.prototype.updateCurrentPage = function() {
    for (var i = 0; i < this.pages.length; i++)
        this.pages[i].visible = false;

    this.pages[this.currentPageIndex].visible = true;
    this.pageField.text = (this.currentPageIndex + 1) + "/" + this.pages.length;
}

/**
 * Set the current page index.
 */
PaytableView.prototype.setCurrentPageIndex = function(index) {
    this.currentPageIndex = index;

    if (this.currentPageIndex < 0)
        this.currentPageIndex = 0;

    if (this.currentPageIndex >= this.pages.length)
        this.currentPageIndex = this.pages.length - 1;

    this.updateCurrentPage();
}

/**
 * Get current page index.
 */
PaytableView.prototype.getCurrentPageIndex = function() {
    return this.currentPageIndex;
}

},{"../utils/UrlUtil":16,"./ButtonHighlight":21,"./PaytableEntryView":26,"inherits":1,"yaed":8}],28:[function(require,module,exports){
var inherits = require("inherits");
var SymbolView = require("./SymbolView");
var PixiUtil = require("../utils/PixiUtil");
var TWEEN = require("tween.js");
var Thenable = require("tinp");

function ReelView(options) {
	PIXI.Container.call(this);

	this.options = options;
	this.symbols = [];
	this.reelOffset = 0;

	this.randomSymbols = [];

	for (var i = 0; i < this.options.numRandomSymbols; i++)
		this.randomSymbols.push(Math.floor(Math.random() * this.options.numSymbols));
}

inherits(ReelView, PIXI.Container);
module.exports = ReelView;

ReelView.prototype.setReelIndex = function(index) {
	this.reelIndex = index;
	this.x = this.options.gridOffset[0] + this.reelIndex * this.options.reelSpacing;
	this.y = this.options.gridOffset[1];

	this.symbolHolder = new PIXI.Container();
	this.addChild(this.symbolHolder);
}

ReelView.prototype.setSymbols = function(symbolIds) {
	if (symbolIds.length != this.options.numRows)
		throw new Error("Unexpected number of symbols");

	this.clearPosition();
	this.clearTimeout();
	this.stopping = false;

	this.symbolIds = symbolIds;
	this.createSymbolClips();
}

ReelView.prototype.stopSpin = function(symbolIds) {
	this.clearTimeout();
	this.stopThenable = new Thenable();

	this.timeout = setTimeout(function() {
		this.doStopSpin(symbolIds);
	}.bind(this), this.options.reelDelay * this.reelIndex);
	return this.stopThenable;
}

ReelView.prototype.doStopSpin = function(symbolIds) {
	this.clearTimeout();

	if (symbolIds.length != this.options.numRows)
		throw new Error("Unexpected number of symbols");

	if (!this.tween)
		this.doStartSpin();

	this.stopping = true;
	this.symbolIds = symbolIds;
}

ReelView.prototype.clearTimeout = function() {
	if (this.timeout) {
		clearTimeout(this.timeout);
		this.timeout = null;
	}
}

ReelView.prototype.getSymbolViewAt = function(rowIndex) {
	for (var i = 0; i < this.symbols.length; i++)
		if (this.symbols[i].getRowIndex() == rowIndex)
			return this.symbols[i];

	return null;
}

ReelView.prototype.createSymbolClip = function(rowIndex, symbolId) {
	var symbolView = new SymbolView(this.options);
	symbolView.setRowIndex(rowIndex);
	symbolView.setReelIndex(this.reelIndex);
	symbolView.setSymbolId(symbolId);
	this.symbols.push(symbolView);
	this.symbolHolder.addChild(symbolView);
}

ReelView.prototype.createSymbolClips = function() {
	for (var i = 0; i < this.symbols.length; i++)
		this.symbolHolder.removeChild(this.symbols[i]);

	this.symbols = [];

	for (var i = 0; i < this.options.numRows; i++)
		this.createSymbolClip(i, this.symbolIds[i]);

	for (var i = 0; i < this.options.numRandomSymbols; i++)
		this.createSymbolClip(this.options.numRows + i, this.randomSymbols[i]);

	for (var i = 0; i < this.options.numRows; i++)
		this.createSymbolClip(this.options.numRandomSymbols + this.options.numRows + i, this.symbolIds[i]);
}

ReelView.prototype.clearPosition = function() {
	if (this.tween) {
		this.tween.onComplete = null;
		this.tween.stop();
		this.tween = null;
	}

	this.reelOffset = 0;
	this.updateSymbolHolderPosition();
}

ReelView.prototype.getReelClipHeight = function() {
	var numSymbols = this.options.numRows + this.options.numRandomSymbols;

	return this.options.rowSpacing * numSymbols;
}

ReelView.prototype.updateSymbolHolderPosition = function() {
	var reelClipHeight = this.getReelClipHeight();
	this.symbolHolder.y = this.reelOffset % reelClipHeight;

	while (this.symbolHolder.y > 0)
		this.symbolHolder.y -= reelClipHeight;
}

ReelView.prototype.startSpin = function() {
	this.clearTimeout();
	this.stopping = false;

	this.timeout = setTimeout(function() {
		this.doStartSpin();
	}.bind(this), this.options.reelDelay * this.reelIndex);
}

ReelView.prototype.doStartSpin = function() {
	this.clearTimeout();
	this.clearPosition();

	this.tween = new TWEEN.Tween(this);
	this.tween.to({
		reelOffset: this.getReelClipHeight() / 2
	}, 1000);
	this.tween.easing(TWEEN.Easing.Back.In);
	this.tween.onUpdate(function() {
		this.updateSymbolHolderPosition();
	}.bind(this));
	this.tween.onComplete(this.playSpinTween.bind(this));
	this.tween.start();
}

ReelView.prototype.playSpinTween = function() {
	this.reelOffset = -this.getReelClipHeight() / 2;
	this.updateSymbolHolderPosition();

	if (this.stopping) {
		this.createSymbolClips();
		this.tween = new TWEEN.Tween(this);
		this.tween.to({
			reelOffset: 0
		}, 1000);
		this.tween.easing(TWEEN.Easing.Elastic.Out);
		this.tween.onUpdate(function() {
			this.updateSymbolHolderPosition();
		}.bind(this));
		this.tween.onComplete(function() {
			this.tween = null;
			this.stopThenable.resolve()
		}.bind(this));
		this.tween.start();
	} else {
		this.tween = new TWEEN.Tween(this);
		this.tween.to({
			reelOffset: this.getReelClipHeight() / 2
		}, 350);
		this.tween.onUpdate(function() {
			this.updateSymbolHolderPosition();
		}.bind(this));
		this.tween.onComplete(this.playSpinTween.bind(this));
		this.tween.start();
	}
}
},{"../utils/PixiUtil":15,"./SymbolView":29,"inherits":1,"tinp":6,"tween.js":7}],29:[function(require,module,exports){
var inherits = require("inherits");
var TWEEN = require("tween.js");
var Thenable = require("tinp");
var UrlUtil = require("../utils/UrlUtil");
var GridSheet = require("../utils/GridSheet");

function SymbolView(options) {
    PIXI.Container.call(this);

    this.options = options;

    if (!this.options.symbols)
        throw new Error("No symbols");

    if (!SymbolView.symbolSheet)
        SymbolView.symbolSheet = {};

    if (!SymbolView.symbolSheet[this.options.symbols]) {
        var u = UrlUtil.makeAbsolute(this.options.symbols, this.options.baseUrl);
        var t = PIXI.Texture.fromFrame(u);
        SymbolView.symbolSheet[this.options.symbols] = new GridSheet(t);
    }
}

inherits(SymbolView, PIXI.Container);
module.exports = SymbolView;

SymbolView.getSymbolSheet = function(options) {
    if (!SymbolView.symbolSheet)
        SymbolView.symbolSheet = {};

    if (!SymbolView.symbolSheet[options.symbols]) {
        var u = UrlUtil.makeAbsolute(options.symbols, options.baseUrl);
        var t = PIXI.Texture.fromFrame(u);
        SymbolView.symbolSheet[options.symbols] = new GridSheet(t);
    }

    return SymbolView.symbolSheet[options.symbols]
}

SymbolView.prototype.setSymbolId = function(symbolId) {
    this.symbolId = symbolId;

    var symbol = SymbolView.getSymbolSheet(this.options).createSprite(symbolId);

    symbol.x = -symbol.width / 2;
    symbol.y = -symbol.height / 2;

    this.symbolSprite = new PIXI.Container();
    this.symbolSprite.addChild(symbol);
    this.addChild(this.symbolSprite);
}

SymbolView.prototype.setReelIndex = function(reelIndex) {
    this.reelIndex = reelIndex;
}

SymbolView.prototype.setRowIndex = function(rowIndex) {
    this.rowIndex = rowIndex;
    this.y = rowIndex * this.options.rowSpacing;
}

SymbolView.prototype.getRowIndex = function() {
    return this.rowIndex;
}

SymbolView.generateSymbolFrameId = function(format, id) {
    format = format.replace("#", (id + 1));

    return format;
}

SymbolView.prototype.playBetLineWin = function() {
    var thenable = new Thenable();

    this.tween = new TWEEN.Tween(this.scale);
    this.tween.to({
        x: 1.2,
        y: 1.2
    }, 1000);
    this.tween.easing(TWEEN.Easing.Elastic.InOut);
    this.tween.delay(this.options.reelDelay * this.reelIndex);
    this.tween.start();

    Thenable.delay(2000).then(function() {
        this.scale.x = 1;
        this.scale.y = 1;

        thenable.resolve();
    }.bind(this));

    return thenable;
}
},{"../utils/GridSheet":14,"../utils/UrlUtil":16,"inherits":1,"tinp":6,"tween.js":7}],30:[function(require,module,exports){
var inherits = require("inherits");
var Thenable = require("tinp");
var TWEEN = require("tween.js");
var sprintf = require("sprintf-js").sprintf;

/**
 * @class WinView
 */
function WinView(options) {
	PIXI.Container.call(this);

	this.options = options;

	this.winFieldHolder = new PIXI.Container();
	this.winFieldHolder.x = this.options.winFieldX;
	this.winFieldHolder.y = this.options.winFieldY;
	this.addChild(this.winFieldHolder);

	var style = {
		font: "bold 180px sans",
		dropShadow: true,
		fill: "#fffff0",
		dropShadowColor: "#000000",
		dropShadowDistance: 5,
		dropShadowAngle: Math.PI / 4
	};

	this.winField = new PIXI.Text("<win>", style);
	this.winFieldHolder.addChild(this.winField);
	this.winFieldHolder.visible = false;

	this.winPlate = new PIXI.Graphics();
	this.winPlate.x = this.options.winPlateX;
	this.winPlate.y = this.options.winPlateY;
	this.winPlate.beginFill(0x000000, .5);
	this.winPlate.drawRect(-350, -30, 700, 60);
	this.addChild(this.winPlate);

	var style = {
		font: "bold 48px sans",
		dropShadow: true,
		fill: "#ffffff",
		dropShadowColor: "#000000",
		dropShadowDistance: 2,
		dropShadowAngle: Math.PI / 4
	};

	this.winPlateField = new PIXI.Text("Total win: 123 BTC", style);
	this.winPlateField.x = this.options.winPlateX - this.winPlateField.width / 2;
	this.winPlateField.y = this.options.winPlateY - this.winPlateField.height / 2;
	this.addChild(this.winPlateField);
	this.winPlate.visible = false;
	this.winPlateField.visible = false;
}

inherits(WinView, PIXI.Container);
module.exports = WinView;

/**
 * Show a win amount.
 * @method showWin
 */
WinView.prototype.showWin = function(amount) {
	var thenable = new Thenable();

	this.winField.text = amount;
	this.winField.x = -this.winField.width / 2;
	this.winField.y = -this.winField.height / 2;

	this.winFieldHolder.visible = true;

	this.winFieldHolder.scale.x = 0;
	this.winFieldHolder.scale.y = 0;

	var tween = new TWEEN.Tween(this.winFieldHolder.scale);
	tween.easing(TWEEN.Easing.Cubic.Out);
	tween.onComplete(function() {
		setTimeout(function() {
			thenable.resolve();
			this.winFieldHolder.visible = false;
		}.bind(this), 1500);
	}.bind(this));
	tween.to({
		x: 1,
		y: 1
	}, 500);
	tween.start();

	return thenable;
}

/**
 * Reset accumulated win view.
 * @method resetAccumulatedWin
 */
WinView.prototype.resetAccumulatedWin = function() {
	this.winPlate.visible = false;
	this.winPlateField.visible = false;
	this.countValue = 0;

	if (this.countInterval) {
		clearInterval(this.countInterval);
		this.countInterval = null;
	}
}

/**
 * Show accumulated win.
 * @method showAccumulatedWin
 */
WinView.prototype.showAccumulatedWin = function(amount) {
	if (this.countInterval)
		clearInterval(this.countInterval);

	this.winPlate.visible = true;
	this.winPlateField.visible = true;

	this.countTargetValue = amount;
	this.countInterval = setInterval(this.updateWinCount.bind(this), 50);
	this.countStartTime = Date.now();
	this.countTargetTime = this.countStartTime + 1000;
	this.countStartValue = this.countValue;

	this.updateWinCount();
}

/**
 * Update win count
 * @method updateWinCount
 * @private
 */
WinView.prototype.updateWinCount = function() {
	var now = Date.now();
	var frac = (now - this.countStartTime) / (this.countTargetTime - this.countStartTime);

	if (frac > 1) {
		frac = 1;
		clearInterval(this.countInterval);
		this.countInterval = null;
	}

	var v = this.countStartValue + frac * (this.countTargetValue - this.countStartValue);
	this.countValue = v;

	this.winPlateField.text = "Total win: " + Math.round(v);
	this.winPlateField.x = this.options.winPlateX - this.winPlateField.width / 2;
}
},{"inherits":1,"sprintf-js":5,"tinp":6,"tween.js":7}]},{},[9]);
