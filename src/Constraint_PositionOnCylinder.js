
function Constraint_PositionOnCylinder
(
	center, orientation, yaw, radius, distanceFromCenterAlongAxis
)
{
	this.name = "PositionOnCylinder";
	this.center = center;
	this.orientation = orientation;
	this.yaw = yaw;
	this.radius = radius;
	this.distanceFromCenterAlongAxis = distanceFromCenterAlongAxis;
}

{
	Constraint_PositionOnCylinder.prototype.applyToBody = function(body)
	{
		this.yaw = NumberHelper.wrapValueToRangeMinMax(this.yaw, 0, 1);
		var yawInRadians = this.yaw * Polar.RadiansPerCycle;

		var bodyPos = body.loc.pos;		

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

		body.orientation.overwriteWith(this.orientation);
	}	
}
