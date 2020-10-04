
class Action_CylinderMove_Radius
{
	constructor(distanceToMove)
	{
		this.distanceToMove = distanceToMove;
	}

	perform(actor)
	{
		var constraintCylinder = actor.constrainable().constraints["PositionOnCylinder"];

		constraintCylinder.radius += this.distanceToMove;
	}
}
