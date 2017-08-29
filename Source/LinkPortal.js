
function LinkPortal(name, defn, pos, starsystemNamesFromAndTo)
{
	this.name = name;
	this.defn = defn;
	this.loc = new Location(pos);

	this.starsystemNamesFromAndTo = starsystemNamesFromAndTo;
}

{
	LinkPortal.prototype.link = function()
	{
		// todo
	}

	LinkPortal.prototype.starsystemNameTo = function()
	{
		return this.starsystemNamesFromAndTo[0];
	}

	// controls

	LinkPortal.prototype.controlBuild_Selection = function()
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
	}
}
