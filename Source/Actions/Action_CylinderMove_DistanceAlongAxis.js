
class Action_CylinderMove_DistanceAlongAxis
{
	constructor(distanceToMove)
	{
		this.distanceToMove = distanceToMove;
	}

	perform(actor)
	{
		var constraintCylinder =
			actor.constrainable().constraintsByName.get("PositionOnCylinder");

		constraintCylinder.distanceFromCenterAlongAxis += this.distanceToMove;
	}
}
