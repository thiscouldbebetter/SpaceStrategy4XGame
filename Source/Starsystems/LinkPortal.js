
class LinkPortal
{
	constructor(name, defn, pos, starsystemNamesFromAndTo)
	{
		this.name = name;
		this.defn = defn;
		var loc = new Disposition(pos);
		this._locatable = new Locatable(loc);

		this.starsystemNamesFromAndTo = starsystemNamesFromAndTo;
	}

	link(cluster)
	{
		var returnValue = cluster.links[this.starsystemNameFrom()][this.starsystemNameTo()];
		return returnValue;
	}

	locatable()
	{
		return this._locatable;
	}

	starsystemFrom(cluster)
	{
		var starsystemName = this.starsystemNameFrom();
		var returnValue = cluster.nodesByName.get(starsystemName).starsystem;
		return returnValue;
	}

	starsystemNameFrom()
	{
		return this.starsystemNamesFromAndTo[0];
	}

	starsystemNameTo()
	{
		return this.starsystemNamesFromAndTo[1];
	}

	starsystemTo(cluster)
	{
		var starsystemName = this.starsystemNameTo();
		var returnValue = cluster.nodesByName.get(starsystemName).starsystem;
		return returnValue;
	}

	// controls

	controlBuild()
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
