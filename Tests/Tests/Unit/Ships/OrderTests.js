"use strict";
class OrderTests extends TestFixture {
    constructor() {
        super(OrderTests.name);
        this.universe = new EnvironmentMock().universeBuild();
        this.world = this.universe.world;
        this.starsystem = this.world.factions[0].starsystemHome(this.world);
        this.ship = this.starsystem.ships[0];
        this.order = new Order(OrderDefn.Instances().Go.name, this.starsystem.planets[0]);
        this.ship.orderable().order = this.order;
    }
    tests() {
        return [this.defn, this.obey];
    }
    // Tests.
    defn() {
        var defn = this.order.defn();
        Assert.isNotNull(defn);
    }
    obey() {
        this.order.obey(this.universe, this.world, null, this.ship);
    }
}
