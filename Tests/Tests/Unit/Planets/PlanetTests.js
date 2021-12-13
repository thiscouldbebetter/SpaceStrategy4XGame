"use strict";
class PlanetTests extends TestFixture {
    constructor() {
        super(PlanetTests.name);
        this.universe = new EnvironmentMock().universeBuild();
        this.world = this.universe.world;
        var faction = this.world.factions[0];
        this.planet = faction.planetHome(this.world);
    }
    tests() {
        var returnTests = [
            this.fromNameBodyDefnAndPos,
            this.bodyDefnPlanet,
            this.bodyDefnStar,
            this.faction,
            this.toEntity,
            this.shipAdd,
            this.shipRemove,
            this.toControl,
            this.strength,
            this.updateForTurn,
            this.buildableEntityInProgress,
            this.industryPerTurn,
            this.prosperityPerTurn,
            this.researchPerTurn,
            this.resourcesPerTurn,
            this.resourcesPerTurnByName
        ];
        return returnTests;
    }
    shipAddOrRemove() {
        var ship = this.shipBuild();
        Assert.isTrue(this.planet.ships.indexOf(ship) == -1);
        this.planet.shipAdd(ship);
        Assert.isTrue(this.planet.ships.indexOf(ship) >= 0);
        this.planet.shipRemove(ship);
        Assert.isTrue(this.planet.ships.indexOf(ship) == -1);
    }
    shipBuild() {
        var ship = new Ship("Ship", Ship.bodyDefnBuild(Color.byName("Red")), new Coords(0, 0, 0), this.planet.factionName, [] // devices
        );
        return ship;
    }
    // Tests.
    fromNameBodyDefnAndPos() {
        var planet = Planet.fromNameBodyDefnAndPos("name", Planet.bodyDefnPlanet(), // bodyDefn
        new Coords(0, 0, 0) // pos
        );
        Assert.isNotNull(planet);
    }
    // constants
    bodyDefnPlanet() {
        var bodyDefn = Planet.bodyDefnPlanet();
        Assert.isNotNull(bodyDefn);
    }
    bodyDefnStar() {
        var bodyDefn = Planet.bodyDefnStar();
        Assert.isNotNull(bodyDefn);
    }
    // instance methods
    faction() {
        var faction = this.planet.faction(this.world);
        Assert.isNotNull(faction);
    }
    toEntity() {
        var planetAsEntity = this.planet.toEntity();
        Assert.isNotNull(planetAsEntity);
    }
    shipAdd() {
        this.shipAddOrRemove();
    }
    shipRemove() {
        this.shipAddOrRemove();
    }
    // controls
    toControl() {
        var uwpe = new UniverseWorldPlaceEntities(this.universe, null, null, this.planet, null);
        var planetAsControl = -Planet.toControl(uwpe, this.universe.display.sizeInPixels, null);
        Assert.isNotNull(planetAsControl);
    }
    // diplomacy
    strength() {
        var planetStrength = this.planet.strength(this.world);
        Assert.isNotNull(planetStrength);
    }
    // turns
    updateForTurn() {
        var faction = this.planet.faction(this.world);
        this.planet.updateForTurn(this.universe, this.world, faction);
    }
    // resources
    buildableEntityInProgress() {
        var buildable = this.planet.buildableEntityInProgress;
        Assert.isNotNull(buildable);
    }
    industryPerTurn() {
        var faction = this.planet.faction(this.world);
        var industryPerTurn = this.planet.industryPerTurn(this.universe, this.world, faction);
        Assert.isNotNull(industryPerTurn);
    }
    prosperityPerTurn() {
        var faction = this.planet.faction(this.world);
        var prosperityPerTurn = this.planet.prosperityPerTurn(this.universe, this.world, faction);
        Assert.isNotNull(prosperityPerTurn);
    }
    researchPerTurn() {
        var faction = this.planet.faction(this.world);
        var researchPerTurn = this.planet.researchPerTurn(this.universe, this.world, faction);
        Assert.isNotNull(researchPerTurn);
    }
    resourcesPerTurn() {
        var resources = this.planet.resourcesPerTurn(this.world);
        Assert.isNotNull(resources);
    }
    resourcesPerTurnByName() {
        var resourcesByName = this.planet.resourcesPerTurnByName(this.world);
        Assert.isNotNull(resourcesByName);
    }
}
