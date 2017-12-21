
function NetworkNode(name, defn, pos, starsystem)
{
	this.name = name;
	this.defn = defn;
	this.loc = new Location(pos);
	this.starsystem = starsystem;

	// Helper variables.
	this.drawPos = new Coords();
	this.drawLoc = new Location(this.drawPos);
}

{
	// constants 

	NetworkNode.RadiusActual = 4;
}

{
	NetworkNode.prototype.controlBuild = function(universe)
	{
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
					new DataBinding(this.starsystem, "faction.name")
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

	NetworkNode.prototype.draw = function(universe, nodeRadiusActual, camera)
	{
		var world = universe.world;
		var display = universe.display;
		var nodePos = this.loc.pos;

		var drawPos = this.drawPos.overwriteWith(nodePos);
		camera.coordsTransformWorldToView(drawPos);

		var perspectiveFactor = camera.focalLength / drawPos.z;
		var radiusApparent = nodeRadiusActual * perspectiveFactor;

		var alpha = Math.pow(perspectiveFactor, 4); // hack
		if (alpha > 1)
		{
			alpha = 1;
		}

		var nodeIntensity = Math.floor(128 * alpha);
		var nodeColor = 
			"rgb(" 
			+ nodeIntensity + "," 
			+ nodeIntensity + "," 
			+ nodeIntensity 
			+ ")";

		var display = universe.display;
		var gradient = new Gradient
		([
			new GradientStop(0, "White"),
			new GradientStop(1, nodeColor), 
		]);
		var visual = new VisualCircleGradient(radiusApparent, gradient);
		var drawableTransformed = {};
		drawableTransformed.loc = new Location(drawPos);
		visual.draw(universe, world, display, drawableTransformed);

		var starsystem = this.starsystem;

		if (starsystem != null)
		{
			this.draw_Starsystem
			(
				universe, radiusApparent, drawPos, nodeColor, starsystem
			);
		}
	}

	NetworkNode.prototype.draw_Starsystem = function(universe, radiusApparent, starsystemDrawPos, nodeColor, starsystem)
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
		drawableTransformed.loc = new Location(drawablePosTransformed);

		var ringThickness = radiusApparent * .1;
		for (var i = 0; i < factionsPresent.length; i++)
		{
			var faction = factionsPresent[i];
			var factionColor = faction.color;
			var ringRadius = radiusApparent + (ringThickness * (i + 5));
			var visualRing = new VisualCircle
			(
				ringRadius, null, factionColor.systemColor
			);
			visualRing.draw(universe, world, display, drawableTransformed);
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
				[ 
					new Coords(0, 0), 
					new Coords(.5, -1).multiplyScalar(radiusApparent), 
					new Coords(-.5, -1).multiplyScalar(radiusApparent), 
				],
				shipColor.systemColor
			);
			visualShip.draw(universe, world, display, drawableTransformed);
		}

		var visualText = new VisualText
		(
			this.starsystem.name, nodeColor, "Black"
		);
		drawablePosTransformed.overwriteWith(starsystemDrawPos);
		drawablePosTransformed.y += radiusApparent * 2;
		visualText.draw(universe, world, display, drawableTransformed);

	}
}

function VisualCircleGradient(radius, gradient)
{
	this.radius = radius;
	this.gradient = gradient;
}
{
	VisualCircleGradient.prototype.draw = function(universe, world, display, drawable)
	{
		display.drawCircleWithGradient(drawable.loc.pos, this.radius, this.gradient);
	}
}
