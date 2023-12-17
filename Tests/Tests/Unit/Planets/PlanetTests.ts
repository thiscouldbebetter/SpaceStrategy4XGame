
class PlanetTests extends TestFixture
{
	universe: Universe;
	world: WorldExtended;
	planet: Planet;

	constructor()
	{
		super(PlanetTests.name);

		this.universe = new EnvironmentMock().universeBuild();
		this.world = this.universe.world as WorldExtended;
		var faction = this.world.factions[0];
		this.planet = faction.planetHome(this.world);
	}

	tests(): ( () => void )[]
	{
		var returnTests =
		[
			this.fromNameTypeAndPos,
			this.faction,
			this.toEntity,
			this.shipAdd,
			this.shipRemove,
			this.toControl,
			this.strategicValue,
			this.updateForTurn,
			this.buildableEntityInProgress,
			this.industryPerTurn,
			this.prosperityPerTurn,
			this.researchPerTurn,
			this.resourcesPerTurn,
			this.resourcesThisRoundByName
		];

		return returnTests;
	}

	shipAddOrRemove(): void
	{
		var ship = this.shipBuild();
		Assert.isTrue(this.planet.ships.indexOf(ship) == -1);
		this.planet.shipAddToOrbit(ship);
		Assert.isTrue(this.planet.ships.indexOf(ship) >= 0);
		this.planet.shipLeaveOrbit(ship, this.world);
		Assert.isTrue(this.planet.ships.indexOf(ship) == -1);
	}

	shipBuild(): Ship
	{
		var ship = new Ship
		(
			"Ship",
			ShipHullSize.Instances().Small,
			Ship.bodyDefnBuild(Color.byName("Red")),
			new Coords(0, 0, 0),
			this.planet.factionable().faction(),
			[] // devices
		);

		return ship;
	}

	// Tests.

	fromNameTypeAndPos(): void
	{
		var planetType = PlanetType.Instances()._All[0];

		var planet = Planet.fromNameTypeAndPos
		(
			"name",
			planetType, // type
			Coords.zeroes() // pos
		);

		Assert.isNotNull(planet);
	}

	// instance methods

	faction(): void
	{
		var faction = this.planet.faction();
		Assert.isNotNull(faction);
	}

	toEntity(): void
	{
		var planetAsEntity = this.planet.toEntity();
		Assert.isNotNull(planetAsEntity);
	}

	shipAdd(): void
	{
		this.shipAddOrRemove();
	}

	shipRemove(): void
	{
		this.shipAddOrRemove();
	}

	// controls

	toControl(): void
	{
		var uwpe = new UniverseWorldPlaceEntities
		(
			this.universe, null, null, this.planet, null
		);
		var planetAsControl =-Planet.toControl
		(
			uwpe, this.universe.display.sizeInPixels, null
		);
		Assert.isNotNull(planetAsControl);
	}

	// diplomacy

	strategicValue(): void
	{
		var planetStrength = this.planet.strategicValue(this.world);
		Assert.isNotNull(planetStrength);
	}

	// turns

	updateForTurn(): void
	{
		var faction = this.planet.faction();
		this.planet.updateForRound
		(
			this.universe, this.world, faction
		);
	}

	// resources

	buildableEntityInProgress(): void
	{
		var buildable = this.planet.buildableEntityInProgress;
		Assert.isNotNull(buildable);
	}

	industryPerTurn(): void
	{
		var industryPerTurn = this.planet.industryThisRound
		(
			this.universe, this.world
		);
		Assert.isNotNull(industryPerTurn)
	}

	prosperityPerTurn(): void
	{
		var faction = this.planet.faction();
		var prosperityPerTurn = this.planet.prosperityThisRound
		(
			this.universe, this.world, faction
		);
		Assert.isNotNull(prosperityPerTurn)
	}

	researchPerTurn(): void
	{
		var faction = this.planet.faction();
		var researchPerTurn = this.planet.researchThisRound
		(
			this.universe, this.world, faction
		);
		Assert.isNotNull(researchPerTurn)
	}

	resourcesPerTurn(): void
	{
		var resources = this.planet.resourcesThisRound
		(
			this.universe,
			this.world
		);
		Assert.isNotNull(resources);
	}

	resourcesThisRoundByName(): void
	{
		var resourcesByName = this.planet.resourcesThisRoundByName
		(
			this.universe,
			this.world
		);
		Assert.isNotNull(resourcesByName);
	}
}
