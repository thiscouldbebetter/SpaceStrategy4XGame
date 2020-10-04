
class Constraint_HoldDistanceFromTarget
{
	constructor(distanceToHold, targetPos)
	{
		this.name = "HoldDistanceFromTarget";
		this.distanceToHold = distanceToHold;
		this.targetPos = targetPos;

		this.displacement = new Coords();
	}

	constrain(universe, world, place, body)
	{
		var bodyPos = body.locatable().loc.pos;

		var directionOfBodyFromTarget = this.displacement.overwriteWith
		(
			bodyPos
		).subtract
		(
			this.targetPos
		).normalize();

		bodyPos.overwriteWith
		(
			directionOfBodyFromTarget
		).multiplyScalar
		(
			this.distanceToHold
		).add
		(
			this.targetPos
		).round();
	}
}
