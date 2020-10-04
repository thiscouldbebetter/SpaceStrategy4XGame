
class Body
{
	constructor(name, defn, pos)
	{
		this.name = name;
		this.defn = defn;
		var loc = new Disposition(pos);
		this._locatable = new Locatable(loc);
	}

	locatable()
	{
		return this._locatable;
	}
}
