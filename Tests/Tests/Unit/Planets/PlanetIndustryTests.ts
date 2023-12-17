
class PlanetIndustryTests extends TestFixture
{
	universe: Universe;
	world: WorldExtended;
	planet: Planet;

	constructor()
	{
		super(PlanetIndustryTests.name);

		this.universe = new EnvironmentMock().universeBuild();
		this.world = this.universe.world as WorldExtended;
		var faction = this.world.factions[0];
		this.planet = faction.planetHome(this.world);
	}

	tests(): ( () => void )[]
	{
		var returnTests =
		[
			this.updateForTurn
		];

		return returnTests
	}

	// Tests.

	updateForTurn(): void
	{
		var planetIndustry = this.planet.industry;
		planetIndustry.updateForRound
		(
			this.universe, this.world,
			this.planet.faction(),
			this.planet
		);
	}
}
