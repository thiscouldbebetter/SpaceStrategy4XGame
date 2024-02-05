"use strict";
class DiplomaticRelationship {
    constructor(factionOther, state) {
        this._factionOther = factionOther;
        this.state = state || DiplomaticRelationship.States().Uncontacted;
    }
    static fromFactionOther(factionOther) {
        return new DiplomaticRelationship(factionOther, null);
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
        return DiplomaticRelationshipState.Instances();
    }
    // instance methods
    factionOther() {
        return this._factionOther;
    }
    stateIsWar() {
        return (this.state == DiplomaticRelationship.States().War);
    }
    stateSet(value) {
        this.state = value;
    }
    stateSetToAlliance() {
        this.state = DiplomaticRelationship.States().Alliance;
    }
    stateSetToPeace() {
        this.state = DiplomaticRelationship.States().Peace;
    }
    stateSetToWar() {
        this.state = DiplomaticRelationship.States().War;
    }
    toString() {
        var returnValue = this.factionOther().name + ":" + this.state;
        return returnValue;
    }
}
class DiplomaticRelationshipState {
    constructor(name) {
        this.name = name;
    }
    static Instances() {
        if (DiplomaticRelationshipState._instances == null) {
            DiplomaticRelationshipState._instances =
                new DiplomaticRelationshipState_Instances();
        }
        return DiplomaticRelationshipState._instances;
    }
    static byName(name) {
        return DiplomaticRelationshipState.Instances().byName(name);
    }
}
class DiplomaticRelationshipState_Instances {
    constructor() {
        this.Alliance = new DiplomaticRelationshipState("Alliance");
        this.Peace = new DiplomaticRelationshipState("Peace");
        this.Uncontacted = new DiplomaticRelationshipState("Uncontacted");
        this.War = new DiplomaticRelationshipState("War");
        this._All =
            [
                this.Alliance,
                this.Peace,
                this.Uncontacted,
                this.War
            ];
    }
    byName(name) {
        return this._All.find(x => x.name == name);
    }
}
