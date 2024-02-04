"use strict";
class ShipTests extends TestFixture {
    constructor() {
        super(ShipTests.name);
        this.universe = new EnvironmentMock().universeBuild();
        this.world = this.universe.world;
        var faction = this.world.factions()[0];
        this.ship = faction.ships[0];
        this.universeAndWorldAsUwpe = new UniverseWorldPlaceEntities(this.universe, this.world, null, null, null);
    }
    tests() {
        var returnTests = [
            this.bodyDefnBuild,
            this.faction,
            this.nameWithFaction,
            this.devicesUsable,
            this.linkPortalEnter,
            this.linkExit,
            this.moveTowardTarget,
            this.movementThroughLinkPerTurn,
            this.planetOrbitEnter,
            this.toControl,
            this.updateForTurn,
            this.draw,
            this.visual
        ];
        return returnTests;
    }
    // Helpers.
    linkPortalEnterThenExit() {
        var network = this.world.starCluster;
        var starsystemFrom = this.ship.starsystem(this.world);
        var linkPortal = starsystemFrom.linkPortals[0];
        this.ship.linkPortalEnter(network, linkPortal, this.ship);
        var link = linkPortal.link(network);
        this.ship.linkExit(link, this.universeAndWorldAsUwpe);
    }
    // Tests.
    bodyDefnBuild() {
        var bodyDefn = Ship.bodyDefnBuild(Color.byName("Red"));
        Assert.isNotNull(bodyDefn);
    }
    faction() {
        var faction = this.ship.faction();
        Assert.isNotNull(faction);
    }
    nameWithFaction() {
        var nameWithFaction = this.ship.nameWithFaction();
        Assert.isNotNull(nameWithFaction);
    }
    // devices
    devicesUsable() {
        var devicesUsable = this.ship.deviceUser().devicesUsable();
        Assert.isNotNull(devicesUsable);
    }
    // movement
    linkPortalEnter() {
        this.linkPortalEnterThenExit();
    }
    linkExit() {
        this.linkPortalEnterThenExit();
    }
    moveTowardTarget() {
        var starsystem = this.ship.starsystem(this.world);
        var targetEntity = starsystem.star;
        this.ship.moveTowardTargetAndReturnDistance(targetEntity);
    }
    movementThroughLinkPerTurn() {
        var link = null;
        var speed = this.ship.speedThroughLinkThisRound(link);
        Assert.isNotNull(speed);
    }
    planetOrbitEnter() {
        var starsystem = this.ship.starsystem(this.world);
        var planet = starsystem.planets[0];
        this.ship.planetOrbitEnter(this.universe, starsystem, planet);
    }
    // controls
    toControl() {
        var uwpe = new UniverseWorldPlaceEntities(this.universe, null, null, this.ship, null);
        var control = Ship.toControl(uwpe, this.universe.display.sizeInPixels, Starsystem.name);
        Assert.isNotNull(control);
    }
    // diplomacy
    strength() {
        var strategicValue = this.ship.strategicValue(this.world);
        Assert.isNotNull(strategicValue);
    }
    // turns
    updateForTurn() {
        var faction = this.ship.faction();
        this.ship.updateForRound(this.universe, this.world, faction);
    }
    // drawable
    draw() {
        var camera = Camera.default();
        this.ship.draw(this.universe, 10, // nodeRadiusActual,
        camera, new Coords(0, 0, 0) // drawPos
        );
    }
    visual() {
        var visual = this.ship.visual(this.world);
        Assert.isNotNull(visual);
    }
}
