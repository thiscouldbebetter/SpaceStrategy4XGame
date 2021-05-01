
class Cursor extends Entity
{
	entityUnderneath: Entity;
	entityParent: Entity;
	orderName: string;
	mustTargetEntity: boolean;
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

		this.entityUnderneath = null;

		this.entityParent = null;
		this.orderName = null;
		this.mustTargetEntity = null;
		this.hasXYPositionBeenSpecified = false;
		this.hasZPositionBeenSpecified = false;

		this.defn = this.bodyDefn();
	}

	bodyDefn(): BodyDefn
	{
		var radius = 5;
		var color = Color.Instances().White;
		var visualReticle = new VisualSelect
		(
			new Map
			([
				[ "_0", new VisualNone() ],
				[
					"_1",
					new VisualGroup
					([
						new VisualCircle(radius, null, color, null),
						new VisualLine
						(
							Coords.fromXY(-radius, 0), Coords.fromXY(radius, 0), color, null
						),
						new VisualLine
						(
							Coords.fromXY(0, -radius), Coords.fromXY(0, radius), color, null
						),
					])
				]
			]),
			// selectChildNames
			(
				universe: Universe, world: World, place: Place,
				entity: Entity, display: Display
			) =>
			{
				var returnValue;
				var cursor = entity as Cursor;
				if (cursor.entityParent == null)
				{
					returnValue = "_0";
				}
				else if (cursor.mustTargetEntity)
				{
					returnValue = "_1";
				}
				else
				{
					returnValue = "_1";
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
			false, // shouldTextContextBeReset
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
		this.entityParent = null;
		this.orderName = null;
		this.hasXYPositionBeenSpecified = false;
		this.hasZPositionBeenSpecified = false;
	}

	set(entity: Entity, orderName: string, mustTargetEntity: boolean): void
	{
		this.entityParent = entity;
		this.orderName = orderName;
		this.mustTargetEntity = mustTargetEntity;
	}

	// controls

	toControl(universe: Universe, controlSize: Coords): ControlBase
	{
		return this.entityParent.controllable().toControl(universe, controlSize);
	}

	// drawable

	draw
	(
		universe: Universe, world: WorldExtended, place: Place, entity: Entity,
		display: Display
	): void
	{
		var venue = universe.venueCurrent;
		var venueTypeName = venue.constructor.name;
		if (venueTypeName == VenueFader.name)
		{
			venue = (venue as VenueFader).venueCurrent();
		}

		var venueStarsystem = venue as VenueStarsystem;
		var starsystem = venueStarsystem.starsystem;
		starsystem.draw_Body
		(
			universe, world, place, this, display
		);
	}
}
