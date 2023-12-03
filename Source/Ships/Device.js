"use strict";
class Device {
    constructor(defn) {
        this._defn = defn;
    }
    static ofEntity(entity) {
        return entity.propertyByName(Device.name);
    }
    defn() {
        return this._defn;
    }
    toEntity() {
        var defn = this.defn();
        return new Entity(Device.name + defn.name, [this]);
    }
    updateForRound(uwpe) {
        var defn = this.defn();
        defn.updateForRound(uwpe);
    }
    use(uwpe) {
        uwpe.entity2 = this.toEntity();
        var defn = this.defn();
        defn.use(uwpe);
    }
    // EntityProperty.
    finalize(uwpe) { }
    updateForTimerTick(uwpe) { }
    initialize(uwpe) { }
    // Clonable.
    clone() {
        return this; // todo
    }
    // Equatable.
    equals(other) { return false; } // todo
}
