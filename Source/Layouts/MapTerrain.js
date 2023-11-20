"use strict";
class MapTerrain {
    constructor(name, codeChar, visual, isBlocked) {
        this.name = name;
        this.codeChar = codeChar;
        this.visual = visual;
        this.isBlocked = isBlocked;
    }
    static planet(cellSizeInPixels) {
        var visualFromColor = (color) => new VisualRectangle(cellSizeInPixels, null, color, null);
        var colors = Color.Instances();
        var terrains = [
            new MapTerrain("None", " ", visualFromColor(colors._Transparent), false // isBlocked
            ),
            new MapTerrain("Orbit", "-", visualFromColor(colors.Violet), false),
            new MapTerrain("Surface", ".", visualFromColor(colors.GrayLight), false),
        ];
        return terrains;
    }
}
