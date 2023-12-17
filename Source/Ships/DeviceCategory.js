"use strict";
class DeviceCategory {
    constructor(name) {
        this.name = name;
    }
    static Instances() {
        if (DeviceCategory._instances == null) {
            DeviceCategory._instances = new DeviceCategory_Instances();
        }
        return DeviceCategory._instances;
    }
}
class DeviceCategory_Instances {
    constructor() {
        this.Drive = new DeviceCategory("Drive");
        this.Generator = new DeviceCategory("Generator");
        this.Shield = new DeviceCategory("Shield");
        this.Special = new DeviceCategory("Special");
        this.Weapon = new DeviceCategory("Weapon");
        this._All =
            [
                this.Drive,
                this.Generator,
                this.Shield,
                this.Special,
                this.Weapon
            ];
        this._AllByName = ArrayHelper.addLookupsByName(this._All);
    }
}
