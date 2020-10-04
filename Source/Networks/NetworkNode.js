
class NetworkNode
{
	constructor(name, defn, pos, starsystem)
	{
		this.name = name;
		this.defn = defn;
		var loc = new Disposition(pos);
		this._locatable = new Locatable(loc);
		this.starsystem = starsystem;

		// Helper variables.
		this.drawPos = new Coords();
		this.drawLoc = new Disposition(this.drawPos);
	}

	locatable()
	{
		return this._locatable;
	}

	controlBuild(universe)
	{
		var world = universe.world;
		var viewSize = universe.display.sizeInPixels;
		var containerSize = new Coords(100, 80);
		var margin = 10;
		var controlSpacing = 8;
		var fontHeightInPixels = margin;
		var buttonSize = new Coords
		(
			containerSize.x - margin * 4,
			10
		);

		var returnValue = new ControlContainer
		(
			"containerStarsystem",
			new Coords(viewSize.x - margin - containerSize.x, margin), // pos
			new Coords(containerSize.x - margin * 2, 40), // size
			// children
			[
				new ControlLabel
				(
					"labelStarsystemName",
					new Coords(margin, margin),
					new Coords(0, 0), // this.size
					false, // isTextCentered
					new DataBinding(this.name)
				),

				new ControlLabel
				(
					"labelStarsystemHolder",
					new Coords(margin, margin + controlSpacing),
					new Coords(0, 0), // this.size
					false, // isTextCentered
					new DataBinding
					(
						this.starsystem,
						(c) => c.faction(world).name,
						null // set
					)
				),

				new ControlButton
				(
					"buttonView",
					new Coords(margin, margin + controlSpacing * 2), // pos
					buttonSize, // size
					"View",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueCurrent = universe.venueCurrent;
						var starsystemToView = venueCurrent.selection.starsystem;
						if (starsystemToView != null)
						{
							universe.venueNext = new VenueStarsystem(venueCurrent, starsystemToView);
						}
					}
				),
			]
		);

		return returnValue;
	}

	// drawable

	draw(universe, nodeRadiusActual, camera)
	{
		var world = universe.world;
		var display = universe.display;
		var nodePos = this.locatable().loc.pos;

		var drawPos = this.drawPos.overwriteWith(nodePos);
		camera.coordsTransformWorldToView(drawPos);

		var perspectiveFactor = camera.focalLength / drawPos.z;
		var radiusApparent = nodeRadiusActual * perspectiveFactor;

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
		var gradient = new Gradient
		([
			new GradientStop(0, Color.byName("White")),
			new GradientStop(1, nodeColor),
		]);
		var visual = new VisualCircleGradient(radiusApparent, gradient);
		var drawableTransformed = {};
		var locatable = new Locatable(new Disposition(drawPos));
		drawableTransformed.locatable = () => locatable;
		visual.draw(universe, world, this, drawableTransformed, display);

		var starsystem = this.starsystem;

		if (starsystem != null)
		{
			this.draw_Starsystem
			(
				universe, radiusApparent, drawPos, nodeColor, starsystem
			);
		}
	}

	draw_Starsystem
	(
		universe, radiusApparent, starsystemDrawPos, nodeColor, starsystem
	)
	{
		var world = universe.world;
		var display = universe.display;

		var factionsPresent = [];
		var planets = starsystem.planets;
		for (var i = 0; i < planets.length; i++)
		{
			var planet = planets[i];
			if (planet.factionName != null)
			{
				var faction = planet.faction(universe.world);
				factionsPresent.push(faction);
			}
		}

		var drawableTransformed = {};
		var drawablePosTransformed = starsystemDrawPos.clone();
		var drawableLocTransformed = new Disposition(drawablePosTransformed);
		var drawableLocatable = new Locatable(drawableLocTransformed);
		drawableTransformed.locatable = () => drawableLocatable;

		var ringThickness = radiusApparent * .1;
		for (var i = 0; i < factionsPresent.length; i++)
		{
			var faction = factionsPresent[i];
			var factionColor = faction.color;
			var ringRadius = radiusApparent + (ringThickness * (i + 5));
			var visualRing = new VisualCircle
			(
				ringRadius, null, factionColor
			);
			visualRing.draw(universe, world, null, drawableTransformed, display);
		}

		var ships = starsystem.ships;
		var numberOfShips = ships.length;
		var shipOffset = new Coords(0, -2).multiplyScalar(radiusApparent);
		for (var i = 0; i < numberOfShips; i++)
		{
			var ship = ships[i];
			var shipFaction = ship.faction(universe.world);
			var shipColor = shipFaction.color;
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
					new Coords(0, 0),
					new Coords(.5, -1).multiplyScalar(radiusApparent),
					new Coords(-.5, -1).multiplyScalar(radiusApparent),
				]),
				shipColor
			);
			visualShip.draw(universe, world, null, drawableTransformed, display);
		}

		var visualText = new VisualText
		(
			DataBinding.fromContext(this.starsystem.name),
			null, // heightInPixels
			nodeColor, Color.byName("Black")
		);
		drawablePosTransformed.overwriteWith(starsystemDrawPos);
		drawablePosTransformed.y += radiusApparent * 2;
		visualText.draw(universe, world, null, drawableTransformed, display);
	}
}

class VisualCircleGradient
{
	constructor(radius, gradient)
	{
		// todo - Use version from Framework.
		this.radius = radius;
		this.gradient = gradient;
	}

	draw(universe, world, place, entity, display)
	{
		display.drawCircleWithGradient
		(
			entity.locatable().loc.pos, this.radius, this.gradient
		);
	}
}

{
	// constants

	NetworkNode.RadiusActual = 4;
}
