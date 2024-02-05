"use strict";
class BuildableCategory {
    constructor(name) {
        this.name = name;
    }
    static Instances() {
        if (BuildableCategory._instances == null) {
            BuildableCategory._instances = new BuildableCategory_Instances();
        }
        return BuildableCategory._instances;
    }
}
class BuildableCategory_Instances {
    constructor() {
        var bc = (name) => new BuildableCategory(name);
        this.Orbital = bc("Orbital");
        this.Shield = bc("Shield");
        this.ShipDrive = bc("Ship Drive");
        this.ShipGenerator = bc("Ship Generator");
        this.ShipItem = bc("Ship Item");
        this.ShipSensor = bc("Ship Sensor");
        this.ShipShield = bc("Ship Shield");
        this.ShipStarlaneDrive = bc("Ship Starlane Drive");
        this.ShipWeapon = bc("Ship Weapon");
    }
}
