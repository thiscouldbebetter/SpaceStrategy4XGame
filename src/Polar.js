
function Polar(azimuth, elevation, radius)
{
	// values in radians

	this.azimuth = azimuth;
	this.elevation = elevation;
	this.radius = radius;
}

{
	// constants

	Polar.RadiansPerCycle = Math.PI * 2;
	Polar.RadiansPerRightAngle = Math.PI / 2;

	// static methods

	Polar.fromCoords = function(coordsToConvert)
	{
		var azimuthInRadians = Math.atan2(coordsToConvert.y, coordsToConvert.x);
		var azimuth = azimuthInRadians / Polar.RadiansPerCycle;
		if (azimuth < 0)
		{
			azimuth += 1;
		}

		var radius = coordsToConvert.magnitude();

		var elevationInRadians = Math.asin(coordsToConvert.z / radius);
		var elevation = elevationInRadians / Polar.RadiansPerRightAngle;

		var returnValue = new Polar
		(
			azimuth,
			elevation,
			radius
		);

		return returnValue;
	}

	// instance methods

	Polar.random = function()
	{
		return new Polar
		(
			Math.random(),
			Math.random() * 2 - 1,
			Math.random()
		);
	}

	Polar.prototype.toCoords = function()
	{
		var azimuthInRadians = this.azimuth * Polar.RadiansPerCycle;
		var elevationInRadians = this.elevation * Polar.RadiansPerRightAngle;
		var cosineOfElevation = Math.cos(elevationInRadians);

		var returnValue = new Coords
		(
			Math.cos(azimuthInRadians) * cosineOfElevation,
			Math.sin(azimuthInRadians) * cosineOfElevation,
			Math.sin(elevationInRadians)
		).multiplyScalar(this.radius);

		return returnValue;
	}
}
