
function Action_CylinderMove_Yaw(turnsToMove)
{
	this.turnsToMove = turnsToMove;
}

{
	Action_CylinderMove_Yaw.prototype.perform = function(actor)
	{
		var constraintCylinder = actor.constrainable.constraints["PositionOnCylinder"];

		constraintCylinder.yawInTurns += this.turnsToMove;
		constraintCylinder.yawInTurns.wrapToRangeMinMax(0, 1);
	};
}
