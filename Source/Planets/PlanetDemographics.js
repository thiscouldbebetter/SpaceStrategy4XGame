"use strict";
class PlanetDemographics {
    constructor(population) {
        this.population = population;
    }
    notificationsForRoundAddToArray(notificationsSoFar) {
        return notificationsSoFar; // todo
    }
    populationIdle(universe, planet) {
        var populationCurrent = this.population;
        var populationOccupied = this.populationOccupied(universe, planet);
        var populationIdle = populationCurrent - populationOccupied;
        return populationIdle;
    }
    populationAdd(universe, planet, amountToAdd) {
        var populationIdleBefore = this.populationIdle(universe, planet);
        this.population += amountToAdd;
        var populationIdleAfter = this.populationIdle(universe, planet);
        var populationIdleNet = populationIdleAfter - populationIdleBefore;
        if (populationIdleNet == 1) {
            var buildableInProgress = planet.buildableInProgress(universe);
            if (buildableInProgress == null) {
                var notification = new Notification2("Planet " + planet.name + " now has free population.", () => planet.jumpTo(universe));
                var faction = universe.world.factionCurrent();
                faction.notificationAdd(notification);
            }
        }
        return this.population;
    }
    populationOccupied(universe, planet) {
        var layout = planet.layout(universe);
        var facilities = layout.facilities();
        var facilitiesAutomated = facilities.filter(x => Buildable.ofEntity(x).isAutomated);
        var returnValue = facilities.length - facilitiesAutomated.length;
        return returnValue;
    }
    prosperityAccumulated(planet) {
        var resourcesAccumulated = planet.resourcesAccumulated;
        var prosperityAccumulated = resourcesAccumulated.find(x => x.defnName == "Prosperity");
        return prosperityAccumulated;
    }
    prosperityNeededToGrow() {
        return this.population * 30;
    }
    toStringDescription() {
        return "Population " + this.population;
    }
    updateForRound(universe, world, faction, planet) {
        var prosperityAccumulated = this.prosperityAccumulated(planet);
        var prosperityThisRoundNet = planet.prosperityThisRound(universe, world, faction);
        prosperityAccumulated.addQuantity(prosperityThisRoundNet);
        var quantityToGrow = this.prosperityNeededToGrow();
        if (prosperityAccumulated.quantity >= quantityToGrow) {
            prosperityAccumulated.clear();
            planet.populationIncrement(universe);
        }
    }
}
