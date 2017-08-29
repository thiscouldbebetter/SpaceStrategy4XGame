
function Action_CylinderMove_Yaw(cyclesToMove)
{
	this.cyclesToMove = cyclesToMove;
}

{
	Action_CylinderMove_Yaw.prototype.perform = function(actor)
	{
		var constraintCylinder = actor.constraints["PositionOnCylinder"];

		constraintCylinder.yaw = NumberHelper.wrapValueToRangeMinMax
		(
			constraintCylinder.yaw + this.cyclesToMove,
			0, 
			1
		);
	}
}
