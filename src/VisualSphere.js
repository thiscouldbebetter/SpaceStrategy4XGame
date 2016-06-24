
function VisualSphere(color, radius)
{
	this.color = color;
	this.radius = radius;
}

{
	VisualSphere.prototype.draw = function(drawPos)
	{
		var radius = this.radius;
		var graphics = Globals.Instance.displayHelper.graphics;
		graphics.strokeStyle = this.color.systemColor;

		graphics.beginPath();
		graphics.arc
		(
			drawPos.x, drawPos.y, 
			radius, 
			0, 2 * Math.PI, // start and stop angles 
			false // counterClockwise
		);
		graphics.stroke();
	}
}
