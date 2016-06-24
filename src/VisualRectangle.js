
function VisualRectangle(color, size)
{
	this.color = color;
	this.size = size;
	this.sizeHalf = this.size.clone().divideScalar(2);
}

{
	VisualRectangle.prototype.draw = function(drawPos)
	{
		var graphics = Globals.Instance.displayHelper.graphics;
		graphics.strokeStyle = this.color.systemColor;

		graphics.beginPath();
		graphics.strokeRect
		(
			drawPos.x - this.sizeHalf.x, 
			drawPos.y - this.sizeHalf.y, 
			this.size.x, this.size.y
		);
		graphics.stroke();
	}
}
