"use strict";
class Layout {
    constructor(sizeInPixels, map) {
        this.sizeInPixels = sizeInPixels;
        this.map = map;
    }
    // instance methods
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
        var buildables = this.map.bodies;
        buildables.push(buildableEntityToBuild);
    }
    buildableEntityInProgress() {
        return this.map.bodies.find(x => Buildable.fromEntity(x).isComplete == false);
    }
    buildableEntityRemove(buildableEntityToRemove) {
        var bodies = this.map.bodies;
        bodies.splice(bodies.indexOf(buildableEntityToRemove), 1);
    }
    // turnable
    facilities() {
        return this.map.bodies;
    }
    initialize(universe) {
        // todo
    }
    updateForTurn(universe, world, faction, parentModel) {
        // todo
    }
    // drawable
    draw(universe, display) {
        display.drawBackground(null, null);
        this.map.draw(universe, display);
    }
}
