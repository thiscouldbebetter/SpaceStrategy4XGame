
class Ship extends Entity
{
	defn: BodyDefn;
	factionName: string;
	devices: Device[];

	deviceSelected: Device;
	distanceLeftThisMove: number;
	distancePerMove: number;
	energyPerMove: number;
	energyThisTurn: number;
	integrity: number;
	order: Order;
	shieldingThisTurn: number;

	_devicesUsable: Device[];
	_displacement: Coords;
	_visual: VisualBase;

	constructor
	(
		name: string,
		defn: BodyDefn,
		pos: Coords,
		factionName: string,
		devices: Device[]
	)
	{
		super
		(
			name,
			[
				Actor.create(),
				defn,
				Killable.fromIntegrityMax(10),
				Locatable.fromPos(pos),
				new Orderable()
			]
		);

		this.defn = defn;
		this.factionName = factionName;
		this.devices = devices;

		this.energyThisTurn = 0;
		this.distancePerMove = 0;
		this.shieldingThisTurn = 0;

		// Helper variables.
		this._displacement = Coords.create();
	}

	// static methods

	static bodyDefnBuild(color: Color)
	{
		var scaleFactor = 10;

		var returnValue = new BodyDefn
		(
			"Ship",
			Coords.fromXY(1, 1).multiplyScalar(scaleFactor), // size
			new VisualGroup
			([
				new VisualPolygon
				(
					new Path
					([
						Coords.fromXY(.5, 0).multiplyScalar(scaleFactor),
						Coords.fromXY(-.5, .5).multiplyScalar(scaleFactor),
						Coords.fromXY(-.5, -.5).multiplyScalar(scaleFactor),
					]),
					color,
					null, // colorBorder?
					false // shouldUseEntityOrientation
				),
			])
		);

		return returnValue;
	}

	// instance methods

	faction(world: WorldExtended): Faction
	{
		return (this.factionName == null ? null : world.factionByName(this.factionName));
	}

	link(world: WorldExtended): NetworkLink2
	{
		var linkFound = world.network.links.find
		(
			x => (x.ships.indexOf(this) >= 0)
		);

		return linkFound
	}

	nameWithFaction(): string
	{
		return this.factionName + this.name;
	}

	starsystem(world: WorldExtended): Starsystem
	{
		var networkNodeFound = world.network.nodes.find
		(
			x => (x.starsystem.ships.indexOf(this) >= 0)
		);

		var starsystemFound =
		(
			networkNodeFound == null ? null : networkNodeFound.starsystem
		);
		return starsystemFound;
	}

	// Devices.

	devicesUsable(world: WorldExtended): Device[]
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

	linkPortalEnter(cluster: Network2, linkPortal: LinkPortal, ship: Ship): void
	{
		var starsystemFrom = linkPortal.starsystemFrom(cluster);
		var starsystemTo = linkPortal.starsystemTo(cluster);
		var link = linkPortal.link(cluster);

		starsystemFrom.shipRemove(ship);
		link.shipAdd(ship);

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

	linkExit(world: WorldExtended, link: NetworkLink2): void
	{
		var ship = this;
		link.shipRemove(ship); // todo

		var cluster = world.network;
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

		var portalToExitFrom =
			starsystemDestination.linkPortalByStarsystemName(starsystemSource.name);
		var exitPos = portalToExitFrom.locatable().loc.pos;
		shipPos.overwriteWith(exitPos).add(Coords.Instances().Ones);

		starsystemDestination.shipAdd(ship);

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

	moveTowardTarget(universe: Universe, target: Entity, ship: Ship): void
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

			var distanceToMoveThisTick =
			(
				this.distanceLeftThisMove < distanceMaxPerTick
				? this.distanceLeftThisMove
				: distanceMaxPerTick
			);

			if (distanceToTarget < distanceToMoveThisTick)
			{
				shipPos.overwriteWith(targetPos);

				// hack
				this.distanceLeftThisMove = null;
				this.actor().activity = null;
				universe.inputHelper.isEnabled = true;
				this.order = null;

				var targetBodyDefn = BodyDefn.fromEntity(target);
				var targetDefnName = targetBodyDefn.name;
				if (targetDefnName == LinkPortal.name)
				{
					var portal = target as LinkPortal;
					this.linkPortalEnter(
						(universe.world as WorldExtended).network, portal, ship
					);
				}
				else if (targetDefnName == Planet.name)
				{
					var planet = target as Planet;
					var venue = universe.venueCurrent as VenueStarsystem;
					var starsystem = venue.starsystem;
					this.planetOrbitEnter(universe, starsystem, planet, null);
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
					this.actor().activity = null;
					universe.inputHelper.isEnabled = true;
				}
			}
		}
	}

	movementThroughLinkPerTurn(link: NetworkLink2): number
	{
		return 8; // todo
	}

	planetOrbitEnter
	(
		universe: Universe, starsystem: Starsystem,
		planet: Planet, ship: Ship
	): void
	{
		ArrayHelper.remove(starsystem.ships, ship);
		planet.shipAdd(ship);
	}

	// controls

