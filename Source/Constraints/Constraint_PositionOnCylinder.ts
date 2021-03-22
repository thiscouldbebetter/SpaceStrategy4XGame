
class Constraint_PositionOnCylinder implements Constraint
{
	name: string;
	center: Coords;
	orientation: Orientation;
	yawInTurns: number;
	radius: number;
	distanceFromCenterAlongAxis: number;

	constructor
	(
		center: Coords,
		orientation: Orientation,
		yawInTurns: number,
		radius: number,
		distanceFromCenterAlongAxis: number
	)
	{
		this.name = "PositionOnCylinder";
		this.center = center;
		this.orientation = orientation;
		this.yawInTurns = yawInTurns;
		this.radius = radius;
		this.distanceFromCenterAlongAxis = distanceFromCenterAlongAxis;
	}

	constrain(universe: Universe, world: World, place: Place, constrainable: Entity)
	{
		var body = constrainable;

		NumberHelper.wrapToRangeMinMax(this.yawInTurns, 0, 1);
		var yawInRadians = this.yawInTurns * Polar.RadiansPerTurn;

		var bodyLoc = body.locatable().loc;
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

		);

		bodyOrientation.overwriteWith(this.orientation);
	}
}
