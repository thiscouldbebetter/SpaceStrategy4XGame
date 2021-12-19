"use strict";
class DiplomaticRelationship {
    constructor(factionNameOther, state) {
        this.factionNameOther = factionNameOther;
        this.state = state;
    }
    // static methods
    static strengthOfFactions(world, factions) {
        var returnValue = 0;
        for (var i = 0; i < factions.length; i++) {
            var faction = factions[i];
            returnValue += faction.strategicValue(world);
        }
        return returnValue;
    }
    static States() {
        if (DiplomaticRelationship._states == null) {
            DiplomaticRelationship._states = new DiplomaticRelationship_States();
        }
        return DiplomaticRelationship._states;
    }
    // instance methods
    factionOther(world) {
        return world.factionByName(this.factionNameOther);
    }
    toString() {
        var returnValue = this.factionNameOther + ":" + this.state;
        return returnValue;
    }
}
class DiplomaticRelationship_States {
    constructor() {
        this.Alliance = "Alliance";
        this.Peace = "Peace";
        this.War = "War";
    }
}
