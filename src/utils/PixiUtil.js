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