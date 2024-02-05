"use strict";
class Device {
    constructor(defn) {
        this._defn = defn;
        this.usesRemainingThisRoundReset();
    }
    static ofEntity(entity) {
        return entity.propertyByName(Device.name);
    }
    canBeUsedThisRoundByDeviceUser(deviceUser) {
        var defn = this.defn();
        var returnValue = this.usesRemainingThisRound > 0
            && deviceUser.energyRemainsThisRound(defn.energyPerUse);
        return returnValue;
    }
    defn() {
        return this._defn;
    }
    nameAndUsesRemainingThisRound() {
        var name = this.defn().name;
        var returnValue = name + " (" + this.usesRemainingThisRound + ")";
        return returnValue;
    }
    toEntity() {
        var defn = this.defn();
        return new Entity(Device.name + defn.name, [this]);
    }
    updateForRound(uwpe) {
        var defn = this.defn();
        defn.updateForRound(uwpe);
        this.usesRemainingThisRoundReset();
    }
    use(uwpe) {
        var deviceUser = DeviceUser.ofEntity(uwpe.entity);
        if (this.canBeUsedThisRoundByDeviceUser(deviceUser)) {
            this.usesRemainingThisRound--;
            var defn = this.defn();
            deviceUser.energyRemainingThisRoundSubtract(defn.energyPerUse);
            uwpe.entity2 = this.toEntity();
            defn.use(uwpe);
        }
    }
    usesRemainingThisRoundReset() {
        var defn = this.defn();
        this.usesRemainingThisRound = defn.usesPerRound;
    }
    // EntityProperty.
    finalize(uwpe) { }
    updateForTimerTick(uwpe) { }
    initialize(uwpe) { }
    // Clonable.
    clone() {
        throw new Error("Not yet implemented.");
    }
    overwriteWith(other) {
        throw new Error("Not yet implemented.");
    }
    // Equatable.
    equals(other) { return false; } // todo
}