	toControl(universe: Universe, containerSize: Coords): ControlBase
	{
		var world = universe.world as WorldExtended;

		var margin = 8;
		var controlSpacing = 16;
		var buttonSize = Coords.fromXY
		(
			containerSize.x - margin * 2,
			15
		);
		var fontHeightInPixels = margin;

		var returnValue = ControlContainer.from4
		(
			"containerShip",
			Coords.fromXY(0, 0), // pos
			containerSize,
			// children
			[
				ControlLabel.from5
				(
					"textShipAsSelection",
					Coords.fromXY(margin, margin),
					Coords.fromXY(containerSize.x, 0), // this.size
					false, // isTextCentered
					DataBinding.fromContext(this.name)
				),

				ControlLabel.from5
				(
					"labelIntegrity",
					Coords.fromXY(margin, margin + controlSpacing),
					Coords.fromXY(containerSize.x, controlSpacing), // this.size
					false, // isTextCentered
					DataBinding.fromContext("H:")
				),

				ControlLabel.from5
				(
					"textIntegrity",
					Coords.fromXY(containerSize.x / 4, margin + controlSpacing),
					Coords.fromXY(containerSize.x, controlSpacing), // this.size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						this, (c: Ship) => "" + c.integrity
					)
				),

				ControlLabel.from5
				(
					"labelEnergy",
					Coords.fromXY(containerSize.x / 2, margin + controlSpacing),
					Coords.fromXY(containerSize.x, controlSpacing), // this.size
					false, // isTextCentered
					DataBinding.fromContext("E:")
				),

				ControlLabel.from5
				(
					"textEnergy",
					Coords.fromXY(3 * containerSize.x / 4, margin + controlSpacing),
					Coords.fromXY(containerSize.x, controlSpacing), // this.size
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						this, (c: Ship) => "" + c.energyThisTurn
					)
				),

				ControlButton.from8
				(
					"buttonView",
					Coords.fromXY(margin, margin + controlSpacing * 2), // pos
					buttonSize, // size
					"View",
					fontHeightInPixels,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => alert("todo - view") // click
				),

				ControlButton.from8
				(
					"buttonMove",
					Coords.fromXY(margin, margin + controlSpacing * 3), // pos
					buttonSize,
					"Move",
					fontHeightInPixels,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venue = universe.venueCurrent as VenueStarsystem;
						var ship = venue.selection;
						var mustTargetBodyFalse = false;
						var orderDefns = OrderDefn.Instances();
						venue.cursor.set(ship, orderDefns.Go.name, mustTargetBodyFalse);
					}
				),

				ControlButton.from8
				(
					"buttonRepeat",
					Coords.fromXY(margin, margin + controlSpacing * 4), // pos
					buttonSize,
					"Repeat",
					fontHeightInPixels,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venue = universe.venueCurrent as VenueStarsystem;
						var ship = venue.selection;
						var order = Orderable.fromEntity(ship).order;
						if (order != null)
						{
							order.obey(universe, null, null, ship);
						}
					}
				),

				ControlLabel.from5
				(
					"labelDevices",
					Coords.fromXY(margin, margin + controlSpacing * 5), // pos
					Coords.fromXY(containerSize.x, 0), // this.size
					false, // isTextCentered
					DataBinding.fromContext("Devices:")
				),

				ControlList.from8
				(
					"listDevices",
					Coords.fromXY(margin, margin + controlSpacing * 6), // pos
					Coords.fromXY(buttonSize.x, controlSpacing * 2), // size
					// dataBindingForItems
					DataBinding.fromContextAndGet
					(
						this, (c: Ship) => c.devicesUsable(world)
					),
					DataBinding.fromGet( (c: Ship) => c.defn.name ), // bindingForOptionText
					fontHeightInPixels,
					new DataBinding
					(
						this,
						(c: Ship) => c.deviceSelected,
						(c: Ship, v: Device) => c.deviceSelected = v
					), // dataBindingForItemSelected
					DataBinding.fromContext(null) // bindingForItemValue
				),

				ControlButton.from8
				(
					"buttonDeviceUse",
					Coords.fromXY(margin, margin * 2 + controlSpacing * 7.5), // pos
					buttonSize,
					"Use Device",
					fontHeightInPixels,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c) => (c.deviceSelected != null)
					),
					() => // click
					{
						var venue = universe.venueCurrent as VenueStarsystem;
						var ship = venue.selection as Ship;
						var device = ship.deviceSelected;
						device.use(universe, universe.world, null, ship);
					}
				),


			]
		);

		return returnValue;
	}

	// diplomacy

	strength(world: WorldExtended): number
	{
		return 1; // todo
	}

	// Entity.

	orderable(): Orderable
	{
		return Orderable.fromEntity(this);
	}

	// turns

	updateForTurn(universe: Universe, world: World, faction: Faction): void
	{
		this.energyThisTurn = 0;
		this.distancePerMove = 0;
		this.energyPerMove = 0;
		this.shieldingThisTurn = 0;

		for (var i = 0; i < this.devices.length; i++)
		{
			var device = this.devices[i];
			device.updateForTurn(universe, world, null, this);
		}
	}

	// drawable

	draw
	(
		universe: Universe,
		nodeRadiusActual: number,
		camera: Camera,
		drawPos: Coords
	): void
	{
		var world = universe.world as WorldExtended;
		var display = universe.display;

		var ship = this;
		var shipPos = ship.locatable().loc.pos;

		camera.coordsTransformWorldToView
		(
			drawPos.overwriteWith
			(
				shipPos
			)
		);

		var visual = this.visual(world);
		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, world, null, ship, null
		);
		visual.draw(uwpe, display); // todo
	}

	visual(world: WorldExtended): VisualBase
	{
		if (this._visual == null)
		{
			var shipColor = this.faction(world).color;
			this._visual = Ship.visual(shipColor);
		}

		return this._visual;
	}

	static visual(color: Color): VisualBase
	{
		var shipSizeMultiplier = 4; // hack

		return new VisualPolygon
		(
			new Path
			([
				Coords.fromXY(0, 0).multiplyScalar(shipSizeMultiplier),
				Coords.fromXY(.5, -1).multiplyScalar(shipSizeMultiplier),
				Coords.fromXY(-.5, -1).multiplyScalar(shipSizeMultiplier)
			]),
			color,
			null, // colorBorder
			false // shouldUseEntityOrientation
		);
	}
}
