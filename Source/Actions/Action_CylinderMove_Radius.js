
function Action_CylinderMove_Radius(distanceToMove)
{
	this.distanceToMove = distanceToMove;
}

{
	Action_CylinderMove_Radius.prototype.perform = function(actor)
	{
		var constraintCylinder = actor.constrainable.constraints["PositionOnCylinder"];

		constraintCylinder.radius += this.distanceToMove;
	};
}
