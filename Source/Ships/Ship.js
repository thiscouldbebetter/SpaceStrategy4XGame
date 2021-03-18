
class Ship
{
	constructor(name, defn, pos, factionName, devices)
	{
		this.name = name;
		this.defn = defn;
		var loc = new Disposition(pos);
		this._locatable = new Locatable(loc);
		this.factionName = factionName;
		this.devices = devices;

		this.integrity = 10;
		this.energyThisTurn = 0;
		this.distancePerMove = 0;
		this.shieldingThisTurn = 0;

		// Helper variables.
		this._displacement = new Coords();
	}

	// static methods

	static bodyDefnBuild(color)
	{
		var scaleFactor = 10;

		var returnValue = new BodyDefn
		(
			"Ship",
			new Coords(1, 1).multiplyScalar(scaleFactor), // size
			new VisualGroup
			([
				new VisualPolygon
				(
					new Path
					([
						new Coords(.5, 0).multiplyScalar(scaleFactor),
						new Coords(-.5, .5).multiplyScalar(scaleFactor),
						new Coords(-.5, -.5).multiplyScalar(scaleFactor),
					]),
					color
				),
			])
		);

		return returnValue;
	}

	// instance methods

	faction(world)
	{
		return (this.factionName == null ? null : world.factionByName(this.factionName));
	}

	id()
	{
		return this.factionName + this.name;
	}

	locatable()
	{
		return this._locatable;
	}

	// devices

	devicesUsable(world)
	{
		if (this._devicesUsable == null)
		{
			this._devicesUsable = [];

			for (var i = 0; i < this.devices.length; i++)
			{
				var device = this.devices[i];
				var deviceDefn = device.defn;
				if (deviceDefn.isActive)
				{
					this._devicesUsable.push(device);
				}
			}
		}

		return this._devicesUsable;
	}

	// movement

	linkPortalEnter(cluster, linkPortal)
	{
		var starsystemFrom = linkPortal.starsystemFrom(cluster);
		var starsystemTo = linkPortal.starsystemTo(cluster);
		var link = linkPortal.link(cluster);

		ArrayHelper.remove(starsystemFrom.ships, this);
		link.ships.push(this);

		var nodesLinked = link.nodesLinked(cluster);
		var linkNode0 = nodesLinked[0];
		var linkNode1 = nodesLinked[1];
		var linkStarsystem1 = linkNode1.starsystem;
		var isLinkForward = (starsystemTo == linkStarsystem1);

		var shipLoc = this.locatable().loc;

		var nodeFrom = (isLinkForward ? linkNode0 : linkNode1);
		shipLoc.pos.overwriteWith(nodeFrom.locatable().loc.pos);

		var linkDirection = link.displacement(cluster).normalize();
		if (isLinkForward == false)
		{
			linkDirection.multiplyScalar(-1)
		}
		shipLoc.vel.overwriteWith(linkDirection);
	}

	linkExit(world, link)
	{
		ArrayHelper.remove(link.ships, this);

		var cluster = world.network;
		var ship = this;
		var shipLoc = ship.locatable().loc;
		var shipPos = shipLoc.pos;
		var shipVel = shipLoc.vel;

		var linkDisplacement = link.displacement(cluster);
		var isShipMovingForward = (shipVel.dotProduct(linkDisplacement) > 0);
		var indexOfNodeDestination = (isShipMovingForward ? 1 : 0);
		var indexOfNodeSource = 1 - indexOfNodeDestination;

		var nodesLinked = link.nodesLinked(cluster);
		var nodeDestination = nodesLinked[indexOfNodeDestination];
		var nodeSource = nodesLinked[indexOfNodeSource];

		var starsystemDestination = nodeDestination.starsystem;
		var starsystemSource = nodeSource.starsystem;

		var portalToExitFrom = starsystemDestination.linkPortals[starsystemSource.name];
		var exitPos = portalToExitFrom.locatable().loc.pos;
		shipPos.overwriteWith(exitPos).add(new Coords(1, 1, 1));

		starsystemDestination.ships.push(ship);

		var shipFaction = ship.faction(world);
		var factionKnowledge = shipFaction.knowledge;
		var starsystemNamesKnown = factionKnowledge.starsystemNames;
		var starsystemName = starsystemDestination.name;
		if (ArrayHelper.contains(starsystemNamesKnown, starsystemName) == false)
		{
			starsystemNamesKnown.push(starsystemName);
			var linkPortals = starsystemDestination.linkPortals;
			for (var i = 0; i < linkPortals.length; i++)
			{
				var linkPortal = linkPortals[i];
				var link = linkPortal.link(cluster);
				var linkName = link.name;
				factionKnowledge.linkNames.push(linkName);
			}

			factionKnowledge.worldKnownUpdate();
		}
	}

