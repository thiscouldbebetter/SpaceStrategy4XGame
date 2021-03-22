
class Body extends EntityProperty
{
	name: string;
	defn: BodyDefn;
	_locatable: Locatable;

	constructor(name: string, defn: BodyDefn, pos: Coords)
	{
		super();
		this.name = name;
		this.defn = defn;
		var loc = Disposition.fromPos(pos);
		this._locatable = new Locatable(loc);
	}

	locatable()
	{
		return this._locatable;
	}
}
