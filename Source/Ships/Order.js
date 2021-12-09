"use strict";
class Order //
 {
    constructor(defnName, targetEntity) {
        this.defnName = defnName;
        this.targetEntity = targetEntity;
        this.isComplete = false;
    }
    assignToEntityOrderable(entityOrderable) {
        var orderable = Orderable.fromEntity(entityOrderable);
        orderable.order = this;
        return this;
    }
    clear() {
        // This method seems linked to odd compile-time errors
        // in SystemTests.playFromStart().
        this.defnName = null;
        this.targetEntity = null;
        this.isComplete = false;
        return this;
    }
    complete() {
        this.isComplete = true;
        return this;
    }
    defn() {
        var returnValue = OrderDefn.Instances()._AllByName.get(this.defnName);
        return returnValue;
    }
    defnNameAndTargetEntitySet(defnName, targetEntity) {
        this.defnName = defnName;
        this.targetEntity = targetEntity;
        return this;
    }
    obey(universe, world, place, entity) {
        var orderable = Orderable.fromEntity(entity);
        if (this.isComplete) {
            orderable.order = null;
        }
        else {
            var defn = this.defn();
            defn.obey(universe, world, place, entity);
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
