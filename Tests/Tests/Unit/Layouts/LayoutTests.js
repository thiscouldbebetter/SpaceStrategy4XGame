"use strict";
class LayoutTests extends TestFixture {
    constructor() {
        super(LayoutTests.name);
    }
    tests() {
        var returnValues = [
            this.planet,
            this.facilities,
            this.initialize,
            this.updateForTurn,
            this.draw
        ];
        return returnValues;
    }
    // Setup.
    layoutBuild(universe) {
        var world = universe.world;
        var planet = world.starCluster.nodes[0].starsystem.planets[0];
        var layout = planet.layout(universe);
        return layout;
    }
    universeBuild() {
        return new EnvironmentMock().universeBuild();
    }
    // Tests.
    // static methods
    planet() {
        var universe = this.universeBuild();
        var world = universe.world;
        var planet = world.starCluster.nodes[0].starsystem.planets[0];
        var layout = planet.layout(universe);
        Assert.isNotNull(layout);
    }
    // instance methods
    // turnable
    facilities() {
        var layout = this.layoutBuild(this.universeBuild());
        var facilities = layout.facilities();
        Assert.isNotNull(facilities);
    }
    initialize() {
        var universe = this.universeBuild();
        var layout = this.layoutBuild(universe);
        layout.initialize(universe);
    }
    updateForTurn() {
        var universe = this.universeBuild();
        var world = universe.world;
        var layout = this.layoutBuild(universe);
        var faction = Faction.fromDefnName("[name]");
        var parentModel = new Entity("[name]", []); // todo
        layout.updateForRound(universe, world, faction, parentModel);
    }
    // drawable
    draw() {
        var universe = this.universeBuild();
        var display = universe.display;
        var layout = this.layoutBuild(universe);
        layout.draw(universe, display);
    }
}
