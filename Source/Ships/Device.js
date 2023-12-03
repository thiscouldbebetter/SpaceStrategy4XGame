"use strict";
class Device {
    constructor(defn) {
        this._defn = defn;
    }
    static ofEntity(entity) {
        return entity.propertyByName(Device.name);
    }
    defn(world) {
        return this._defn;
    }
    toEntity(uwpe) {
        var defn = this.defn(uwpe.world);
        return new Entity(Device.name + defn.name, [this]);
    }
    updateForRound(uwpe) {
        var defn = this.defn(uwpe.world);
        defn.updateForRound(uwpe);
    }
    use(uwpe) {
        uwpe.entity2 = this.toEntity(uwpe);
        var defn = this.defn(uwpe.world);
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
