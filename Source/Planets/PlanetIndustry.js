"use strict";
class PlanetIndustry {
    toStringDescription(universe, world, planet) {
        var buildableEntityInProgress = planet.buildableEntityInProgress(universe);
        var buildableString = "building ";
        if (buildableEntityInProgress == null) {
            buildableString += "nothing";
        }
        else {
            var buildableInProgress = Buildable.fromEntity(buildableEntityInProgress);
            var buildableDefn = buildableInProgress.defn(world);
            var resourcesToBuild = buildableDefn.resourcesToBuild;
            var resourcesAccumulatedOverNeeded = planet.resourcesAccumulated + "/" + resourcesToBuild;
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
            var notification = new Notification2("Default", world.turnsSoFar, "Nothing being built.", planet);
            faction.notificationSession.notificationAdd(notification);
        }
        else {
            var buildableInProgress = Buildable.fromEntity(buildableEntityInProgress);
            var buildableDefn = buildableInProgress.defn(world);
            var resourcesToBuild = buildableDefn.resourcesToBuild;
            if (Resource.isSupersetOf(resourcesAccumulated, resourcesToBuild)) {
                Resource.subtract(resourcesAccumulated, resourcesToBuild);
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
