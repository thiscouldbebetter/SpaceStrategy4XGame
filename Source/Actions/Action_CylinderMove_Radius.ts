
class Action_CylinderMove_Radius
{
	distanceToMove: number;

	constructor(distanceToMove: number)
	{
		this.distanceToMove = distanceToMove;
	}

	perform(actor: Entity)
	{
		var constraint =
			Constrainable.of(actor).constraintByClassName(Constraint_PositionOnCylinder.name);
		var constraintCylinder = constraint as Constraint_PositionOnCylinder;

		constraintCylinder.radius += this.distanceToMove;
	}
}
