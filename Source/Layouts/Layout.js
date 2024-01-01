"use strict";
class Layout {
    constructor(sizeInPixels, map) {
        this.sizeInPixels = sizeInPixels;
        this.map = map;
    }
    // instance methods
    buildableDefnStartBuildingAtPos(universe, buildableDefn, posToBuildAt) {
        var buildable = Buildable.fromDefnAndPosIncomplete(buildableDefn, posToBuildAt);
        var world = universe.world;
        var buildableEntity = buildable.toEntity(world);
        this.buildableEntityBuild(buildableEntity);
    }
    buildableEntitiesRemove(buildableEntitiesToRemove) {
        buildableEntitiesToRemove.forEach(x => this.buildableEntityRemove(x));
    }
    buildableEntityBuild(buildableEntityToBuild) {
        var buildableEntityInProgress = this.buildableEntityInProgress();
        if (buildableEntityInProgress != null) {
            if (buildableEntityInProgress != buildableEntityToBuild) {
                this.buildableEntityRemove(buildableEntityInProgress);
            }
        }
        this.map.bodyAdd(buildableEntityToBuild);
    }
    buildableEntityInProgress() {
        return this.map.bodies().find(x => Buildable.ofEntity(x).isComplete == false);
    }
    buildableEntityRemove(buildableEntityToRemove) {
        this.map.bodyRemove(buildableEntityToRemove);
    }
    facilities() {
        return this.map.bodies();
    }
    initialize(universe) {
        // todo
    }
    notificationsForRoundAddToArray(universe, world, faction, planet, notificationsSoFar) {
        return notificationsSoFar; // todo
    }
    updateForRound(universe, world, faction, parentModel) {
        // todo
    }
    // drawable
    draw(universe, display) {
        this.map.draw(universe, display);
    }
}
