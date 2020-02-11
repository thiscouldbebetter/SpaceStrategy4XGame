
function Action_CylinderMove_DistanceAlongAxis(distanceToMove)
{
	this.distanceToMove = distanceToMove;
}

{
	Action_CylinderMove_DistanceAlongAxis.prototype.perform = function(actor)
	{
		var constraintCylinder = actor.constrainable.constraints["PositionOnCylinder"];

		constraintCylinder.distanceFromCenterAlongAxis += this.distanceToMove;
	};
}
