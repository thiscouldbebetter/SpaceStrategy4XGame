"use strict";
class DeviceTests extends TestFixture {
    constructor() {
        super(DeviceTests.name);
        this.universe = new EnvironmentMock().universeBuild();
        this.world = this.universe.world;
        var starsystem = this.world.factions[0].starsystemHome(this.world);
        this.ship = starsystem.ships[0];
        this.device = this.ship.devices[0];
    }
    tests() {
        return [this.updateForTurn, this.use];
    }
    // Tests.
    updateForTurn() {
        this.device.updateForTurn(this.universe, this.world, null, this.ship);
    }
    use() {
        this.device.use(this.universe, this.world, null, this.ship);
    }
}
