
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
		var color = Color.Instances().White;
		
		var visualCrosshairs = new VisualGroup
		([
			VisualCircle.fromRadiusAndColors(radius, null, color),
			new VisualLine
			(
				Coords.fromXY(-radius, 0), Coords.fromXY(radius, 0), color, null
			),
			new VisualLine
			(
				Coords.fromXY(0, -radius), Coords.fromXY(0, radius), color, null
			),
		]);

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
		);

		var visualHover = new VisualText
		(
			DataBinding.fromContextAndGet
			(
				this,
				(c: Cursor) =>
				{
					var returnValue;
					if (c.entityUnderneath == null)
					{
						returnValue = "";
					}
					else
					{
						returnValue = c.entityUnderneath.name;
					}
					return returnValue;
				} 
			),
			null, // heightInPixels
			Color.byName("Gray"),
			Color.byName("White")
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
}
