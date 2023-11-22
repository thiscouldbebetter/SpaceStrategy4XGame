"use strict";
class MapTerrain {
    constructor(name, codeChar, visual) {
        this.name = name;
        this.codeChar = codeChar;
        this.visual = visual;
    }
    static Instances(cellSizeInPixels) {
        if (MapTerrain._instances == null) {
            MapTerrain._instances = new MapTerrain_Instances(cellSizeInPixels);
        }
        return MapTerrain._instances;
    }
    static planet(cellSizeInPixels) {
        return MapTerrain.Instances(cellSizeInPixels)._Planet;
    }
}
class MapTerrain_Instances {
    constructor(cellSizeInPixels) {
        var visualFromColor = (color) => VisualRectangle.fromSizeAndColorBorder(cellSizeInPixels.clone().half(), color);
        var colors = Color.Instances();
        var mt = (name, codeChar, color) => new MapTerrain(name, codeChar, visualFromColor(color));
        this.None = mt("None", " ", colors._Transparent);
        this.Orbit = mt("Orbit", "-", colors.Violet);
        this.Ship = mt("Ship", "#", colors.Violet);
        this.SurfaceDefault = mt("White", ".", colors.White);
        this.SurfaceIndustry = mt("Red", "r", colors.Red);
        this.SurfaceProsperity = mt("Green", "p", colors.Green);
        this.SurfaceResearch = mt("Blue", "b", colors.Blue);
        this.SurfaceUnusable = mt("Black", "k", colors.GrayDark);
        this._Planet =
            [
                this.None,
                this.Orbit,
                this.SurfaceDefault,
                this.SurfaceIndustry,
                this.SurfaceProsperity,
                this.SurfaceResearch,
                this.SurfaceUnusable
            ];
        this._Surface =
            [
                this.SurfaceDefault,
                this.SurfaceIndustry,
                this.SurfaceProsperity,
                this.SurfaceResearch,
                this.SurfaceUnusable
            ];
        this._All =
            [
                this.None,
                this.Orbit,
                this.Ship,
                this.SurfaceDefault,
                this.SurfaceIndustry,
                this.SurfaceProsperity,
                this.SurfaceResearch,
                this.SurfaceUnusable
            ];
    }
}
