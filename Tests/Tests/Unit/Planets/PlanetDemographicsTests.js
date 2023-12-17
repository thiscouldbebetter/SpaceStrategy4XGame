"use strict";
class PlanetDemographicsTests extends TestFixture {
    constructor() {
        super(PlanetDemographicsTests.name);
        this.universe = new EnvironmentMock().universeBuild();
        this.world = this.universe.world;
        var faction = this.world.factions[0];
        this.planet = faction.planetHome(this.world);
    }
    tests() {
        var returnTests = [
            this.updateForTurn
        ];
        return returnTests;
    }
    // Tests.
    updateForTurn() {
        var planetDemographics = this.planet.demographics;
        planetDemographics.updateForRound(this.universe, this.world, this.planet.faction(this.world), this.planet);
    }
}
