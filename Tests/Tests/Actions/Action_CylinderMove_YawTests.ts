
class Action_CylinderMove_YawTests extends TestFixture
{
	constructor()
	{
		super(Action_CylinderMove_YawTests.name);
	}

	tests(): ( ()=>void )[]
	{
		return [ this.perform ];
	}

	perform(): void
	{
		var constraint = Constraint_PositionOnCylinder.default();
		var constrainable = Constrainable.fromConstraint(constraint);
		var entity = new Entity("test", [ constrainable ] );
		var turnsToMove = 0.5;
		var action = new Action_CylinderMove_Yaw(turnsToMove);
		action.perform(entity);
	}
}
