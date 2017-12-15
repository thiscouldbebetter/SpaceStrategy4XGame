
function Constraint_LookAt(targetPos)
{
	this.name = "LookAt";
	this.targetPos = targetPos;
}

{
	Constraint_LookAt.prototype.constrain = function(universe, world, place, body)
	{
		var bodyLoc = body.loc;
		var bodyPos = bodyLoc.pos;
		var bodyOrientation = bodyLoc.orientation;

		var bodyOrientationForwardNew = this.targetPos.clone().subtract
		(
			bodyPos
		).normalize();

		bodyOrientation.forwardSet(bodyOrientationForwardNew);
	}
}
