"use strict";
class PlanetIndustry {
    notificationsForRoundAddToArray(universe, world, planet, notificationsSoFar) {
        var buildableEntityInProgress = planet.buildableEntityInProgress(universe);
        if (buildableEntityInProgress == null) {
            var hasIdlePopulation = planet.populationIdleExists(universe);
            if (hasIdlePopulation) {
                var notification = new Notification2("Planet " + planet.name + " has free population, but nothing is being built.", () => planet.jumpTo(universe));
                notificationsSoFar.push(notification);
            }
        }
        return notificationsSoFar;
    }
    planetIndustryAccumulatedClear(planet) {
        this.planetIndustryAccumulated(planet).quantity = 0;
    }
    planetIndustryAccumulated(planet) {
        return planet.resourcesAccumulated.find(x => x.defnName == "Industry");
    }
    toStringDescription(universe, world, planet) {
        var buildableEntityInProgress = planet.buildableEntityInProgress(universe);
        var buildableString = "building ";
        if (buildableEntityInProgress == null) {
            buildableString += "nothing";
        }
        else {
            var buildableInProgress = Buildable.ofEntity(buildableEntityInProgress);
            var buildableDefn = buildableInProgress.defn;
            var industryToBuild = buildableDefn.industryToBuild;
            var industryAccumulated = this.planetIndustryAccumulated(planet).quantity;
            var resourcesAccumulatedOverNeeded = industryAccumulated + "/" + industryToBuild;
            buildableString +=
                buildableDefn.name
                    + "(" + resourcesAccumulatedOverNeeded + ")";
        }
        var returnValue = buildableString;
        return returnValue;
    }
    updateForRound(universe, world, faction, planet) {
        var buildableEntityInProgress = planet.buildableEntityInProgress(universe);
        if (buildableEntityInProgress != null) {
            var industryAccumulated = this.planetIndustryAccumulated(planet);
            var industryProducedQuantity = planet.industryThisRound(universe, world);
            industryAccumulated.addQuantity(industryProducedQuantity);
            var buildableInProgress = Buildable.ofEntity(buildableEntityInProgress);
            var buildableDefn = buildableInProgress.defn;
            var industryToBuild = buildableDefn.industryToBuild;
            if (industryAccumulated.quantity >= industryToBuild) {
                industryAccumulated.clear();
                buildableInProgress.isComplete = true;
                buildableInProgress._visual = null;
                var buildableAsItem = buildableEntityInProgress.item();
                if (buildableAsItem != null) {
                    planet.itemHolder().itemAdd(buildableAsItem);
                }
                var populationIdle = planet.populationIdle(universe);
                var notificationText = "Planet " + planet.name + " is done building " + buildableDefn.name + ", "
                    + (populationIdle > 0 ? "and" : "but")
                    + " has " + populationIdle + " free population.";
                var notification = new Notification2(notificationText, () => planet.jumpTo(universe));
                faction.notificationAdd(notification);
                planet.resourcesThisRoundReset();
            }
        }
    }
}
