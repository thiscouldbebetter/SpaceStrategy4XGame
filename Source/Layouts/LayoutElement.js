
function LayoutElement(defnName, pos)
{
	this.defnName = defnName;
	this.loc = new Location(pos);
}
{
	LayoutElement.prototype.defn = function(world)
	{
		return world.buildables[this.defnName];
	}
}
