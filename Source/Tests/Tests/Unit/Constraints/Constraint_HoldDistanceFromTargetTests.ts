
class Constraint_HoldDistanceFromTargetTests extends TestFixture
{
	constructor() // distanceToHold: number, targetPos: Coords)
	{
		super(Constraint_HoldDistanceFromTargetTests.name);
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

		var constraint = Constraint_HoldDistanceFromTarget.default();

		var constrainable = Constrainable.fromConstraint(constraint);
		var locatable = Locatable.fromPos(Coords.random(universe.randomizer));
		var entity = new Entity("test", [ constrainable, locatable ] );

		var uwpe = new UniverseWorldPlaceEntities(universe, world, place, entity, null);
		constraint.constrain(uwpe);
	}
}
