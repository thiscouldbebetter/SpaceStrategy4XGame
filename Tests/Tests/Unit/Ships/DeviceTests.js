"use strict";
class DeviceTests extends TestFixture {
    constructor() {
        super(DeviceTests.name);
        this.universe = new EnvironmentMock().universeBuild();
        this.world = this.universe.world;
        var starsystem = this.world.factions()[0].starsystemHome(this.world);
        this.ship = starsystem.ships[0];
        var devices = this.ship.deviceUser().devices();
        this.device = devices[0];
        this.uwpe = new UniverseWorldPlaceEntities(this.universe, this.world, null, this.ship, null);
    }
    tests() {
        return [this.updateForTurn, this.use];
    }
    // Tests.
    updateForTurn() {
        this.device.updateForRound(this.uwpe);
    }
    use() {
        this.device.use(this.uwpe);
    }
}
