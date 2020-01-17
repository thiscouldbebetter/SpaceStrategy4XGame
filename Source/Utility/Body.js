
function Body(name, defn, pos)
{
	this.name = name;
	this.defn = defn;
	var loc = new Location(pos);
	this.Locatable = new Locatable(loc);
}
