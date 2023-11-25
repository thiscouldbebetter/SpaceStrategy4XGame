
class NetworkNode2 extends Entity
{
	defn: NetworkNodeDefn;
	starsystem: Starsystem;

	drawPos: Coords;
	drawLoc: Disposition;

	constructor
	(
		name: string,
		defn: NetworkNodeDefn,
		pos: Coords,
		star: Star,
		starsystem: Starsystem
	)
	{
		super
		(
			name,
			[
				Collidable.fromCollider
				(
					Sphere.fromRadiusAndCenter
					(
						VisualStar.radiusActual(), pos
					)
				),
				new Controllable(NetworkNode2.toControl),
				Drawable.fromVisual(star.starType.visualFromOutside() ),
				Locatable.fromPos(pos)
			]
		);
		this.defn = defn;
		this.starsystem = starsystem;

		// Helper variables.
		this.drawPos = Coords.create();
		this.drawLoc = Disposition.fromPos(this.drawPos);
	}

	// Controls.

	static toControl
	(
		uwpe: UniverseWorldPlaceEntities,
		size: Coords,
		controlTypeName: string
	): ControlBase
	{
		var universe = uwpe.universe;
		var world = universe.world as WorldExtended;
		var networkNode = uwpe.entity as NetworkNode2;

		var viewSize = universe.display.sizeInPixels;
		var containerSize = size;
		var margin = 10;
		var controlSpacing = 8;
		var fontHeightInPixels = margin;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
		var buttonSize = Coords.fromXY
		(
			containerSize.x - margin * 4,
			10
		);

		var labelStarsystemName = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin),
			Coords.fromXY(0, 0), // this.size
			DataBinding.fromContext(this.name),
			fontNameAndHeight
		);

		var labelStarsystemHolder = ControlLabel.from4Uncentered
		(
			Coords.fromXY(margin, margin + controlSpacing),
			Coords.fromXY(0, 0), // this.size
			DataBinding.fromContextAndGet
			(
				networkNode,
				(c) => (c.starsystem == null ? "?" : c.starsystem.faction(world).name)
			),
			fontNameAndHeight
		);

		var buttonView = ControlButton.from5
		(
			Coords.fromXY(margin, margin + controlSpacing * 2), // pos
			buttonSize, // size
			"View",
			fontNameAndHeight,
			() => // click
			{
				var venueCurrent =
					universe.venueCurrent() as VenueWorldExtended;
				var starsystemToView =
					(venueCurrent.selectedEntity as NetworkNode2).starsystem;
				if (starsystemToView != null)
				{
					universe.venueTransitionTo
					(
						new VenueStarsystem(venueCurrent, starsystemToView)
					);
				}
			}
		);

		var returnValue = ControlContainer.from4
		(
			"containerStarsystem",
			Coords.fromXY(viewSize.x - margin - containerSize.x, margin), // pos
			Coords.fromXY(containerSize.x - margin * 2, 40), // size
			// children
			[
				labelStarsystemName,
				labelStarsystemHolder,
				buttonView
			]
		);

		return returnValue;
	}

	// Drawable.

	draw(uwpe: UniverseWorldPlaceEntities): void
	{
		var visual = this.drawable().visual;
		visual.draw(uwpe, uwpe.universe.display);
	}
}