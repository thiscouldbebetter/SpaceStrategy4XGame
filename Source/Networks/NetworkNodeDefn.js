"use strict";
class NetworkNodeDefn {
    constructor(name, colorName) {
        this.name = name;
        this.colorName = colorName;
    }
    static Instances() {
        if (NetworkNodeDefn._instances == null) {
            NetworkNodeDefn._instances = new NetworkNodeDefn_Instances();
        }
        return NetworkNodeDefn._instances;
    }
}
class NetworkNodeDefn_Instances {
    constructor() {
        this.Blue = new NetworkNodeDefn("Blue", "GrayLight");
        this.Green = new NetworkNodeDefn("Green", "GrayLight");
        this.Red = new NetworkNodeDefn("Red", "GrayLight");
        this._All =
            [
                this.Blue,
                this.Green,
                this.Red,
            ];
    }
}