	moveTowardTarget(universe, target)
	{
		if (this.distanceLeftThisMove == null)
		{
			if (this.energyThisTurn >= this.energyPerMove)
			{
				this.energyThisTurn -= this.energyPerMove;
				this.distanceLeftThisMove = this.distancePerMove;
			}
		}

		if (this.distanceLeftThisMove > 0)
		{
			var shipLoc = this.locatable().loc;
			var shipPos = shipLoc.pos;
			var targetLoc = target.locatable().loc;
			var targetPos = targetLoc.pos;

			var displacementToTarget = this._displacement.overwriteWith
			(
				targetPos
			).subtract
			(
				shipPos
			);
			var distanceToTarget = displacementToTarget.magnitude();

			var distanceMaxPerTick = 3; // hack

			var distanceToMoveThisTick = (this.distanceLeftThisMove < distanceMaxPerTick ? this.distanceLeftThisMove : distanceMaxPerTick);

			if (distanceToTarget < distanceToMoveThisTick)
			{
				shipPos.overwriteWith(targetPos);

				// hack
				this.distanceLeftThisMove = null;
				this.activity = null;
				universe.inputHelper.isEnabled = true;
				this.order = null;

				var targetDefnName = target.defn.name;
				if (targetDefnName == "LinkPortal")
				{
					var portal = target;
					this.linkPortalEnter(universe.world.network, portal);
				}
				else if (targetDefnName == "Planet")
				{
					var planet = target;
					var starsystem = universe.venueCurrent.starsystem;
					this.planetOrbitEnter(universe, starsystem, planet);
				}
			}
			else
			{
				var directionToTarget = displacementToTarget.divideScalar
				(
					distanceToTarget
				);

				var shipVel = shipLoc.vel;
				shipVel.overwriteWith
				(
					directionToTarget
				).multiplyScalar
				(
					distanceToMoveThisTick
				);

				shipPos.add(shipVel);

				this.distanceLeftThisMove -= distanceToMoveThisTick;
				if (this.distanceLeftThisMove <= 0)
				{
					// hack
					this.distanceLeftThisMove = null;
					this.activity = null;
					universe.inputHelper.isEnabled = true;
				}
			}
		}
	}

	movementThroughLinkPerTurn(link)
	{
		return 8; // todo
	}

	planetOrbitEnter(universe, starsystem, planet)
	{
		ArrayHelper.remove(starsystem.ships, this);
		planet.ships.push(this);
	}

	// controls

