
class BuildableTests extends TestFixture
{
	constructor()
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
			this.toEntity,

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

	toEntity(): void
	{
		var universe = this.universeBuild();
		var world = universe.world as WorldExtended;
		var buildable = this.buildableBuild(universe);
		var entity = buildable.toEntity(world);
		Assert.isNotNull(entity);
	}

	// EntityProperty.

	finalize(): void
	{
		var universe = this.universeBuild();
		var buildable = this.buildableBuild(universe);
		var buildableAsEntity = new Entity("[name]", [ buildable ] );
		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, universe.world, null, buildableAsEntity, null
		);
		buildable.finalize(uwpe);
	}

	initialize(): void
	{
		var universe = this.universeBuild();
		var buildable = this.buildableBuild(universe);
		var buildableAsEntity = new Entity("[name]", [ buildable ] );
		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, universe.world, null, buildableAsEntity, null
		);
		buildable.initialize(uwpe);
	}

	updateForTimerTick(): void
	{
		var universe = this.universeBuild();
		var buildable = this.buildableBuild(universe);
		var buildableAsEntity = new Entity("[name]", [ buildable ] );
		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, universe.world, null, buildableAsEntity, null
		);
		buildable.updateForTimerTick(uwpe);
	}
}
