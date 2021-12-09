
class DeviceTests extends TestFixture
{
	universe: Universe;
	world: WorldExtended;
	ship: Ship;
	device: Device;

	constructor()
	{
		super(DeviceTests.name);

		this.universe = new EnvironmentMock().universeBuild();
		this.world = this.universe.world as WorldExtended;
		var starsystem = this.world.factions[0].starsystemHome(this.world);
		this.ship = starsystem.ships[0];
		this.device = this.ship.devices[0];
	}

	tests(): ( () => void )[]
	{
		return [ this.updateForTurn, this.use ];
	}

	// Tests.

	updateForTurn(): void
	{
		this.device.updateForTurn
		(
			this.universe, this.world, null, this.ship
		);
	}

	use(): void
	{
		this.device.use
		(
			this.universe, this.world, null, this.ship
		);
	}
}
