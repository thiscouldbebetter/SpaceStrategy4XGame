"use strict";
class OrderDefnTests extends TestFixture {
    constructor() {
        super(OrderDefnTests.name);
        this.universe = new EnvironmentMock().universeBuild();
        this.world = this.universe.world;
        this.starsystem = this.world.factions()[0].starsystemHome(this.world);
        this.ship = this.starsystem.ships[0];
    }
    tests() {
        return [this.go, this.useDevice];
    }
    // Tests.
    go() {
        var orderDefn = OrderDefn.Instances().Go;
        var order = new Order().entityBeingOrderedSet(this.ship).defnSet(orderDefn).entityBeingTargetedSet(this.starsystem.planets[0]);
        this.ship.orderable().orderSet(order);
        var uwpe = new UniverseWorldPlaceEntities(this.universe, this.world, null, this.ship, null);
        order.obey(uwpe);
    }
    useDevice() {
        var orderDefn = OrderDefn.Instances().UseDevice;
        var targetEntity = null; // this.ship.devices[0];
        var order = new Order().entityBeingOrderedSet(this.ship).defnSet(orderDefn).entityBeingTargetedSet(targetEntity);
        var uwpe = new UniverseWorldPlaceEntities(this.universe, this.world, null, this.ship, null);
        order.obey(uwpe);
    }
}
