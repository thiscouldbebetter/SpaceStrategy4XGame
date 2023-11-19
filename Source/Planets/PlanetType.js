"use strict";
class PlanetType {
    constructor(size, environment) {
        this.size = size;
        this.environment = environment;
    }
    static byName(name) {
        return PlanetType.Instances().byName(name);
    }
    static Instances() {
        if (PlanetType._instances == null) {
            PlanetType._instances = new PlanetType_Instances();
        }
        return PlanetType._instances;
    }
    name() {
        return this.size.name + " " + this.environment.name;
    }
}
class PlanetType_Instances {
    constructor() {
        var pt = (size, environment) => new PlanetType(size, environment);
        var sizes = PlanetSize.Instances();
        var environments = PlanetEnvironment.Instances();
        this.Default = pt(sizes.Medium, environments.Default);
        this._All =
            [
                this.Default,
            ];
    }
    byName(name) {
        return this._All.find(x => x.name() == name);
    }
}
