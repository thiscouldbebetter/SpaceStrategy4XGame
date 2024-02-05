"use strict";
class Order //
 {
    constructor() {
        this.clear();
    }
    clear() {
        this.defn = OrderDefn.Instances().DoNothing;
        this.entityBeingOrdered = null;
        this.deviceToUse = null;
        this.entityBeingTargeted = null;
        this.isComplete = false;
        return this;
    }
    complete() {
        this.isComplete = true;
        return this;
    }
    defnSet(value) {
        this.defn = value;
        return this;
    }
    deviceToUseSet(value) {
        this.deviceToUse = value;
        return this;
    }
    entityBeingOrderedSet(value) {
        this.entityBeingOrdered = value;
        return this;
    }
    entityBeingTargetedSet(value) {
        this.entityBeingTargeted = value;
        return this;
    }
    isAwaitingTarget() {
        return (this.entityBeingTargeted == null);
    }
    obey(uwpe) {
        var entityBeingOrdered = this.entityBeingOrdered;
        uwpe.entitySet(entityBeingOrdered);
        this.defn.obey(uwpe);
    }
    toStringDescription() {
        return this.defn.description + " " + this.entityBeingTargeted.name;
    }
}
class Orderable {
    static fromEntity(entity) {
        return entity.propertyByName(Orderable.name);
    }
    order(entityOrderable) {
        if (this._order == null) {
            this._order = new Order().entityBeingOrderedSet(entityOrderable);
        }
        return this._order;
    }
    orderSet(value) {
        this._order = value;
    }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
    // Equatable.
    equals(other) { return false; }
}
