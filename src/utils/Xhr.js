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