	controlBuild(universe, containerSize)
	{
		var margin = 8;
		var controlSpacing = 16;
		var buttonSize = new Coords
		(
			containerSize.x - margin * 2,
			15
		);
		var fontHeightInPixels = margin;

		var returnValue = new ControlContainer
		(
			"containerShip",
			new Coords(0, 0), // pos
			containerSize,
			// children
			[
				new ControlLabel
				(
					"textShipAsSelection",
					new Coords(margin, margin),
					new Coords(containerSize.x, 0), // this.size
					false, // isTextCentered
					new DataBinding(this.name)
				),

				new ControlLabel
				(
					"labelIntegrity",
					new Coords(margin, margin + controlSpacing),
					new Coords(containerSize.x, controlSpacing), // this.size
					false, // isTextCentered
					"H:"
				),

				new ControlLabel
				(
					"textIntegrity",
					new Coords(containerSize.x / 4, margin + controlSpacing),
					new Coords(containerSize.x, controlSpacing), // this.size
					false, // isTextCentered
					new DataBinding(this, function get(c) { return c.integrity; } )
				),

				new ControlLabel
				(
					"labelEnergy",
					new Coords(containerSize.x / 2, margin + controlSpacing),
					new Coords(containerSize.x, controlSpacing), // this.size
					false, // isTextCentered
					"E:"
				),

				new ControlLabel
				(
					"textEnergy",
					new Coords(3 * containerSize.x / 4, margin + controlSpacing),
					new Coords(containerSize.x, controlSpacing), // this.size
					false, // isTextCentered
					new DataBinding(this, function get(c) { return c.energyThisTurn; } )
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
					(universe) => // click
					{
						alert("todo - view")
					},
					universe // context
				),

				new ControlButton
				(
					"buttonMove",
					new Coords(margin, margin + controlSpacing * 3), // pos
					buttonSize,
					"Move",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					(universe) => // click
					{
						var venue = universe.venueCurrent;
						var ship = venue.selection;
						var mustTargetBodyFalse = false;
						var orderDefns = OrderDefn.Instances();
						venue.cursor.set(ship, orderDefns.Go.name, mustTargetBodyFalse);
					},
					universe // context
				),
				new ControlButton
				(
					"buttonRepeat",
					new Coords(margin, margin + controlSpacing * 4), // pos
					buttonSize,
					"Repeat",
					fontHeightInPixels,
					true, // hasBorder
					true, // isEnabled
					(universe) => // click
					{
						var venue = universe.venueCurrent;
						var ship = venue.selection;
						if (ship.order != null)
						{
							ship.order.obey(universe, ship);
						}
					},
					universe // context
				),

				new ControlLabel
				(
					"labelDevices",
					new Coords(margin, margin + controlSpacing * 5), // pos
					new Coords(containerSize.x, 0), // this.size
					false, // isTextCentered
					new DataBinding("Devices:")
				),

				new ControlList
				(
					"listDevices",
					new Coords(margin, margin + controlSpacing * 6), // pos
					new Coords(buttonSize.x, controlSpacing * 2), // size
					// dataBindingForItems
					new DataBinding(this, function get(c) { return c.devicesUsable(); } ),
					new DataBinding(null, function get(c) { return c.defn.name; } ), // bindingForOptionText
					fontHeightInPixels,
					new DataBinding
					(
						this,
						function get(c) { return c.deviceSelected; },
						function set(c, v) { c.deviceSelected = v; },
					), // dataBindingForItemSelected
					new DataBinding() // bindingForItemValue
				),

				new ControlButton
				(
					"buttonDeviceUse",
					new Coords(margin, margin * 2 + controlSpacing * 7.5), // pos
					buttonSize,
					"Use Device",
					fontHeightInPixels,
					true, // hasBorder
					new DataBinding
					(
						this,
						function get(c) { return (c.deviceSelected != null); }
					),
					(universe) => // click
					{
						var venue = universe.venueCurrent;
						var starsystem = venue.starsystem;
						var ship = venue.selection;
						var device = ship.deviceSelected;
						device.use(universe, starsystem, ship);
					},
					universe // context
				),


			]
		);

		return returnValue;
	}

	// diplomacy

	strength()
	{
		return 1;
	}

	// turns

	updateForTurn(universe, world, faction)
	{
		this.energyThisTurn = 0;
		this.distancePerMove = 0;
		this.energyPerMove = 0;
		this.shieldingThisTurn = 0;

		for (var i = 0; i < this.devices.length; i++)
		{
			var device = this.devices[i];
			device.updateForTurn(universe, this);
		}
	}

	// drawable

	draw(universe, nodeRadiusActual, camera, drawPos)
	{
		var ship = this;
		var world = universe.world;
		var display = universe.display;

		var shipPos = ship.locatable().loc.pos;

		camera.coordsTransformWorldToView
		(
			drawPos.overwriteWith
			(
				shipPos
			)
		);

		var visual = this.visual(world);
		//visual.draw(universe, display, ship, new Disposition(drawPos), ship); // todo
		visual.draw(universe, world, null, ship, display); // todo
	}

	visual(world)
	{
		if (this._visual == null)
		{
			var shipColor = ship.faction(world).color;
			this._visual = Ship.visual(shipColor);
		}

		return this._visual;
	}

	static visual(color)
	{
		var shipSizeMultiplier = 4; // hack

		return new VisualPolygon
		(
			new Path
			([
				new Coords(0, 0).multiplyScalar(shipSizeMultiplier),
				new Coords(.5, -1).multiplyScalar(shipSizeMultiplier),
				new Coords(-.5, -1).multiplyScalar(shipSizeMultiplier)
			]),
			color,
			null // colorBorder
		);
	}
}
