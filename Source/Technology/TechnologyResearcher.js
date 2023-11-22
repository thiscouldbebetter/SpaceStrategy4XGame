"use strict";
class TechnologyResearcher {
    constructor(factionName, nameOfTechnologyBeingResearched, researchAccumulated, namesOfTechnologiesKnown) {
        this.factionName = factionName;
        this.nameOfTechnologyBeingResearched = nameOfTechnologyBeingResearched;
        this.researchAccumulated = researchAccumulated;
        this.namesOfTechnologiesKnown = namesOfTechnologiesKnown;
        this.name = this.factionName + " Research";
    }
    static default() {
        return new TechnologyResearcher("[factionName]", null, // nameOfTechnologyBeingResearched
        0, // researchAccumulated
        []);
    }
    buildablesAvailable(world) {
        var returnValues = [];
        var technologiesByName = world.technologyGraph.technologiesByName;
        for (var i = 0; i < this.namesOfTechnologiesKnown.length; i++) {
            var technologyName = this.namesOfTechnologiesKnown[i];
            var technology = technologiesByName.get(technologyName);
            var technologyBuildables = technology.buildablesEnabled(world);
            returnValues.push(...technologyBuildables);
        }
        return returnValues;
    }
    faction(world) {
        return world.factionByName(this.factionName);
    }
    researchAccumulatedIncrement(world, faction, amountToIncrement) {
        var technologyBeingResearched = this.technologyBeingResearched(world);
        if (technologyBeingResearched == null) {
            if (amountToIncrement > 0) {
                var notification = new Notification2("Default", world.roundsSoFar, "Nothing being researched.", "research" // locus
                );
                faction.notificationSession.notifications.push(notification);
            }
        }
        else {
            this.researchAccumulated += amountToIncrement;
            var researchRequired = technologyBeingResearched.researchRequired;
            if (this.researchAccumulated >= researchRequired) {
                this.namesOfTechnologiesKnown.push(this.nameOfTechnologyBeingResearched);
                this.nameOfTechnologyBeingResearched = null;
                this.researchAccumulated = 0;
            }
        }
    }
    researchPerTurn(universe, world) {
        var faction = this.faction(world);
        var returnValue = faction.researchPerTurn(universe, world);
        return returnValue;
    }
    strategicValue(world) {
        var returnValue = 0;
        var technologiesKnown = this.technologiesKnown(world);
        for (var i = 0; i < technologiesKnown.length; i++) {
            var tech = technologiesKnown[i];
            returnValue += tech.strategicValue(world);
        }
        return returnValue;
    }
    technologiesAvailableForResearch(world) {
        var technologyGraph = world.technologyGraph;
        var technologiesAll = technologyGraph.technologies;
        var returnValues = technologiesAll.filter(x => this.technologyIsAvailableForResearch(x));
        return returnValues;
    }
    technologiesKnown(world) {
        var returnValues = [];
        for (var i = 0; i < this.namesOfTechnologiesKnown.length; i++) {
            var techName = this.namesOfTechnologiesKnown[i];
            var technology = world.technologyGraph.technologyByName(techName);
            returnValues.push(technology);
        }
        return returnValues;
    }
    technologyBeingResearched(world) {
        var technologyGraph = world.technologyGraph;
        var returnValue = technologyGraph.technologyByName(this.nameOfTechnologyBeingResearched);
        return returnValue;
    }
    technologyIsAvailableForResearch(technologyToCheck) {
        var returnValue = false;
        var technologyToCheckName = technologyToCheck.name;
        var isAlreadyKnown = (this.namesOfTechnologiesKnown.indexOf(technologyToCheckName) >= 0);
        if (isAlreadyKnown == false) {
            var prerequisites = technologyToCheck.namesOfPrerequisiteTechnologies;
            var areAllPrerequisitesKnownSoFar = true;
            for (var p = 0; p < prerequisites.length; p++) {
                var prerequisite = prerequisites[p];
                var isPrerequisiteKnown = (this.namesOfTechnologiesKnown.indexOf(prerequisite) >= 0);
                if (isPrerequisiteKnown == false) {
                    areAllPrerequisitesKnownSoFar = false;
                    break;
                }
            }
            if (areAllPrerequisitesKnownSoFar) {
                returnValue = true;
            }
        }
        return returnValue;
    }
    technologyIsKnown(technologyToCheck) {
        var technologyToCheckName = technologyToCheck.name;
        var isKnown = this.namesOfTechnologiesKnown.some(x => x == technologyToCheckName);
        return isKnown;
    }
    technologyResearch(technologyToResearch) {
        var isAvailable = this.technologyIsAvailableForResearch(technologyToResearch);
        if (isAvailable) {
            this.nameOfTechnologyBeingResearched = technologyToResearch.name;
        }
        else {
            throw Error("Technology not available for research!");
        }
    }
    // turns
    updateForTurn(universe, world, faction) {
        var researchThisTurn = this.researchPerTurn(universe, world);
        this.researchAccumulatedIncrement(world, faction, researchThisTurn);
    }
}
