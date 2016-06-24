
function Gradient(stops)
{
	this.stops = stops;
}

{
	Gradient.prototype.toSystemGraphicsStyle = function(graphics, center, radius)
	{
		var returnValue = graphics.createRadialGradient
		(
			center.x,
			center.y,
			0, // startRadius
			center.x, 
			center.y,
			radius
		);

		for (var i = 0; i < this.stops.length; i++)
		{
			var stop = this.stops[i];

			returnValue.addColorStop(stop.position, stop.systemColor);
			returnValue.addColorStop(stop.position, stop.systemColor);
		}

		return returnValue;
	}
}
