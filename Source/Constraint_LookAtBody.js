
function Constraint_LookAtBody(targetBody)
{
	this.name = "LookAtBody";
	this.targetBody = targetBody;
}

{
	Constraint_LookAtBody.prototype.applyToBody = function(body)
	{
		var targetPos = this.targetBody; // hack 

		var bodyLoc = body.loc;
		var bodyPos = bodyLoc.pos;
		var bodyOrientation = bodyLoc.orientation;

		var bodyOrientationForwardNew = targetPos.clone().subtract
		(
			bodyPos
		).normalize();

		bodyOrientation.forwardSet(bodyOrientationForwardNew);
	}
}
