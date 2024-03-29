"use strict";
class PlanetIndustryTests extends TestFixture {
    constructor() {
        super(PlanetIndustryTests.name);
        this.universe = new EnvironmentMock().universeBuild();
        this.world = this.universe.world;
        var faction = this.world.factions()[0];
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
        var planetIndustry = this.planet.industry;
        planetIndustry.updateForRound(this.universe, this.world, this.planet.faction(), this.planet);
    }
}
