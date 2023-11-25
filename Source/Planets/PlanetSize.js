"use strict";
class PlanetSize {
    constructor(name, radiusInPixels, surfaceSizeInCells) {
        this.name = name;
        this.radiusInPixels = radiusInPixels;
        this.surfaceSizeInCells = surfaceSizeInCells;
    }
    static byName(name) {
        return PlanetSize.Instances().byName(name);
    }
    static Instances() {
        if (PlanetSize._instances == null) {
            PlanetSize._instances = new PlanetSize_Instances();
        }
        return PlanetSize._instances;
    }
    populationMax() {
        return this.surfaceSizeInCells.x * this.surfaceSizeInCells.y;
    }
}
class PlanetSize_Instances {
    constructor() {
        var ps = (name, dimension) => {
            var radiusInPixels = Math.floor(4 * Math.sqrt(dimension));
            var surfaceSizeInCells = Coords.fromXY(1, 1).multiplyScalar(dimension);
            return new PlanetSize(name, radiusInPixels, surfaceSizeInCells);
        };
        this.Tiny = ps("Tiny", 3);
        this.Small = ps("Small", 4);
        this.Medium = ps("Medium", 5);
        this.Large = ps("Large", 6);
        this.Giant = ps("Giant", 7);
        this.Default = this.Medium;
        this._All =
            [
                this.Default,
                this.Tiny,
                this.Small,
                this.Medium,
                this.Large,
                this.Giant
            ];
    }
    byName(name) {
        return this._All.find(x => x.name == name);
    }
}
