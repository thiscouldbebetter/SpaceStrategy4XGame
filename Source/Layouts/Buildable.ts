
class Buildable extends EntityProperty
{
	defnName: string;
	pos: Coords;
	isComplete: boolean;

	_locatable: Locatable;
	_visual: Visual;

	constructor(defnName: string, pos: Coords, isComplete: boolean)
	{
		super();
		this.defnName = defnName;
		var loc = Disposition.fromPos(pos);
		this._locatable = new Locatable(loc);
		this.isComplete = (isComplete || false);
	}

	defn(world: WorldExtended)
	{
		return world.buildableDefnByName(this.defnName);
	}

	locatable()
	{
		return this._locatable;
	}

	visual(world: WorldExtended)
	{
		if (this._visual == null)
		{
			var defnVisual = this.defn(world).visual;
			if (this.isComplete)
			{
				this._visual = defnVisual;
			}
			else
			{
				this._visual = new VisualGroup
				([
					defnVisual,
					VisualText.fromTextAndColor("X", Color.byName("White"))
				]);
			}
		}

		return this._visual;
	}
}
