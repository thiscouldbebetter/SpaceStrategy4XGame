
function Constraint_LookAtBody
(
	targetBody
)
{
	this.name = "LookAtBody";
	this.targetBody = targetBody;
}

{
	Constraint_LookAtBody.prototype.applyToBody = function(body)
	{
		var targetPos = this.targetBody; // hack 
		var bodyPos = body.loc.pos

		var bodyOrientationForward = targetPos.clone().subtract
		(
			bodyPos
		).normalize();

		body.orientation = new Orientation
		(
			bodyOrientationForward,
			body.orientation.down	
		);		
	}
}
