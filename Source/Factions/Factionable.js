"use strict";
class Factionable extends EntityPropertyBase {
    constructor(faction) {
        super();
        this._faction = faction;
    }
    static ofEntity(entity) {
        return entity.propertyByName(Factionable.name);
    }
    faction() {
        return this._faction;
    }
    factionName() {
        var faction = this.faction();
        return (faction == null ? "[none]" : faction.name);
    }
    factionSet(faction) {
        this._faction = faction;
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
    initialize(uwpe) {
        // Do nothing;
    }
    propertyName() { return Factionable.name; }
    updateForTimerTick(uwpe) {
        // Do nothing.
    }
    // Equatable
    equals(other) {
        return this.faction == other.faction;
    }
}
