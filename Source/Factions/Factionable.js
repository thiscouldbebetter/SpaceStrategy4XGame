"use strict";
class Factionable {
    constructor(faction) {
        this._faction = faction;
    }
    static ofEntity(entity) {
        return entity.propertyByName(Factionable.name);
    }
    faction() {
        return this._faction;
    }
    factionSet(faction) {
        this._faction = faction;
    }
    // EntityProperty.
    updateForTimerTick(uwpe) {
        // Do nothing.
    }
    // Clonable.
    clone() {
        return new Factionable(this.faction());
    }
    overwriteWith(other) {
        this.faction = other.faction;
        return this;
    }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) {
        // Do nothing;
    }
    // Equatable
    equals(other) {
        return this.faction == other.faction;
    }
}
