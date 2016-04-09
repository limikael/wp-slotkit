var Thenable = require("tinp");

/**
 * Wrapper for XMLHttpRequest.
 */
function Xhr(url) {
	this.url = url;
	this.responseEncoding = Xhr.NONE;
	this.method = "GET";
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
 * Send.
 */
Xhr.prototype.send = function() {
	if (this.sendThenable || this.request)
		throw new Exception("Already used");

	this.sendThenable = new Thenable();

	this.request = new XMLHttpRequest();
	this.request.onreadystatechange = this.onRequestReadyStateChange.bind(this);
	this.request.open(this.method, this.url, true);
	this.request.send();

	return this.sendThenable;
}

/**
 * Ready state change.
 */
Xhr.prototype.onRequestReadyStateChange = function() {
	if (this.request.readyState != 4)
		return;

	if (this.request.status != 200) {
		this.sendThenable.reject(request.statusText);
		return;
	}

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

	this.sendThenable.resolve(this.response);
}