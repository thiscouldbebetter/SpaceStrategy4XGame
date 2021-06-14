
class VenueLayoutTests extends TestFixture
{
	constructor()
	{
		super(VenueLayoutTests.name);
	}

	tests(): ( ()=>void )[]
	{
		var returnValues =
		[
			this.finalize,
			this.initialize,
			this.model,
			this.updateForTimerTick,

			this.controlBuildableDetailsBuild,
			this.controlBuildableSelectBuild,
			this.toControl,

			this.draw
		];

		return returnValues;
	}

	// Setup.

	universeBuild(): Universe
	{
		return new EnvironmentMock().universeBuild();
	}

	venueLayoutBuild(universe: Universe): VenueLayout
	{
		var world = universe.world as WorldExtended;
		var planet = world.network.nodes[0].starsystem.planets[0];
		var layout = Layout.planet(universe, planet);
		var map = layout.map;
		var mapCursorPos = map.cursor.pos;

		var isBuildableComplete = true;

		var entity = new Entity
		(
			"[entityName]",
			[
				new Buildable("defnName", mapCursorPos, isBuildableComplete),
				Drawable.fromVisual(new VisualNone()),
				Locatable.fromPos(mapCursorPos)
			]
		);
		map.bodies.push(entity);

		var venueParent = null; // todo
		var modelParent = planet;
		var returnValue = new VenueLayout(venueParent, modelParent, layout);
		return returnValue;
	}

	// Tests.

	finalize(): void
	{
		var universe = this.universeBuild();
		var venueLayout = this.venueLayoutBuild(universe);
		venueLayout.finalize(universe)
	}

	initialize(): void
	{
		var universe = this.universeBuild();
		var venueLayout = this.venueLayoutBuild(universe);
		venueLayout.initialize(universe);
	}

	model(): void
	{
		var universe = this.universeBuild();
		var model = this.venueLayoutBuild(universe).model();
		Assert.isNotNull(model);
	}

	updateForTimerTick(): void // universe: Universe)
	{
		var universe = this.universeBuild();
		var venueLayout = this.venueLayoutBuild(universe);
		venueLayout.initialize(universe);
		venueLayout.updateForTimerTick(universe);
	}

	// controls

	controlBuildableDetailsBuild(): void
	{
		var universe = this.universeBuild();
		var venueLayout = this.venueLayoutBuild(universe);
		var control = venueLayout.controlBuildableDetailsBuild(universe);
		Assert.isNotNull(control);
	}

	controlBuildableSelectBuild(): void
	{
		var universe = this.universeBuild();
		var venueLayout = this.venueLayoutBuild(universe);
		var cursorPos = Coords.zeroes();
		var control = venueLayout.controlBuildableSelectBuild(universe, cursorPos);
		Assert.isNotNull(control);
	}

	toControl(): void
	{
		var universe = this.universeBuild();
		var venueLayout = this.venueLayoutBuild(universe);
		var control = venueLayout.toControl(universe);
		Assert.isNotNull(control);
	}

	// drawable

	draw(): void
	{
		var universe = this.universeBuild();
		var venueLayout = this.venueLayoutBuild(universe);
		venueLayout.draw(universe);
	}
}
