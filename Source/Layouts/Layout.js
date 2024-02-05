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
        this.map.entityAdd(buildableEntityToBuild);
    }
    buildableEntityInProgress() {
        return this.map.entities().find(x => Buildable.ofEntity(x).isComplete == false);
    }
    buildableEntityRemove(buildableEntityToRemove) {
        this.map.entityRemove(buildableEntityToRemove);
    }
    facilities() {
        return this.map.entities();
    }
    initialize(universe) {
        // todo
    }
    notificationsForRoundAddToArray(universe, world, faction, planet, notificationsSoFar) {
        return notificationsSoFar; // todo
    }
    shieldsArePresentInOrbit() {
        var entities = this.map.entities();
        var areThereShieldsInOrbit = entities.some(x => {
            var buildable = Buildable.ofEntity(x);
            var defn = buildable.defn;
            var isOrbitalShield = defn.categoryIsOrbital()
                && defn.categoryIsShield();
            return isOrbitalShield;
        });
        return areThereShieldsInOrbit;
    }
    updateForRound(universe, world, faction, parentModel) {
        // todo
    }
    // drawable
    draw(universe, display) {
        this.map.draw(universe, display);
    }
}
