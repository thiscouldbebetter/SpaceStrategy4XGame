
function Body(name, defn, pos)
{
	this.name = name;
	this.defn = defn;
	var loc = new Disposition(pos);
	this._locatable = new Locatable(loc);
}
{
	Body.prototype.locatable = function()
	{
		return this._locatable;
	}
}
