
function LinkPortal(name, defn, pos, starsystemNamesFromAndTo)
{
	this.name = name;
	this.defn = defn;
	var loc = new Location(pos);
	this.Locatable = new Locatable(loc);

	this.starsystemNamesFromAndTo = starsystemNamesFromAndTo;
}

{
	LinkPortal.prototype.link = function(cluster)
	{
		var returnValue = cluster.links[this.starsystemNameFrom()][this.starsystemNameTo()];
		return returnValue;
	};

	LinkPortal.prototype.starsystemFrom = function(cluster)
	{
		var starsystemName = this.starsystemNameFrom();
		var returnValue = cluster.nodes[starsystemName].starsystem;
		return returnValue;
	};

	LinkPortal.prototype.starsystemNameFrom = function()
	{
		return this.starsystemNamesFromAndTo[0];
	};

	LinkPortal.prototype.starsystemNameTo = function()
	{
		return this.starsystemNamesFromAndTo[1];
	};

	LinkPortal.prototype.starsystemTo = function(cluster)
	{
		var starsystemName = this.starsystemNameTo();
		var returnValue = cluster.nodes[starsystemName].starsystem;
		return returnValue;
	};

	// controls

	LinkPortal.prototype.controlBuild = function()
	{
		var returnValue = new ControlLabel
		(
			"labelLinkPortalAsSelection",
			new Coords(0, 0),
			new Coords(0, 0), // this.size
			false, // isTextCentered
			new DataBinding("Link to " + this.starsystemNamesFromAndTo[1])
		);

		return returnValue;
	};
}
