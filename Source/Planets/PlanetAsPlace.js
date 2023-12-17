"use strict";
class PlanetAsPlace {
    constructor(planet) {
        this.planet = planet;
        this.name = this.planet.name;
    }
    equals(other) {
        return (this.name == other.name);
    }
    camera() { throw new Error("Not implemented!"); }
    defn(world) { throw new Error("Not implemented!"); }
    draw(universe, world, display) { throw new Error("Not implemented!"); }
    drawables() { throw new Error("Not implemented!"); }
    entitiesAll() { throw new Error("Not implemented!"); }
    entitiesByPropertyName(propertyName) { throw new Error("Not implemented!"); }
    entitiesRemove() { throw new Error("Not implemented!"); }
    entitiesToRemoveAdd(entitiesToRemove) { throw new Error("Not implemented!"); }
    entitiesToSpawnAdd(entitiesToSpawn) { throw new Error("Not implemented!"); }
    entitiesSpawn(uwpe) { throw new Error("Not implemented!"); }
    entityById(entityId) { throw new Error("Not implemented!"); }
    entityByName(entityName) { throw new Error("Not implemented!"); }
    entityRemove(entity) { throw new Error("Not implemented!"); }
    entitySpawn(uwpe) { throw new Error("Not implemented!"); }
    entitySpawn2(universe, world, entity) { throw new Error("Not implemented!"); }
    entityToRemoveAdd(entityToRemove) { throw new Error("Not implemented!"); }
    entityToSpawnAdd(entityToSpawn) { throw new Error("Not implemented!"); }
    finalize(uwpe) { throw new Error("Not implemented!"); }
    initialize(uwpe) { throw new Error("Not implemented!"); }
    placeParent(world) { throw new Error("Not implemented!"); }
    placesAncestors(world, placesInAncestry) { throw new Error("Not implemented!"); }
    size() { throw new Error("Not implemented!"); }
    toControl(universe, world) { throw new Error("Not implemented!"); }
    updateForTimerTick(uwpe) { throw new Error("Not implemented!"); }
}
