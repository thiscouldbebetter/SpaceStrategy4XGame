
class Action_CylinderMove_Yaw
{
	constructor(turnsToMove)
	{
		this.turnsToMove = turnsToMove;
	}

	perform(actor)
	{
		var constraintCylinder =
			actor.constrainable().constraintsByName.get("PositionOnCylinder");

		constraintCylinder.yawInTurns += this.turnsToMove;
		NumberHelper.wrapToRangeMinMax(constraintCylinder.yawInTurns, 0, 1);
	}
}
