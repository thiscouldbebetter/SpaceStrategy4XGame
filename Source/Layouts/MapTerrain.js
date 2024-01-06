"use strict";
class MapTerrain {
    constructor(name, codeChar, description, visual) {
        this.name = name;
        this.codeChar = codeChar;
        this.description = description;
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
    isSurface() {
        return MapTerrain.Instances(null).isTerrainSurface(this);
    }
}
class MapTerrain_Instances {
    constructor(cellSizeInPixels) {
        var visualFromColor = (color) => VisualRectangle.fromSizeAndColorBorder(cellSizeInPixels.clone().half(), color);
        var colors = Color.Instances();
        var mt = (name, codeChar, description, color) => new MapTerrain(name, codeChar, description, visualFromColor(color));
        this.None = mt("None", " ", "No terrain present.", colors._Transparent);
        this.Orbit = mt("Orbital", "-", "Allows only orbital structures.", colors.Violet);
        this.Ship = mt("Ship", "#", "A ship.", colors.Violet);
        this.SurfaceDefault = mt("Normal", ".", "Ordinary usable land.", colors.White);
        this.SurfaceIndustry = mt("Mineral", "r", "Grants industry bonus.", colors.Red);
        this.SurfaceProsperity = mt("Healthy", "p", "Grants prosperity bonus.", colors.Green);
        this.SurfaceResearch = mt("Interesting", "b", "Grants research bonus.", colors.Blue);
        this.SurfaceUnusable = mt("Hostile", "k", "Most structures cannot be built.", colors.GrayDarker);
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
    isTerrainSurface(terrainToCheck) {
        return (this._Surface.indexOf(terrainToCheck) >= 0);
    }
}
