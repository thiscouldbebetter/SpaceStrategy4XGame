
class DeviceTests extends TestFixture
{
	universe: Universe;
	world: WorldExtended;
	ship: Ship;
	device: Device;
	uwpe: UniverseWorldPlaceEntities;

	constructor()
	{
		super(DeviceTests.name);

		this.universe = new EnvironmentMock().universeBuild();
		this.world = this.universe.world as WorldExtended;
		var starsystem = this.world.factions()[0].starsystemHome(this.world);
		this.ship = starsystem.ships[0];
		var devices = this.ship.deviceUser().devices();
		this.device = devices[0];
		this.uwpe = new UniverseWorldPlaceEntities
		(
			this.universe, this.world, null, this.ship, null
		);
	}

	tests(): ( () => void )[]
	{
		return [ this.updateForTurn, this.use ];
	}

	// Tests.

	updateForTurn(): void
	{
		this.device.updateForRound(this.uwpe);
	}

	use(): void
	{
		this.device.use(this.uwpe);
	}
}
