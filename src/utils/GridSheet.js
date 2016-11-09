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
