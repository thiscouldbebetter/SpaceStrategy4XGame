
function VisualText(text)
{
	this.text = text;
}

{
	VisualText.prototype.draw = function(drawPos)
	{
		var graphics = Globals.Instance.displayHelper.graphics;
		graphics.fillStyle = "LightGray";
		graphics.fillText
		(
			this.text,
			drawPos.x, drawPos.y
		);
	}
}
