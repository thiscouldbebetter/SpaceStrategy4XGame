"use strict";
class PlanetEnvironment {
    constructor(name, color, relativeProportionsOfCellsWithColorsWRGBK) {
        this.name = name;
        this.color = color;
        this.relativeProportionsOfCellsWithColorsWRGBK = relativeProportionsOfCellsWithColorsWRGBK;
    }
    static byName(name) {
        return PlanetEnvironment.Instances().byName(name);
    }
    static Instances() {
        if (PlanetEnvironment._instances == null) {
            PlanetEnvironment._instances = new PlanetEnvironment_Instances();
        }
        return PlanetEnvironment._instances;
    }
    terrainsToWeightedDistribution(terrains) {
        var proportionsWRGBK = this.relativeProportionsOfCellsWithColorsWRGBK;
        var distribution = new WeightedDistribution([
            new Weighted(proportionsWRGBK[0], terrains.SurfaceDefault),
            new Weighted(proportionsWRGBK[1], terrains.SurfaceIndustry),
            new Weighted(proportionsWRGBK[2], terrains.SurfaceProsperity),
            new Weighted(proportionsWRGBK[3], terrains.SurfaceResearch),
            new Weighted(proportionsWRGBK[4], terrains.SurfaceUnusable)
        ]);
        return distribution;
    }
}
class PlanetEnvironment_Instances {
    constructor() {
        var pe = (name, color, white, red, green, blue, black) => new PlanetEnvironment(name, color, [white, red, green, blue, black]);
        var colors = Color.Instances();
        // this.Default = pe("Default", colors.Cyan, 1, 0, 0, 0, 0 );
        // 	w, r, g, b, k
        this.Husk = pe("Husk", colors.GrayDark, 0, 0, 0, 0, 100);
        this.Primordial = pe("Primordial", colors.Tan, 44, 2, 2, 2, 50);
        this.Congenial = pe("Congenial", colors.White, 69, 3, 5, 3, 20);
        this.Eden = pe("Eden", colors.Green, 74, 3, 20, 3, 0);
        this.Mineral = pe("Mineral", colors.Pink, 46, 10, 2, 2, 40);
        this.Supermineral = pe("Supermineral", colors.Red, 56, 20, 2, 2, 20);
        this.Chapel = pe("Chapel", colors.Cyan, 46, 2, 2, 10, 40);
        this.Cathedral = pe("Cathedral", colors.Blue, 54, 3, 3, 20, 20);
        this.Special = pe("Special", colors.Gray, 30, 10, 10, 10, 40);
        this.Tycoon = pe("Tycoon", colors.GrayLight, 35, 15, 15, 15, 20);
        this.Cornucopia = pe("Cornucopia", colors.Violet, 0, 33, 33, 33, 0);
        this._All =
            [
                // this.Default,
                this.Husk,
                this.Primordial,
                this.Congenial,
                this.Eden,
                this.Mineral,
                this.Supermineral,
                this.Chapel,
                this.Cathedral,
                this.Special,
                this.Tycoon,
                this.Cornucopia
            ];
    }
    byName(name) {
        return this._All.find(x => x.name == name);
    }
}
