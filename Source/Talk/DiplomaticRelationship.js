"use strict";
class DiplomaticRelationship {
    constructor(factionNameOther, state) {
        this.factionNameOther = factionNameOther;
        this.state = state;
    }
    // static methods
    static initializeForFactions(factions) {
        var statePeace = DiplomaticRelationship.States().Peace;
        for (var f = 0; f < factions.length; f++) {
            var factionThis = factions[f];
            for (var g = 0; g < f; g++) {
                var factionOther = factions[g];
                factionThis.relationships.push(new DiplomaticRelationship(factionOther.name, statePeace));
                factionOther.relationships.push(new DiplomaticRelationship(factionThis.name, statePeace));
            }
        }
        for (var f = 0; f < factions.length; f++) {
            var faction = factions[f];
            ArrayHelper.addLookups(faction.relationships, x => x.factionNameOther);
        }
    }
    static setStateForFactions(factions, state) {
        for (var i = 0; i < factions.length; i++) {
            var faction = factions[i];
            var factionOther = factions[1 - i];
            faction.relationshipsByFactionName.get(factionOther.name).state = state;
        }
        return state;
    }
    static strengthOfFactions(world, factions) {
        var returnValue = 0;
        for (var i = 0; i < factions.length; i++) {
            var faction = factions[i];
            returnValue += faction.strength(world);
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
