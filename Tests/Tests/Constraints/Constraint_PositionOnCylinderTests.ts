
class Constraint_PositionOnCylinderTests extends TestFixture
{
	constructor()
	{
		super(Constraint_PositionOnCylinderTests.name);
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

		var constraint = Constraint_PositionOnCylinder.default();

		var constrainable = Constrainable.fromConstraint(constraint);
		var locatable = Locatable.fromPos(Coords.random(universe.randomizer));
		var entity = new Entity("test", [ constrainable, locatable ] );

		var uwpe = new UniverseWorldPlaceEntities(universe, world, place, entity, null);
		constraint.constrain(uwpe);
	}
}
