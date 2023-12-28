
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
				new Controllable(LinkPortal.toControl),
				Drawable.fromVisual(LinkPortal.visualProjected() ),
				Locatable.fromPos(pos)
			]
		);

		this.defn = defn;

		this.starsystemNamesFromAndTo = starsystemNamesFromAndTo;
	}

	static bodyDefn(): BodyDefn
	{
		var visual = LinkPortal.visualBeforeProjection();

		var bodyDefnLinkPortal = new BodyDefn
		(
			"LinkPortal",
			Coords.fromXY(10, 10), // size
			visual
		);

		return bodyDefnLinkPortal;
	}

	link(cluster: StarCluster): StarClusterLink
	{
		var returnValue = cluster.linkByStarsystemNamesFromTo
		(
			this.starsystemNameFrom(), this.starsystemNameTo()
		);
		return returnValue;
	}

	starsystemFrom(cluster: StarCluster): Starsystem
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

	starsystemTo(cluster: StarCluster): Starsystem
	{
		var starsystemName = this.starsystemNameTo();
		var returnValue = cluster.nodesByName.get(starsystemName).starsystem;
		return returnValue;
	}

	// controls

	static toControl
	(
		uwpe: UniverseWorldPlaceEntities,
		size: Coords,
		controlTypeName: string
	): ControlBase
	{
		var linkPortal = uwpe.entity as LinkPortal;

		var returnValue = ControlLabel.from4Uncentered
		(
			Coords.fromXY(0, 0),
			size,
			DataBinding.fromContext("Link to " + linkPortal.starsystemNamesFromAndTo[1]),
			FontNameAndHeight.fromHeightInPixels(10)
		);

		return returnValue;
	}

	// Drawable.

	static visualBeforeProjection(): VisualBase
	{
		var colors = Color.Instances();

		var radius = 10;

		var visual: VisualBase = new VisualCircleGradient
		(
			radius,
			new ValueBreakGroup
			(
				[
					new ValueBreak(0, colors.Black),
					new ValueBreak(.5, colors.Black),
					new ValueBreak(.75, colors.Violet),
					new ValueBreak(1, colors.Blue)
				],
				null // interpolationMode
			),
			null // colorBorder
		);

		visual = new VisualGroup
		([
			visual
		]);

		return visual;
	}

	static visualProjected(): VisualBase
	{
		var visualBeforeProjection = this.visualBeforeProjection();

		var visual: VisualBase = new VisualCameraProjection
		(
			uwpe => (uwpe.place as Starsystem).camera2(uwpe.universe),
			visualBeforeProjection
		);

		var visualWithStem = new VisualGroup
		([
			new VisualElevationStem(),
			visual
		]);

		return visualWithStem;
	}
}
