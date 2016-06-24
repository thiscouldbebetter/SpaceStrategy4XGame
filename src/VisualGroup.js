
function VisualGroup(visuals)
{
	this.visuals = visuals;	
}

{
	VisualGroup.prototype.draw = function(drawPos)
	{
		for (var i = 0; i < this.visuals.length; i++)
		{
			var visual = this.visuals[i];
			visual.draw(drawPos);
		}
	}
}
