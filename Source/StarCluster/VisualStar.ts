
class VisualStar implements Visual<VisualStar>
{
	name: string;
	color: Color;
	radiusActual: number;

	private _drawPos: Coords;

	constructor(name: string, color: Color, radiusActual: number)
	{
		this.name = name;
		this.color = color;
		this.radiusActual = radiusActual

		this._drawPos = Coords.create();
	}

	static fromNameColorAndRadiusActual
	(
		name: string, color: Color, radiusActual: number
	): VisualStar
	{
		return new VisualStar(name, color, radiusActual);
	}

	static byName(name: string): VisualStar
	{
		return VisualStar.Instances().byName(name);
	}

	// Instances.

	static _instances: VisualStar_Instances;
	static Instances(): VisualStar_Instances
	{
		if (VisualStar._instances == null)
		{
			VisualStar._instances = new VisualStar_Instances();
		}
		return VisualStar._instances;
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
		var starClusterNode = uwpe.entity as StarClusterNode;

		var display = universe.display;
		var nodePos = Locatable.of(starClusterNode).loc.pos;

		var drawPos = this._drawPos.overwriteWith(nodePos);
		var camera = world.camera;
		camera.coordsTransformWorldToView(drawPos);

		var perspectiveFactor = camera.focalLength / drawPos.z;
		var radiusApparent = this.radiusActual * perspectiveFactor;

		var fadeFactor = Math.pow(perspectiveFactor, 4); // hack
		if (fadeFactor > 1)
		{
			fadeFactor = 1;
		}

		var colors = Color.Instances();
		var colorAtCenter = colors.White.clone().valueMultiplyByScalar(2 * fadeFactor);
		var colorAtBorder = this.color.clone().valueMultiplyByScalar(fadeFactor);
		var colorSpace = colorAtBorder.clone().alphaSet(0);

		var display = universe.display;
		var gradient = new ValueBreakGroup
		(
			[
				new ValueBreak(0, colorAtCenter),
				new ValueBreak(0.5, colorAtCenter),
				new ValueBreak(0.8, colorAtBorder),
				new ValueBreak(1, colorSpace),
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

		var starsystem = starClusterNode.starsystem;

		if (starsystem != null)
		{
			this.draw_Starsystem
			(
				uwpe, radiusApparent, drawPos, colorAtCenter, starsystem
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

		var factionsPresent = new Array<Faction>();
		var planets = starsystem.planets;
		for (var i = 0; i < planets.length; i++)
		{
			var planet = planets[i];
			var planetFaction = planet.faction();
			if (planetFaction != null)
			{
				factionsPresent.push(planetFaction);
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
		var factions = world.factions();
		var shipsSortedByFactionIndex = ships.sort
		(
			(a, b) =>
			{
				var returnValue =
					factions.indexOf(a.faction())
					- factions.indexOf(b.faction());
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
			var shipFaction = ship.faction();
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

		var visualText = VisualText.fromTextImmediateFontAndColor
		(
			starsystem.name,
			FontNameAndHeight.fromHeightInPixels(radiusApparent),
			nodeColor
		);
		drawablePosTransformed.overwriteWith(starsystemDrawPos);
		drawablePosTransformed.y += radiusApparent * 2;
		visualText.draw
		(
			uwpe.entitySet(drawableTransformed), display
		);
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	initializeIsComplete(): boolean { return true; }

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

class VisualStar_Instances
{
	Default: VisualStar;

	Blue: VisualStar;
	Green: VisualStar;
	Orange: VisualStar;
	Red: VisualStar;
	White: VisualStar;
	Yellow: VisualStar;

	_All: VisualStar[];

	constructor()
	{
		var vs =
			(n: string, c: Color, ra: number) =>
				VisualStar.fromNameColorAndRadiusActual(n, c, ra);

		var colors = Color.Instances();

		var radius = VisualStar.radiusActual();

		this.Default 	= vs("Default", colors.White, radius);

		this.Blue 		= vs("Blue", colors.Blue, radius);
		this.Green 		= vs("Green", colors.Green, radius);
		this.Orange 	= vs("Orange", colors.Orange, radius);
		this.Red 		= vs("Red", colors.Red, radius);
		this.White 		= vs("White", colors.White, radius);
		this.Yellow 	= vs("Yellow", colors.Yellow, radius);

		this._All =
		[
			this.Default,

			this.Blue,
			this.Green,
			this.Orange,
			this.Red,
			this.White,
			this.Yellow
		];
	}

	byName(name: string): VisualStar
	{
		return this._All.find(x => x.name == name);
	}
}
