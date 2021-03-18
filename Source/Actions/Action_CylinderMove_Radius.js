
class Action_CylinderMove_Radius
{
	constructor(distanceToMove)
	{
		this.distanceToMove = distanceToMove;
	}

	perform(actor)
	{
		var constraintCylinder =
			actor.constrainable().constraintsByName.get("PositionOnCylinder");

		constraintCylinder.radius += this.distanceToMove;
	}
}
