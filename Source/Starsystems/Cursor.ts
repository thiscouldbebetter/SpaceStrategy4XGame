
class Cursor extends Entity
{
	entityUsingCursorToTarget: Entity;
	entityUnderneath: Entity;
	hasXYPositionBeenSpecified: boolean;
	hasZPositionBeenSpecified: boolean;

	defn: any;

	constructor()
	{
		super
		(
			Cursor.name,
			[
				new Constrainable
				([
					new Constraint_Cursor()
				]),
				Locatable.fromPos(Coords.create())
			]
		)
		this.propertyAdd
		(
			this.bodyDefn()
		);

		this.entityUsingCursorToTarget = null;
		this.entityUnderneath = null;

		this.hasXYPositionBeenSpecified = false;
		this.hasZPositionBeenSpecified = false;

		this.defn = this.bodyDefn();
	}

	bodyDefn(): BodyDefn
	{
		var radius = 5;
		var colors = Color.Instances();
		var colorWhite = colors.White;
		
		var visualCrosshairs = new VisualGroup
		([
			VisualCircle.fromRadiusAndColors(radius, null, colorWhite),
			new VisualLine
			(
				Coords.fromXY(-radius, 0), Coords.fromXY(radius, 0), colorWhite, null
			),
			new VisualLine
			(
				Coords.fromXY(0, -radius), Coords.fromXY(0, radius), colorWhite, null
			),
		]);

		var cursor = this;

		var visualReticle = new VisualSelect
		(
			new Map
			([
				[ "None", new VisualNone() ],
				[ "Crosshairs", visualCrosshairs ]
			]),
			// selectChildNames
			(
				uwpe: UniverseWorldPlaceEntities, display: Display
			) =>
				cursor.visualReticleSelectChildNames(uwpe, display)

		);

		var visualHover = new VisualText
		(
			DataBinding.fromContextAndGet
			(
				UniverseWorldPlaceEntities.create(), // hack - See VisualText.draw().
				(uwpe: UniverseWorldPlaceEntities) => cursor.visualHoverTextGet(uwpe)
			),
			FontNameAndHeight.fromHeightInPixels(20),
			colors.Black,
			colors.White
		);

		var visual = new VisualGroup
		([
			visualHover,
			visualReticle
		]);

		var bodyDefn = new BodyDefn
		(
			"Cursor",
			Coords.fromXY(1, 1).multiplyScalar(radius * 2), // size
			visual
		);

		return bodyDefn;
	}

	clear(): void
	{
		this.entityUsingCursorToTarget = null;
		this.hasXYPositionBeenSpecified = false;
		this.hasZPositionBeenSpecified = false;
	}

	// drawable

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var universe = uwpe.universe;

		var venue = universe.venueCurrent();
		var venueTypeName = venue.constructor.name;
		if (venueTypeName == VenueFader.name)
		{
			venue = (venue as VenueFader).venueCurrent();
		}

		var venueStarsystem = venue as VenueStarsystem;
		var starsystem = venueStarsystem.starsystem;
		starsystem.draw_Body(uwpe, display);
	}

	visualHoverTextGet(uwpe: UniverseWorldPlaceEntities)
	{
		var returnValue;

		var venue = uwpe.universe.venueCurrent() as VenueStarsystem;
		var c = venue.cursor;
		if (c == null)
		{
			returnValue = "";
		}
		else
		{
			var world = uwpe.world as WorldExtended;

			if (c.entityUnderneath == null)
			{
				returnValue = "";
			}
			else if (c.entityUnderneath.constructor.name == LinkPortal.name)
			{
				var linkPortal = c.entityUnderneath as LinkPortal;
				returnValue =
					linkPortal.nameAccordingToFactionPlayerKnowledge(world);
			}
			else
			{
				returnValue = c.entityUnderneath.name;
			}
		}

		return returnValue;
	}

	visualReticleSelectChildNames
	(
		uwpe: UniverseWorldPlaceEntities, display: Display
	)
	{
		var returnValue;
		var cursor = uwpe.entity as Cursor;
		if (cursor.entityUsingCursorToTarget == null)
		{
			returnValue = "None";
		}
		else
		{
			returnValue = "Crosshairs";
		}
		return [ returnValue ];
	}


}
