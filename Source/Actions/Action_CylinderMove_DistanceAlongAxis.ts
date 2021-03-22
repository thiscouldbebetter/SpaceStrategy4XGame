
class Action_CylinderMove_DistanceAlongAxis
{
	distanceToMove: number;

	constructor(distanceToMove: number)
	{
		this.distanceToMove = distanceToMove;
	}

	perform(actor: Entity)
	{
		var constraint =
			actor.constrainable().constraintByClassName(Constraint_PositionOnCylinder.name);
		var constraintCylinder = constraint as Constraint_PositionOnCylinder;

		constraintCylinder.distanceFromCenterAlongAxis += this.distanceToMove;
	}
}
