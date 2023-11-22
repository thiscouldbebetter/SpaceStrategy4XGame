"use strict";
class PlanetIndustry {
    planetIndustryAccumulatedClear(planet) {
        planet.resourcesAccumulated.find(x => x.defnName == "Industry").quantity = 0;
    }
    planetIndustryAccumulated(planet) {
        return planet.resourcesAccumulated.find(x => x.defnName == "Industry").quantity;
    }
    toStringDescription(universe, world, planet) {
        var buildableEntityInProgress = planet.buildableEntityInProgress(universe);
        var buildableString = "building ";
        if (buildableEntityInProgress == null) {
            buildableString += "nothing";
        }
        else {
            var buildableInProgress = Buildable.fromEntity(buildableEntityInProgress);
            var buildableDefn = buildableInProgress.defn(world);
            var industryToBuild = buildableDefn.industryToBuild;
            var industryAccumulated = this.planetIndustryAccumulated(planet);
            var resourcesAccumulatedOverNeeded = industryAccumulated + "/" + industryToBuild;
            buildableString +=
                buildableDefn.name
                    + "(" + resourcesAccumulatedOverNeeded + ")";
        }
        var returnValue = buildableString;
        return returnValue;
    }
    updateForTurn(universe, world, faction, planet) {
        var resourcesAccumulated = planet.resourcesAccumulated;
        var resourcesProduced = planet.resourcesPerTurn(universe, world);
        Resource.add(resourcesAccumulated, resourcesProduced);
        var buildableEntityInProgress = planet.buildableEntityInProgress(universe);
        if (buildableEntityInProgress == null) {
            var notification = new Notification2("Default", world.roundsSoFar, "Nothing being built.", planet);
            faction.notificationSession.notificationAdd(notification);
        }
        else {
            var buildableInProgress = Buildable.fromEntity(buildableEntityInProgress);
            var buildableDefn = buildableInProgress.defn(world);
            var industryAccumulated = planet.industryAccumulated();
            var industryToBuild = buildableDefn.industryToBuild;
            if (industryAccumulated >= industryToBuild) {
                this.planetIndustryAccumulatedClear(planet);
                buildableInProgress.isComplete = true;
                buildableInProgress._visual = null;
                var buildableAsItem = buildableEntityInProgress.item();
                if (buildableAsItem != null) {
                    planet.itemHolder().itemAdd(buildableAsItem);
                }
            }
        }
    }
}
