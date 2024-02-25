"use strict";
class StarClusterNodeDefn {
    constructor(name, colorName) {
        this.name = name;
        this.colorName = colorName;
    }
    static Instances() {
        if (StarClusterNodeDefn._instances == null) {
            StarClusterNodeDefn._instances = new StarClusterNodeDefn_Instances();
        }
        return StarClusterNodeDefn._instances;
    }
}
class StarClusterNodeDefn_Instances {
    constructor() {
        this.Blue = new StarClusterNodeDefn("Blue", "GrayLight");
        this.Green = new StarClusterNodeDefn("Green", "GrayLight");
        this.Red = new StarClusterNodeDefn("Red", "GrayLight");
        this._All =
            [
                this.Blue,
                this.Green,
                this.Red,
            ];
    }
}
