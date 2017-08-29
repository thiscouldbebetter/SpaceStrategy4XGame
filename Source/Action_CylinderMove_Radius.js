
function Action_CylinderMove_Radius(distanceToMove)
{
	this.distanceToMove = distanceToMove;
}

{
	Action_CylinderMove_Radius.prototype.perform = function(actor)
	{
		var constraintCylinder = actor.constraints["PositionOnCylinder"];

		constraintCylinder.radius += this.distanceToMove;
	}
}
