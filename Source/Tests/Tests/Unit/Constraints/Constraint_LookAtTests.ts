
class Constraint_LookAtTests extends TestFixture
{
	constructor() // targetPos: Coords)
	{
		super(Constraint_LookAtTests.name);
	}

	tests(): ( ()=>void )[]
	{
		return [ this.constrain ];
	}

	constrain(): void
	{
		var universe = new EnvironmentMock().universeBuild();
		var world = universe.world;
		var place = null;

		var constraint = Constraint_LookAt.default();

		var constrainable = Constrainable.fromConstraint(constraint);
		var locatable = Locatable.fromPos(Coords.random(universe.randomizer));
		var entity = new Entity("test", [ constrainable, locatable ] );

		var uwpe = new UniverseWorldPlaceEntities(universe, world, place, entity, null);
		constraint.constrain(uwpe);
	}
}
