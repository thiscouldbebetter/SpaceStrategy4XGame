
class LayoutTests extends TestFixture
{
	constructor() // sizeInPixels: Coords, map: MapLayout)
	{
		super(LayoutTests.name);
	}

	tests(): ( ()=> void)[]
	{
		var returnValues =
		[
			this.planet,

			this.facilities,
			this.initialize,
			this.updateForTurn,

			this.draw
		];

		return returnValues;
	}

	// Setup.

	layoutBuild(universe: Universe): Layout
	{
		var world = universe.world as WorldExtended;
		var planet = world.network.nodes[0].starsystem.planets[0];
		var layout = planet.layout(universe);
		return layout;
	}

	universeBuild(): Universe
	{
		return new EnvironmentMock().universeBuild();
	}

	// Tests.

	// static methods

	planet(): void
	{
		var universe = this.universeBuild();
		var world = universe.world as WorldExtended;
		var planet = world.network.nodes[0].starsystem.planets[0];

		var layout = planet.layout(universe);

		Assert.isNotNull(layout);
	}

	// instance methods

	// turnable

	facilities(): void
	{
		var layout = this.layoutBuild(this.universeBuild() );
		var facilities = layout.facilities();
		Assert.isNotNull(facilities);
	}

	initialize(): void
	{
		var universe = this.universeBuild() ;
		var layout = this.layoutBuild(universe);
		layout.initialize(universe);
	}

	updateForTurn(): void // universe: Universe, world: World, faction: Faction, parentModel: Entity)
	{
		var universe = this.universeBuild();
		var world = universe.world;
		var layout = this.layoutBuild(universe);
		var faction = Faction.fromName("[name]");
		var parentModel = new Entity("[name]", []); // todo
		layout.updateForRound(universe, world, faction, parentModel);
	}

	// drawable

	draw(): void
	{
		var universe = this.universeBuild();
		var display = universe.display;
		var layout = this.layoutBuild(universe);
		layout.draw(universe, display);
	}
}
