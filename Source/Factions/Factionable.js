"use strict";
class Factionable {
    constructor(factionName) {
        this.factionName = factionName;
    }
    static ofEntity(entity) {
        return entity.propertyByName(Factionable.name);
    }
    faction(world) {
        var factionName = this.factionName;
        var faction = (factionName == null ? null : world.factionByName(factionName));
        return faction;
    }
    factionSet(faction) {
        this.factionName = faction.name;
    }
    factionSetByName(value) {
        this.factionName = value;
    }
    // EntityProperty.
    updateForTimerTick(uwpe) {
        // Do nothing.
    }
    // Clonable.
    clone() {
        return new Factionable(this.factionName);
    }
    overwriteWith(other) {
        this.factionName = other.factionName;
        return this;
    }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) {
        // Do nothing;
    }
    // Equatable
    equals(other) {
        return this.factionName == other.factionName;
    }
}
