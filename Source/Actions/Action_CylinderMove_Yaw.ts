
class Action_CylinderMove_Yaw
{
	turnsToMove: number;

	constructor(turnsToMove: number)
	{
		this.turnsToMove = turnsToMove;
	}

	perform(actor: Entity)
	{
		var constraint =
			Constrainable.of(actor).constraintByClassName(Constraint_PositionOnCylinder.name);
		var constraintCylinder = constraint as Constraint_PositionOnCylinder;

		constraintCylinder.yawInTurns += this.turnsToMove;
		NumberHelper.wrapToRangeMinMax(constraintCylinder.yawInTurns, 0, 1);
	}
}
