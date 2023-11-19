"use strict";
class PlanetSize {
    constructor(name, sizeInCells) {
        this.name = name;
        this.sizeInCells = sizeInCells;
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
}
class PlanetSize_Instances {
    constructor() {
        var ps = (name, dimension) => new PlanetSize(name, Coords.ones().multiplyScalar(dimension));
        this.Tiny = ps("Tiny", 1);
        this.Small = ps("Small", 2);
        this.Medium = ps("Medium", 3);
        this.Large = ps("Large", 4);
        this.Enormous = ps("Enormous", 5);
        this.Default = this.Medium;
        this._All =
            [
                this.Default,
                this.Tiny,
                this.Small,
                this.Medium,
                this.Large,
                this.Enormous
            ];
    }
    byName(name) {
        return this._All.find(x => x.name == name);
    }
}
