"use strict";
class BuildableTests extends TestFixture {
    constructor() {
        super(BuildableTests.name);
    }
    tests() {
        var returnValues = [
            this.fromEntity,
            this.defn,
            this.locatable,
            this.visual,
            this.finalize,
            this.initialize,
            this.updateForTimerTick
        ];
        return returnValues;
    }
    // Setup.
    buildableBuild(universe) {
        var world = universe.world;
        var buildableDefn = world.buildableDefns[0];
        var buildableDefnName = buildableDefn.name;
        return new Buildable(buildableDefnName, Coords.zeroes(), // pos?
        false // isComplete
        );
    }
    universeBuild() {
        var returnValue = new EnvironmentMock().universeBuild();
        return returnValue;
    }
    // Tests.
    fromEntity() {
        var buildable = this.buildableBuild(this.universeBuild());
        var entity = new Entity("[name]", [buildable]);
        var buildableFromEntity = Buildable.fromEntity(entity);
        Assert.isNotNull(buildableFromEntity);
    }
    defn() {
        var universe = this.universeBuild();
        var world = universe.world;
        var buildable = this.buildableBuild(universe);
        var buildableDefn = buildable.defn(world);
        Assert.isNotNull(buildableDefn);
    }
    locatable() {
        var buildable = this.buildableBuild(this.universeBuild());
        var locatable = buildable.locatable();
        Assert.isNotNull(locatable);
    }
    visual() {
        var universe = this.universeBuild();
        var world = universe.world;
        var buildable = this.buildableBuild(universe);
        var visual = buildable.visual(world);
        Assert.isNotNull(visual);
    }
    // EntityProperty.
    finalize() {
        var universe = this.universeBuild();
        var buildable = this.buildableBuild(universe);
        var buildableAsEntity = new Entity("[name]", [buildable]);
        var uwpe = new UniverseWorldPlaceEntities(universe, universe.world, null, buildableAsEntity, null);
        buildable.finalize(uwpe);
    }
    initialize() {
        var universe = this.universeBuild();
        var buildable = this.buildableBuild(universe);
        var buildableAsEntity = new Entity("[name]", [buildable]);
        var uwpe = new UniverseWorldPlaceEntities(universe, universe.world, null, buildableAsEntity, null);
        buildable.initialize(uwpe);
    }
    updateForTimerTick() {
        var universe = this.universeBuild();
        var buildable = this.buildableBuild(universe);
        var buildableAsEntity = new Entity("[name]", [buildable]);
        var uwpe = new UniverseWorldPlaceEntities(universe, universe.world, null, buildableAsEntity, null);
        buildable.updateForTimerTick(uwpe);
    }
}
