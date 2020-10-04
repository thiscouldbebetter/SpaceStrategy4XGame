
class Action_CylinderMove_DistanceAlongAxis
{
	constructor(distanceToMove)
	{
		this.distanceToMove = distanceToMove;
	}

	perform(actor)
	{
		var constraintCylinder = actor.constrainable().constraints["PositionOnCylinder"];

		constraintCylinder.distanceFromCenterAlongAxis += this.distanceToMove;
	}
}
