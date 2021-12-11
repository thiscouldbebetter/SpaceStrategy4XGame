
class ShipTests extends TestFixture
{
	universe: Universe;
	world: WorldExtended;
	ship: Ship;

	constructor()
	{
		super(ShipTests.name);
		this.universe = new EnvironmentMock().universeBuild();
		this.world = this.universe.world as WorldExtended;
		var faction = this.world.factions[0];
		this.ship = faction.ships[0];
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
			this.updateForTurn,
			this.draw,
			this.visual
		];

		return returnTests;
	}

	// Helpers.

	linkPortalEnterThenExit(): void
	{
		var network = this.world.network;
		var starsystemFrom = this.ship.starsystem(this.world);
		var linkPortal = starsystemFrom.linkPortals[0];
		this.ship.linkPortalEnter(network, linkPortal, this.ship);
		var link = linkPortal.link(network);
		this.ship.linkExit(this.world, link);
	}

	// Tests.

	bodyDefnBuild(): void
	{
		var bodyDefn = Ship.bodyDefnBuild(Color.byName("Red"));
		Assert.isNotNull(bodyDefn);
	}

	faction(): void
	{
		var faction = this.ship.faction(this.world);
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
		var devicesUsable = this.ship.devicesUsable(this.world);
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
		this.ship.moveTowardTarget(this.universe, targetEntity, this.ship);
	}

	movementThroughLinkPerTurn(): void
	{
		var link = null;
		var speed = this.ship.movementThroughLinkPerTurn(link);
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
		var strength = this.ship.strength(this.world);
		Assert.isNotNull(strength);
	}

	// turns

	updateForTurn(): void
	{
		var faction = this.ship.faction(this.world);
		this.ship.updateForTurn
		(
			this.universe, this.world, faction
		);
	}

	// drawable

	draw(): void
	{
		var camera = Camera.default();

		this.ship.draw
		(
			this.universe,
			10, // nodeRadiusActual,
			camera,
			new Coords(0, 0, 0) // drawPos
		);
	}

	visual(): void
	{
		var visual = this.ship.visual(this.world);
		Assert.isNotNull(visual);
	}
}