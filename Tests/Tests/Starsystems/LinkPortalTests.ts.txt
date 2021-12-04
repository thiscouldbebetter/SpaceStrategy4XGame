
class LinkPortal extends Entity
{
	name: string;
	defn: BodyDefn;
	starsystemNamesFromAndTo: string[];

	constructor
	(
		name: string, defn: BodyDefn, pos: Coords, starsystemNamesFromAndTo: string[]
	)
	{
		super
		(
			name,
			[
				defn,
				Locatable.fromPos(pos)
			]
		);

		this.defn = defn;

		this.starsystemNamesFromAndTo = starsystemNamesFromAndTo;
	}

	link(cluster: Network2): NetworkLink2
	{
		var returnValue = cluster.linkByStarsystemNamesFromTo
		(
			this.starsystemNameFrom(), this.starsystemNameTo()
		);
		return returnValue;
	}

	starsystemFrom(cluster: Network2): Starsystem
	{
		var starsystemName = this.starsystemNameFrom();
		var returnValue = cluster.nodesByName.get(starsystemName).starsystem;
		return returnValue;
	}

	starsystemNameFrom(): string
	{
		return this.starsystemNamesFromAndTo[0];
	}

	starsystemNameTo(): string
	{
		return this.starsystemNamesFromAndTo[1];
	}

	starsystemTo(cluster: Network2): Starsystem
	{
		var starsystemName = this.starsystemNameTo();
		var returnValue = cluster.nodesByName.get(starsystemName).starsystem;
		return returnValue;
	}

	// controls

	toControl(): ControlBase
	{
		var returnValue = ControlLabel.from5
		(
			"labelLinkPortalAsSelection",
			Coords.fromXY(0, 0),
			Coords.fromXY(0, 0), // this.size
			false, // isTextCentered
			DataBinding.fromContext("Link to " + this.starsystemNamesFromAndTo[1])
		);

		return returnValue;
	}
}
