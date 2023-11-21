"use strict";
class MapTerrain {
    constructor(name, codeChar, visual) {
        this.name = name;
        this.codeChar = codeChar;
        this.visual = visual;
    }
    static planet(cellSizeInPixels) {
        var visualFromColor = (color) => VisualRectangle.fromSizeAndColorBorder(cellSizeInPixels.clone().half(), color);
        var colors = Color.Instances();
        var terrains = [
            new MapTerrain("None", " ", visualFromColor(colors._Transparent)),
            new MapTerrain("Orbit", "-", visualFromColor(colors.Violet)),
            new MapTerrain("Surface", ".", visualFromColor(colors.GrayLight)),
        ];
        return terrains;
    }
}
