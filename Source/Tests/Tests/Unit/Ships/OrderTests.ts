
class OrderTests extends TestFixture
{
	universe: Universe;
	world: WorldExtended;
	starsystem: Starsystem;
	ship: Ship;
	order: Order;

	constructor()
	{
		super(OrderTests.name);

		this.universe = new EnvironmentMock().universeBuild();
		this.world = this.universe.world as WorldExtended;
		this.starsystem = this.world.factions()[0].starsystemHome(this.world);
		this.ship = this.starsystem.ships[0];
		this.order = new Order().entityBeingOrderedSet
		(
			this.ship
		).defnSet
		(
			OrderDefn.Instances().Go
		).entityBeingTargetedSet
		(
			this.starsystem.planets[0]
		);
		this.ship.orderable().orderSet(this.order);
	}

	tests(): ( () => void )[]
	{
		return [ this.defn, this.obey ];
	}

	// Tests.

	defn(): void
	{
		var defn = this.order.defn;
		Assert.isNotNull(defn);
	}

	obey(): void
	{
		var uwpe = new UniverseWorldPlaceEntities(this.universe, this.world, null, this.ship, null);
		this.order.obey(uwpe);
	}
}
