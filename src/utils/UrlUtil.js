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
