
function Constraint_HoldDistanceFromTarget(distanceToHold, targetPos)
{
	this.name = "HoldDistanceFromTarget";
	this.distanceToHold = distanceToHold;
	this.targetPos = targetPos;

	this.displacement = new Coords();
}

{
	Constraint_HoldDistanceFromTarget.prototype.constrain = function(universe, world, place, body)
	{
		var bodyPos = body.loc.pos;

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
	};
}
