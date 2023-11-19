
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
				Drawable.fromVisual(NetworkNode2.visualBuild()),
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

		var returnValue = ControlContainer.from4
		(
			"containerStarsystem",
			Coords.fromXY(viewSize.x - margin - containerSize.x, margin), // pos
			Coords.fromXY(containerSize.x - margin * 2, 40), // size
			// children
			[
				new ControlLabel
				(
					"labelStarsystemName",
					Coords.fromXY(margin, margin),
					Coords.fromXY(0, 0), // this.size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext(this.name),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"labelStarsystemHolder",
					Coords.fromXY(margin, margin + controlSpacing),
					Coords.fromXY(0, 0), // this.size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						networkNode,
						(c) => (c.starsystem == null ? "?" : c.starsystem.faction(world).name)
					),
					fontNameAndHeight
				),

				ControlButton.from8
				(
					"buttonView",
					Coords.fromXY(margin, margin + controlSpacing * 2), // pos
					buttonSize, // size
					"View",
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venueCurrent =
							universe.venueCurrent as VenueWorldExtended;
						var starsystemToView =
							(venueCurrent.selectedEntity as NetworkNode2).starsystem;
						if (starsystemToView != null)
						{
							universe.venueNext =
								new VenueStarsystem(venueCurrent, starsystemToView);
						}
					}
				),
			]
		);

		return returnValue;
	}

	// drawable

	static visualBuild(): VisualStar
	{
		return new VisualStar();
	}

	draw(uwpe: UniverseWorldPlaceEntities): void
	{
		var visual = this.drawable().visual;
		visual.draw(uwpe, uwpe.universe.display);
	}
}

class VisualStar implements Visual<VisualStar>
{
	radiusActual: number;

	private _drawPos: Coords;

	constructor()
	{
		this.radiusActual = VisualStar.radiusActual();

		this._drawPos = Coords.create();
	}

	static radiusActual(): number
	{
		return 4; // todo
	}

	// Visual.

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var universe = uwpe.universe;
		var world = universe.world as WorldExtended;
		var networkNode = uwpe.entity as NetworkNode2;

		var display = universe.display;
		var nodePos = networkNode.locatable().loc.pos;

		var drawPos = this._drawPos.overwriteWith(nodePos);
		var camera = world.camera;
		camera.coordsTransformWorldToView(drawPos);

		var perspectiveFactor = camera.focalLength / drawPos.z;
		var radiusApparent = this.radiusActual * perspectiveFactor;

		var alpha = Math.pow(perspectiveFactor, 4); // hack
		if (alpha > 1)
		{
			alpha = 1;
		}

		var nodeColor = new Color
		(
			"Node", "", [ 1, 1, 1, alpha ] 
		);

		var display = universe.display;
		var gradient = new ValueBreakGroup
		(
			[
				new ValueBreak(0, Color.byName("White")),
				new ValueBreak(1, nodeColor),
			],
			null
		);

		var visual = new VisualCircleGradient
		(
			radiusApparent, gradient, null // colorBorder
		);

		var locatable = new Locatable(Disposition.fromPos(drawPos));
		var drawableTransformed = new Entity("[drawable]", [ locatable ]);
		visual.draw
		(
			new UniverseWorldPlaceEntities
			(
				universe, world, null, drawableTransformed, null
			),
			display
		);

		var starsystem = networkNode.starsystem;

		if (starsystem != null)
		{
			this.draw_Starsystem
			(
				uwpe, radiusApparent, drawPos, nodeColor, starsystem
			);
		}
	}

	draw_Starsystem
	(
		uwpe: UniverseWorldPlaceEntities,
		radiusApparent: number,
		starsystemDrawPos: Coords,
		nodeColor: Color,
		starsystem: Starsystem
	): void
	{
		var universe = uwpe.universe;
		var world = uwpe.world as WorldExtended;

		var display = universe.display;

		var factionsPresent = [];
		var planets = starsystem.planets;
		for (var i = 0; i < planets.length; i++)
		{
			var planet = planets[i];
			if (planet.factionName != null)
			{
				var faction = planet.faction(world);
				factionsPresent.push(faction);
			}
		}

		var drawablePosTransformed = starsystemDrawPos.clone();
		var drawableLocTransformed = Disposition.fromPos(drawablePosTransformed);
		var drawableLocatable = new Locatable(drawableLocTransformed);
		var drawableTransformed = new Entity("drawable", [ drawableLocatable ]);

		var ringThickness = radiusApparent * .1;
		for (var i = 0; i < factionsPresent.length; i++)
		{
			var faction = factionsPresent[i];
			var factionColor = faction.color;
			var ringRadius = radiusApparent + (ringThickness * (i + 5));
			var visualRing = new VisualCircle
			(
				ringRadius, null, factionColor, null
			);
			visualRing.draw(uwpe.entitySet(drawableTransformed), display);
		}

		var ships = starsystem.ships;
		var shipsSortedByFactionIndex = ships.sort
		(
			(a, b) =>
			{
				var factions = world.factions;
				var returnValue =
					factions.indexOf(a.faction(world))
					- factions.indexOf(a.faction(world));
				return returnValue;
			}
		);

		var shipFactionPrev: Faction = null;

		var shipOffsetIncrement =
			Coords.fromXY(0, -1).multiplyScalar(radiusApparent);

		var factionsSoFar = 0;

		for (var i = 0; i < shipsSortedByFactionIndex.length; i++)
		{
			var ship = ships[i];
			var shipFaction = ship.faction(world);
			if (shipFaction != shipFactionPrev)
			{
				factionsSoFar++;

				var shipColor = shipFaction.color;

				var shipOffset = shipOffsetIncrement.clone();
				shipOffset.y *= factionsSoFar + 1;

				drawablePosTransformed.overwriteWith
				(
					starsystemDrawPos
				).add
				(
					shipOffset
				);

				var visualShip = new VisualPolygon
				(
					new Path
					([
						Coords.fromXY(0, 0),
						Coords.fromXY(.5, -1).multiplyScalar(radiusApparent),
						Coords.fromXY(-.5, -1).multiplyScalar(radiusApparent),
					]),
					shipColor,
					null, // colorBorder
					false // shouldUseEntityOrientation
				);
				visualShip.draw(uwpe.entitySet(drawableTransformed), display);
			}
			shipFactionPrev = shipFaction;
		}

		var visualText = VisualText.fromTextHeightAndColor
		(
			starsystem.name, radiusApparent, nodeColor
		);
		drawablePosTransformed.overwriteWith(starsystemDrawPos);
		drawablePosTransformed.y += radiusApparent * 2;
		visualText.draw
		(
			uwpe.entitySet(drawableTransformed), display
		);
	}

	// Clonable.

	clone(): VisualStar
	{
		return this; // todo
	}

	overwriteWith(other: VisualStar): VisualStar
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualStar
	{
		return this; // todo
	}

}
