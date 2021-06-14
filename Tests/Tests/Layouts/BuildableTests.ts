
class BuildableTests extends TestFixture
{
	constructor() //defnName: string, pos: Coords, isComplete: boolean)
	{
		super(BuildableTests.name);
	}

	tests(): ( ()=>void )[]
	{
		var returnValues =
		[
			this.fromEntity,

			this.defn,
			this.locatable,
			this.visual,

			this.finalize,
			this.initialize,
			this.updateForTimerTick
		];

		return returnValues;
	}

	// Setup.

	buildableBuild(universe: Universe): Buildable
	{
		var world = universe.world as WorldExtended;
		var buildableDefn = world.buildableDefns[0];
		var buildableDefnName = buildableDefn.name;

		return new Buildable
		(
			buildableDefnName,
			Coords.zeroes(), // pos?
			false // isComplete
		);
	}

	universeBuild(): Universe
	{
		var returnValue = new EnvironmentMock().universeBuild();
		return returnValue;
	}

	// Tests.

	fromEntity(): void
	{
		var buildable = this.buildableBuild( this.universeBuild() );
		var entity = new Entity("[name]", [ buildable ] );

		var buildableFromEntity = Buildable.fromEntity(entity);

		Assert.isNotNull(buildableFromEntity);
	}

	defn(): void
	{
		var universe = this.universeBuild();
		var world = universe.world as WorldExtended;
		var buildable = this.buildableBuild(universe);
		var buildableDefn = buildable.defn(world);
		Assert.isNotNull(buildableDefn);
	}

	locatable(): void
	{
		var buildable = this.buildableBuild(this.universeBuild() );
		var locatable = buildable.locatable();
		Assert.isNotNull(locatable);
	}

	visual(): void // world: WorldExtended): Visual
	{
		var universe = this.universeBuild();
		var world = universe.world as WorldExtended;
		var buildable = this.buildableBuild(universe);
		var visual = buildable.visual(world);
		Assert.isNotNull(visual);
	}

	// EntityProperty.

	finalize(): void
	{
		var universe = this.universeBuild();
		var buildable = this.buildableBuild(universe);
		var buildableAsEntity = new Entity("[name]", [ buildable ] );
		buildable.finalize
		(
			universe, universe.world, null, buildableAsEntity
		)
	}

	initialize(): void
	{
		var universe = this.universeBuild();
		var buildable = this.buildableBuild(universe);
		var buildableAsEntity = new Entity("[name]", [ buildable ] );
		buildable.initialize
		(
			universe, universe.world, null, buildableAsEntity
		)
	}

	updateForTimerTick(): void
	{
		var universe = this.universeBuild();
		var buildable = this.buildableBuild(universe);
		var buildableAsEntity = new Entity("[name]", [ buildable ] );
		buildable.updateForTimerTick
		(
			universe, universe.world, null, buildableAsEntity
		)
	}
}
