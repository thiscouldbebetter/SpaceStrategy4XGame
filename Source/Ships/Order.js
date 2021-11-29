"use strict";
class Order //
 {
    constructor(defnName, targetEntity) {
        this.defnName = defnName;
        this.targetEntity = targetEntity;
        this.isComplete = false;
    }
    defn() {
        return OrderDefn.Instances()._AllByName.get(this.defnName);
    }
    obey(universe, world, place, entity) {
        var orderable = Orderable.fromEntity(entity);
        if (this.isComplete) {
            orderable.order = null;
        }
        else {
            this.defn().obey(universe, world, place, entity);
        }
    }
}
class Orderable {
    static fromEntity(entity) {
        return entity.propertyByName(Orderable.name);
    }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
    // Equatable.
    equals(other) { return false; }
}
