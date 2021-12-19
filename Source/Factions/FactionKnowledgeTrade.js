"use strict";
class FactionKnowledgeTrade_Links {
    constructor(factions, linksToTradeByFaction) {
        this.factions = factions;
        this.linksToTradeByFaction = linksToTradeByFaction;
    }
    execute(world) {
        // todo
    }
    isValid() {
        return this.linksToTradeByFaction.some(x => x == null) == false;
    }
    toStringDescription() {
        var returnValue = "The " + this.factions[0].name
            + " revealed link " + this.linksToTradeByFaction[0].name
            + " to the " + this.factions[1].name
            + " in exchange for " + this.linksToTradeByFaction[1].name;
        return returnValue;
    }
}
class FactionKnowledgeTrade_Starsystems {
    constructor(factions, starsystemsToTradeByFaction) {
        this.factions = factions;
        this.starsystemsToTradeByFaction = starsystemsToTradeByFaction;
    }
    execute(world) {
        // todo
    }
    isValid() {
        return this.starsystemsToTradeByFaction.some(x => x == null) == false;
    }
    toStringDescription() {
        var returnValue = "The " + this.factions[0].name
            + " revealed starsystem " + this.starsystemsToTradeByFaction[0].name
            + " to the " + this.factions[1].name
            + " in exchange for " + this.starsystemsToTradeByFaction[1].name;
        return returnValue;
    }
}
class FactionKnowledgeTrade_Technologies {
    constructor(factions, technologiesToTradeByFaction) {
        this.factions = factions;
        this.technologiesToTradeByFaction = technologiesToTradeByFaction;
    }
    execute(world) {
        // todo
    }
    isValid() {
        return this.technologiesToTradeByFaction.some(x => x == null) == false;
    }
    toStringDescription() {
        var returnValue = "The " + this.factions[0].name
            + " revealed technology " + this.technologiesToTradeByFaction[0].name
            + " to the " + this.factions[1].name
            + " in exchange for " + this.technologiesToTradeByFaction[1].name;
        return returnValue;
    }
}
