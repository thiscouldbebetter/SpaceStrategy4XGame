"use strict";
class PlanetDemographics {
    constructor(population) {
        this.population = population;
    }
    prosperityNeededToGrow() {
        return this.population * 30;
    }
    toStringDescription() {
        return "Population " + this.population;
    }
    updateForRound(universe, world, faction, planet) {
        var resourcesAccumulated = planet.resourcesAccumulated;
        var prosperityAccumulated = resourcesAccumulated.find(x => x.defnName == "Prosperity");
        var prosperityThisTurnNet = planet.prosperityPerTurn(universe, world, faction);
        prosperityAccumulated.addQuantity(prosperityThisTurnNet);
        var quantityToGrow = this.prosperityNeededToGrow();
        if (prosperityAccumulated.quantity >= quantityToGrow) {
            prosperityAccumulated.clear();
        }
    }
}
