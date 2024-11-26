
class PlanetDemographicsTests extends TestFixture
{
	universe: Universe;
	world: WorldExtended;
	planet: Planet;

	constructor()
	{
		super(PlanetDemographicsTests.name);

		this.universe = new EnvironmentMock().universeBuild();
		this.world = this.universe.world as WorldExtended;
		var faction = this.world.factions()[0];
		this.planet = faction.planetHome(this.world);
	}

	tests(): ( () => void )[]
	{
		var returnTests =
		[
			this.updateForTurn
		];

		return returnTests;
	}

	// Tests.

	updateForTurn(): void
	{
		var planetDemographics = this.planet.demographics;
		planetDemographics.updateForRound
		(
			this.universe,
			this.world,
			this.planet.faction(),
			this.planet
		);
	}
}
