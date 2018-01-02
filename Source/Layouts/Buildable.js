
function Buildable(defnName, pos, isComplete)
{
	this.defnName = defnName;
	this.loc = new Location(pos);
	this.isComplete = isComplete;
}
{
	Buildable.prototype.defn = function(world)
	{
		return world.buildables[this.defnName];
	}

	Buildable.prototype.visual = function(world)
	{
		if (this._visual == null)
		{
			var defnVisual = this.defn(world).visual;
			if (this.isComplete == true)
			{
				this._visual = defnVisual;
			}
			else
			{
				this._visual = new VisualGroup
				([
					defnVisual,
					new VisualText("X", "White", "Black")
				])
			}
		}

		return this._visual;
	}
}
