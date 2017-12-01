
function Constraint_PositionOnCylinder
(
	center, orientation, yawInTurns, radius, distanceFromCenterAlongAxis
)
{
	this.name = "PositionOnCylinder";
	this.center = center;
	this.orientation = orientation;
	this.yawInTurns = yawInTurns;
	this.radius = radius;
	this.distanceFromCenterAlongAxis = distanceFromCenterAlongAxis;
}

{
	Constraint_PositionOnCylinder.prototype.applyToBody = function(universe, body)
	{
		this.yawInTurns.wrapToRangeMinMax(0, 1);
		var yawInRadians = this.yawInTurns * Polar.RadiansPerTurn;

		var bodyLoc = body.loc;
		var bodyPos = bodyLoc.pos;
		var bodyOrientation = bodyLoc.orientation;

		bodyPos.overwriteWith
		(
			this.orientation.down
		).multiplyScalar
		(
			this.distanceFromCenterAlongAxis
		).add
		(
			this.center
		).add
		(
			this.orientation.forward.clone().multiplyScalar
			(
				Math.cos(yawInRadians)
			).add
			(
				this.orientation.right.clone().multiplyScalar
				(
					Math.sin(yawInRadians)
				)
			).multiplyScalar
			(
				this.radius
			)

		)

		bodyOrientation.overwriteWith(this.orientation);
	}
}
