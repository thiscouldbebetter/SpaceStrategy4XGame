"use strict";
class Device extends Item {
    constructor(defn) {
        super(defn.name, 1);
        this._deviceDefn = defn;
    }
    static fromEntity(deviceAsEntity) {
        return deviceAsEntity.propertyByName(Device.name);
    }
    deviceDefn(world) {
        return this._deviceDefn;
    }
    updateForTurn(uwpe) {
        var defn = this.deviceDefn(uwpe.world);
        defn.updateForTurn(uwpe);
    }
    use(uwpe) {
        uwpe.entity2 = this.toEntity(uwpe);
        var defn = this.deviceDefn(uwpe.world);
        defn.use(uwpe);
    }
}
