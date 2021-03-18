
class Cursor
{
	constructor()
	{
		this.bodyUnderneath = null;

		this.bodyParent = null;
		this.orderName = null;
		this.mustTargetBody = null;
		this.hasXYPositionBeenSpecified = false;
		this.hasZPositionBeenSpecified = false;

		this.defn = this.bodyDefn();

		var loc = new Disposition(new Coords(0, 0, 0));
		this._locatable = new Locatable(loc);

		var constrainable = new Constrainable
		([
			new Constraint_Cursor()
		]);
		this.constrainable = () => constrainable;
	}

	bodyDefn()
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
						new VisualCircle(radius, null, color),
						new VisualLine(new Coords(-radius, 0), new Coords(radius, 0), color),
						new VisualLine(new Coords(0, -radius), new Coords(0, radius), color),
					])
				]
			]),
			(universe, world, place, entity, display) => // selectChildNames
			{
				var returnValue;
				var cursor = entity;
				if (cursor.bodyParent == null)
				{
					returnValue = "_0";
				}
				else if (cursor.mustTargetBody)
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
			new DataBinding
			(
				this,
				(c) =>
				{
					var returnValue;
					if (c.bodyUnderneath == null)
					{
						returnValue = "";
					}
					else
					{
						returnValue = c.bodyUnderneath.name;
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
			new Coords(1, 1).multiplyScalar(radius * 2), // size
			visual
		);

		return bodyDefn;
	}

	clear()
	{
		this.bodyParent = null;
		this.orderName = null;
		this.hasXYPositionBeenSpecified = false;
		this.hasZPositionBeenSpecified = false;
	}

	locatable()
	{
		return this._locatable;
	}

	set(actor, orderName, mustTargetBody)
	{
		this.bodyParent = actor;
		this.orderName = orderName;
		this.mustTargetBody = mustTargetBody;
	}

	// controls

	controlBuild(universe, controlSize)
	{
		return this.bodyParent.controlBuild(universe, controlSize);
	}

	// drawable

	draw(universe, world, place, entity, display)
	{
		var venueStarsystem = place;
		var starsystem = venueStarsystem.starsystem;
		starsystem.draw_Body
		(
			universe,
			world,
			place,
			this,
			display
		);
	}
}
