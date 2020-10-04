
class Action_CylinderMove_Yaw
{
	constructor(turnsToMove)
	{
		this.turnsToMove = turnsToMove;
	}

	perform(actor)
	{
		var constraintCylinder = actor.constrainable().constraints["PositionOnCylinder"];

		constraintCylinder.yawInTurns += this.turnsToMove;
		constraintCylinder.yawInTurns.wrapToRangeMinMax(0, 1);
	}
}
