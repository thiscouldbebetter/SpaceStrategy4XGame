
class ShipTests extends TestFixture
{
	universe: Universe;
	world: WorldExtended;
	ship: Ship;
	
	universeAndWorldAsUwpe: UniverseWorldPlaceEntities;

	constructor()
	{
		super(ShipTests.name);

		this.universe = new EnvironmentMock().universeBuild();
		this.world = this.universe.world as WorldExtended;
		var faction = this.world.factions()[0];
		this.ship = faction.ships[0];
	
		this.universeAndWorldAsUwpe = new UniverseWorldPlaceEntities
		(
			this.universe, this.world, null, null, null
		);
	}

	tests(): ( () => void )[]
	{
		var returnTests =
		[
			this.bodyDefnBuild,
			this.faction,
			this.nameWithFaction,
			this.devicesUsable,
			this.linkPortalEnter,
			this.linkExit,
			this.moveTowardTarget,
			this.movementThroughLinkPerTurn,
			this.planetOrbitEnter,
			this.toControl,
			this.updateForTurn
		];

		return returnTests;
	}

	// Helpers.

	linkPortalEnterThenExit(): void
	{
		var network = this.world.starCluster;
		var starsystemFrom = this.ship.starsystem(this.world);
		var linkPortal = starsystemFrom.linkPortals[0];
		this.ship.linkPortalEnter(network, linkPortal, this.ship);
		var link = linkPortal.link(network);
		this.ship.linkExit(link, this.universeAndWorldAsUwpe);
	}

	// Tests.

	bodyDefnBuild(): void
	{
		var bodyDefn = Ship.bodyDefnBuild(Color.byName("Red"));
		Assert.isNotNull(bodyDefn);
	}

	faction(): void
	{
		var faction = this.ship.faction();
		Assert.isNotNull(faction);
	}

	nameWithFaction(): void
	{
		var nameWithFaction = this.ship.nameWithFaction();
		Assert.isNotNull(nameWithFaction);
	}

	// devices

	devicesUsable(): void
	{
		var devicesUsable = this.ship.deviceUser().devicesUsable();
		Assert.isNotNull(devicesUsable);
	}

	// movement

	linkPortalEnter(): void
	{
		this.linkPortalEnterThenExit();
	}

	linkExit(): void
	{
		this.linkPortalEnterThenExit();
	}

	moveTowardTarget(): void
	{
		var starsystem = this.ship.starsystem(this.world);
		var targetEntity = starsystem.star;
		this.ship.moveTowardTargetAndReturnDistance(targetEntity);
	}

	movementThroughLinkPerTurn(): void
	{
		var link = StarClusterLink.fromNamesOfNodesLinked("todo", "todo2");
		var speed = this.ship.speedThroughLinkThisRound(link);
		Assert.isNotNull(speed);
	}

	planetOrbitEnter(): void
	{
		var starsystem = this.ship.starsystem(this.world);
		var planet = starsystem.planets[0];

		this.ship.planetOrbitEnter
		(
			this.universe, starsystem, planet
		);
	}

	// controls

	toControl(): void
	{
		var uwpe = new UniverseWorldPlaceEntities
		(
			this.universe, null, null, this.ship, null
		);
		var control = Ship.toControl
		(
			uwpe, this.universe.display.sizeInPixels, Starsystem.name
		);
		Assert.isNotNull(control);
	}

	// diplomacy

	strength(): void
	{
		var strategicValue = this.ship.strategicValue(this.world);
		Assert.isNotNull(strategicValue);
	}

	// turns

	updateForTurn(): void
	{
		var faction = this.ship.faction();
		this.ship.updateForRound
		(
			this.universe, this.world, faction
		);
	}
}
