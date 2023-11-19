
class LinkPortal extends Entity
{
	name: string;
	defn: BodyDefn;
	starsystemNamesFromAndTo: string[];

	constructor
	(
		name: string,
		defn: BodyDefn,
		pos: Coords,
		starsystemNamesFromAndTo: string[]
	)
	{
		super
		(
			name,
			[
				defn,
				Collidable.fromCollider
				(
					Sphere.fromRadiusAndCenter
					(
						VisualStar.radiusActual(), pos
					)
				),
				Locatable.fromPos(pos)
			]
		);

		this.defn = defn;

		this.starsystemNamesFromAndTo = starsystemNamesFromAndTo;
	}

	static bodyDefn(): BodyDefn
	{
		var bodyDefnLinkPortal = new BodyDefn
		(
			"LinkPortal",
			Coords.fromXY(10, 10), // size
			new VisualGroup
			([
				new VisualCircleGradient
				(
					10, // radius
					new ValueBreakGroup
					(
						[
							new ValueBreak(0, Color.byName("Black") ),
							new ValueBreak(.5, Color.byName("Black") ),
							new ValueBreak(.75, Color.byName("Violet") ),
							new ValueBreak(1, Color.byName("Blue") )
						],
						null // interpolationMode
					),
					null // colorBorder
				)
			])
		);

		return bodyDefnLinkPortal;
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
		var returnValue = new ControlLabel
		(
			"labelLinkPortalAsSelection",
			Coords.fromXY(0, 0),
			Coords.fromXY(0, 0), // this.size
			false, // isTextCenteredHorizontally
			false, // isTextCenteredVertically
			DataBinding.fromContext("Link to " + this.starsystemNamesFromAndTo[1]),
			FontNameAndHeight.fromHeightInPixels(10)
		);

		return returnValue;
	}
}
