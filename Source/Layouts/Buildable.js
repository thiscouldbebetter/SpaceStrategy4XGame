
class Buildable
{
	constructor(defnName, pos, isComplete)
	{
		this.defnName = defnName;
		var loc = new Disposition(pos);
		this._locatable = new Locatable(loc);
		this.isComplete = (isComplete || false);
	}

	defn(world)
	{
		return world.buildables[this.defnName];
	}

	locatable()
	{
		return this._locatable;
	}

	visual(world)
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
					new VisualText
					(
						DataBinding.fromContext("X"),
						null, // height
						Color.byName("White"),
						Color.byName("Black")
					)
				]);
			}
		}

		return this._visual;
	}
}
