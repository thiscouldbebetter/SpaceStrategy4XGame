
function Buildable(defnName, pos, industrySoFar)
{
	this.defnName = defnName;
	this.loc = new Location(pos);
	this.industrySoFar = industrySoFar;
}
{
	Buildable.prototype.defn = function(world)
	{
		return world.buildables[this.defnName];
	}

	Buildable.prototype.isComplete = function()
	{
		return (this.industrySoFar == null);
	}

	Buildable.prototype.percentageComplete = function(context, universe)
	{
		var defn = this.defn(universe.world);
		var industryToBuild = defn.industryToBuild;
		var fractionComplete = this.industrySoFar / industryToBuild;
		var percentageComplete = Math.floor(fractionComplete * 100) + "%";
		return percentageComplete;
	}

	Buildable.prototype.visual = function(world)
	{
		if (this._visual == null)
		{
			var defnVisual = this.defn(world).visual;
			if (this.industrySoFar == null)
			{
				this._visual = defnVisual;
			}
			else
			{
				this._visual = new VisualGroup
				([
					defnVisual,
					new VisualText(new DataBinding(this, "percentageComplete()"), "White", "Black")
				])
			}
		}

		return this._visual;
	}
}
