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
    updateForRound(uwpe) {
        var defn = this.deviceDefn(uwpe.world);
        defn.updateForRound(uwpe);
    }
    use(uwpe) {
        uwpe.entity2 = this.toEntity(uwpe);
        var defn = this.deviceDefn(uwpe.world);
        defn.use(uwpe);
    }
}
