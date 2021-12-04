"use strict";
class OrderDefnTests extends TestFixture {
    constructor() {
        super(OrderDefnTests.name);
        this.universe = new EnvironmentMock().universeBuild();
        this.world = this.universe.world;
        this.starsystem = this.world.factions[0].starsystemHome(this.world);
        this.ship = this.starsystem.ships[0];
    }
    tests() {
        return [this.go, this.useDevice];
    }
    // Tests.
    go() {
        var orderDefn = OrderDefn.Instances().Go;
        var order = new Order(orderDefn.name, this.starsystem.planets[0]);
        this.ship.orderable().order = order;
        order.obey(this.universe, this.world, null, this.ship);
    }
    useDevice() {
        var orderDefn = OrderDefn.Instances().UseDevice;
        var targetEntity = null; // this.ship.devices[0];
        var order = new Order(orderDefn.name, targetEntity);
        order.obey(this.universe, this.world, null, this.ship);
    }
}
