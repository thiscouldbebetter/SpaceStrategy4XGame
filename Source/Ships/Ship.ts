
class Ship extends Entity
{
	defn: BodyDefn;

	deviceSelected: Device;

	_devicesDrives: Device[];
	_devicesUsable: Device[];
	_visual: VisualBase;

	constructor
	(
		name: string,
		defn: BodyDefn,
		pos: Coords,
		factionName: string,
		items: Item[]
	)
	{
		super
		(
			name,
			[
				Actor.default(),
				defn,
				Collidable.fromCollider
				(
					Sphere.fromRadiusAndCenter
					(
						VisualStar.radiusActual(), pos
					)
				),
				new Controllable(Ship.toControl),
				new Factionable(factionName),
				ItemHolder.fromItems(items),
				Killable.fromIntegrityMax(10),
				Locatable.fromPos(pos),
				new Orderable(),
				new TurnTaker()
			]
		);

		this.defn = defn;

		this.buildable(); // hack
	}

	// static methods

	static bodyDefnBuild(color: Color): BodyDefn
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

	private _buildable: Buildable;
	buildable(): Buildable
	{
		if (this._buildable == null)
		{
			this._buildable = new Buildable
			(
				this.defn.name, Coords.create(), false
			);
			this.propertyAdd(this._buildable);
		}
		return this._buildable;
	}

	collideWithEntity(uwpe: UniverseWorldPlaceEntities, target: Entity): void
	{
		var ship = this;
		var universe = uwpe.universe;

		var targetBodyDefn = BodyDefn.fromEntity(target);
		var targetDefnName = targetBodyDefn.name;
		if (targetDefnName == LinkPortal.name)
		{
			var portal = target as LinkPortal;
			ship.linkPortalEnter(
				(universe.world as WorldExtended).network, portal, ship
			);
		}
		else if (targetDefnName == Planet.name)
		{
			var planet = target as Planet;
			var venue = universe.venueCurrent as VenueStarsystem;
			var starsystem = venue.starsystem;
			ship.planetOrbitEnter(universe, starsystem, planet);
		}
		else if (targetDefnName == Ship.name)
		{
			var shipCollidable = ship.collidable();
			var collision = Collision.fromEntitiesColliding(ship, target);
			shipCollidable.collisionHandle(uwpe, collision);
		}
	}

	devices(): Device[]
	{
		var items = this.itemHolder().items;

		var returnDevices = items.filter
		(
			x => x.constructor.name == Device.name
		) as Device[];

		return returnDevices;
	}

	devicesByDefnName(deviceDefnName: string): Device[]
	{
		return this.devices().filter(x => x.defnName == deviceDefnName);
	}

	faction(world: WorldExtended): Faction
	{
		return this.factionable().faction(world);
	}

	factionable(): Factionable
	{
		return this.propertyByName(Factionable.name) as Factionable;
	}

	integrityCurrentOverMax(): string
	{
		return this.killable().integrityCurrentOverMax();
	}

	isAwaitingTarget(): boolean
	{
		return (this.deviceSelected != null);
	}

	jumpTo(universe: Universe): void
	{
		var starsystem =
			this.starsystem(universe.world as WorldExtended);
		var venueStarsystem = new VenueStarsystem
		(
			universe.venueCurrent, // venueToReturnTo
			starsystem // modelParent
		);
		universe.venueNext = venueStarsystem;
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
		return this.factionable().factionName + this.name;
	}

	order(): Order
	{
		return this.orderable().order;
	}

	orderSet(order: Order): void
	{
		var orderable = Orderable.fromEntity(this);
		orderable.order = order;
	}

	orderable(): Orderable
	{
		return Orderable.fromEntity(this);
	}

	planet(world: WorldExtended): Planet
	{
		var planetName = this.locatable().loc.placeName.split(":")[1];
		var starsystemName = planetName.split(" ")[0];
		var starsystem = world.network.starsystemByName(starsystemName);

		var planet = starsystem.planets.find
		(
			x => x.ships.indexOf(this) >= 0
		);
		return planet;
	}

	planetColonize(universe: Universe, world: WorldExtended): boolean
	{
		var wasColonizationSuccessful = false;

		var planetBeingOrbited = this.planet(world);
		var planetBeingOrbitedFaction = planetBeingOrbited.factionable().faction(world);

		if
		(
			planetBeingOrbited != null
			&& planetBeingOrbitedFaction == null
		)
		{
			var itemHolder = this.itemHolder();

			var itemDefnNameHub = world.defn.itemDefnByName("Colony Hub").name;

			var hasHub =
				itemHolder.hasItemWithDefnName(itemDefnNameHub);

			if (hasHub)
			{
				var itemForHub =
					itemHolder.itemsByDefnName(itemDefnNameHub)[0];
				
				var uwpe = new UniverseWorldPlaceEntities(universe, world, null, this, null);
				var entityForHub = itemForHub.toEntity(uwpe);

				var planetMap = planetBeingOrbited.layout.map;
				var posToBuildAt =
					planetMap.sizeInCells.clone().half().clearZ();

				var entityForHubLocatable = Locatable.fromPos(posToBuildAt);
				entityForHub.propertyAdd(entityForHubLocatable);

				planetBeingOrbited.buildableEntityBuild(entityForHub);

				var shipFactionName = this.factionable().factionName;

				planetBeingOrbited.factionable().factionSetByName(shipFactionName);
				var shipFaction = this.faction(world);
				shipFaction.planetAdd(planetBeingOrbited);

				wasColonizationSuccessful = true;

				var planet = this.planet(world);
				var starsystem = planet.starsystem(world);
				var starsystemFactionName = starsystem.factionName;
				if (starsystemFactionName == null)
				{
					starsystem.factionName = shipFactionName;
				}
				else if (starsystemFactionName != shipFactionName)
				{
					// todo - Diplomatic incident.
				}
			}
		}

		return wasColonizationSuccessful;
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

	toStringDescription(): string
	{
		var returnValue =
			this.name
			+ " - " + this.locatable().loc.placeName
			+ " - Integrity: " + this.integrityCurrentOverMax()
			+ ", " + this.turnTaker().toStringDescription();
		
		var order = this.order();
		var orderAsString = (order == null ? "Doing nothing." : order.toStringDescription());

		returnValue +=
			" - " + orderAsString;

		return returnValue;
	}

	// Devices.

	devicesDrives(world: WorldExtended): Device[]
	{
		if (this._devicesDrives == null)
		{
			this._devicesDrives = [];

			var devices = this.devices();
			for (var i = 0; i < devices.length; i++)
			{
				var device = devices[i];
				var deviceDefn = device.deviceDefn(world);
				if (deviceDefn.categoryNames.indexOf("Drive") >= 0)
				{
					this._devicesDrives.push(device);
				}
			}
		}

		return this._devicesDrives;
	}

	devicesUsable(world: WorldExtended): Device[]
	{
		if (this._devicesUsable == null)
		{
			this._devicesUsable = [];

			var devices = this.devices();
			for (var i = 0; i < devices.length; i++)
			{
				var device = devices[i];
				var deviceDefn = device.deviceDefn(world);
				if (deviceDefn.isActive)
				{
					this._devicesUsable.push(device);
				}
			}
		}

		return this._devicesUsable;
	}

	// movement

	linkPortalEnter
	(
		cluster: Network2, linkPortal: LinkPortal, ship: Ship
	): void
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

		shipLoc.placeName = NetworkLink2.name + ":" + link.name;

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

		shipLoc.placeName = Starsystem.name + ":" + starsystemDestination.name;

		var portalToExitFrom =
			starsystemDestination.linkPortalByStarsystemName(starsystemSource.name);
		var exitPos = portalToExitFrom.locatable().loc.pos;
		shipPos.overwriteWith(exitPos).add(Coords.Instances().Ones);

		starsystemDestination.shipAdd(ship, world);

		var shipFaction = ship.faction(world);
		var factionKnowledge = shipFaction.knowledge;
		factionKnowledge.starsystemAdd(starsystemDestination, world);
	}

	moveTowardTarget(uwpe: UniverseWorldPlaceEntities, target: Entity, ship: Ship): void
	{
		var turnTaker = this.turnTaker();
		turnTaker.moveShipTowardTarget(uwpe, ship, target);
	}

	movementThroughLinkPerTurn(link: NetworkLink2): number
	{
		return 8; // todo
	}

	planetOrbitEnter
	(
		universe: Universe,
		starsystem: Starsystem,
		planet: Planet
	): void
	{
		starsystem.shipRemove(this);
		planet.shipAdd(this);

		this.locatable().loc.placeName =
			Planet.name + ":" + planet.name;
	}

	planetOrbitExit
	(
		universe: Universe, starsystem: Starsystem,
		planet: Planet
	): void
	{
		planet.shipRemove(this);
		starsystem.shipAdd(this, universe.world as WorldExtended);

		this.locatable().loc.placeName =
			Starsystem.name + ":" + starsystem.name;
	}

	// controls

	static toControl
	(
		uwpe: UniverseWorldPlaceEntities,
		size: Coords,
		controlTypeName: string
	): ControlBase
	{
		var returnValue: ControlBase = null;

		var ship = uwpe.entity as Ship;

		if (controlTypeName == Starsystem.name)
		{
			var universe = uwpe.universe;
			returnValue = ship.toControl_Starsystem(universe, size);
		}
		else if (controlTypeName == "Status")
		{
			returnValue = ship.toControl_Status(uwpe);
		}
		else
		{
			throw new Error("Unrecognized controlTypeName: " + controlTypeName);
		}

		return returnValue;
	}

	toControl_Status(uwpe: UniverseWorldPlaceEntities): ControlBase
	{
		var containerSize = uwpe.universe.display.sizeInPixels;

		var margin = 8;
		var fontHeightInPixels = 10;
		var fontNameAndHeight =
			FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var returnControl = ControlContainer.from4
		(
			"containerShipStatus",
			Coords.fromXY(0, 0), // pos
			containerSize,
			// children
			[
				new ControlLabel
				(
					"headingShip",
					Coords.fromXY(margin, margin),
					Coords.fromXY(containerSize.x, 0), // this.size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext(Ship.name),
					fontNameAndHeight
				)
			]
		);

		return returnControl;
	}

	toControl_Starsystem(universe: Universe, containerSize: Coords): ControlBase
	{
		var ship = this;

		var world = universe.world as WorldExtended;

		var margin = 8;
		var controlSpacing = 16;
		var buttonSize = Coords.fromXY
		(
			containerSize.x - margin * 2,
			15
		);
		var buttonHalfSize =
			buttonSize.clone().multiply(Coords.fromXY(.5, 1));
		var fontHeightInPixels = margin;
		var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, world, null, ship, null
		);

		var childControls: ControlBase[] =
		[
			new ControlLabel
			(
				"textShipAsSelection",
				Coords.fromXY(margin, margin),
				Coords.fromXY(containerSize.x, 0), // this.size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext(this.name),
				fontNameAndHeight
			)
		];

		var shipBelongsToUser = ship.faction(world).isControlledByUser();

		if (shipBelongsToUser)
		{
			var childControlsDetailed: ControlBase[] =
			[
				new ControlLabel
				(
					"labelIntegrity",
					Coords.fromXY(margin, margin + controlSpacing),
					Coords.fromXY(containerSize.x, controlSpacing), // this.size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("H:"),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"textIntegrity",
					Coords.fromXY(containerSize.x / 4, margin + controlSpacing),
					Coords.fromXY(containerSize.x, controlSpacing), // this.size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						ship, (c: Ship) => "" + c.integrityCurrentOverMax()
					),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"labelEnergy",
					Coords.fromXY(containerSize.x / 2, margin + controlSpacing),
					Coords.fromXY(containerSize.x, controlSpacing), // this.size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("E:"),
					fontNameAndHeight
				),

				new ControlLabel
				(
					"textEnergy",
					Coords.fromXY(3 * containerSize.x / 4, margin + controlSpacing),
					Coords.fromXY(containerSize.x, controlSpacing), // this.size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						ship, (c: Ship) => "" + c.turnTaker().energyThisTurn
					),
					fontNameAndHeight
				),

				ControlButton.from8
				(
					"buttonMove",
					Coords.fromXY(margin, margin + controlSpacing * 2), // pos
					buttonHalfSize,
					"Move",
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venue = universe.venueCurrent as VenueStarsystem;
						var ship = venue.selectedEntity as Ship;

						ship.deviceSelected = ship.devicesDrives(world)[0];

						var orderDefns = OrderDefn.Instances();
						venue.cursor.entityAndOrderNameSet(ship, orderDefns.Go.name);
					}
				),

				ControlButton.from8
				(
					"buttonRepeat",
					Coords.fromXY
					(
						margin + buttonHalfSize.x,
						margin + controlSpacing * 2
					), // pos
					buttonHalfSize,
					"Repeat",
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						var venue = universe.venueCurrent as VenueStarsystem;
						var ship = venue.selectedEntity;
						var order = Orderable.fromEntity(ship).order;
						if (order != null)
						{
							order.obey(universe, null, null, ship);
						}
					}
				),

				new ControlLabel
				(
					"labelDevices",
					Coords.fromXY(margin, margin + controlSpacing * 3), // pos
					Coords.fromXY(containerSize.x, 0), // this.size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Devices:"),
					fontNameAndHeight
				),

				ControlList.from8
				(
					"listDevices",
					Coords.fromXY(margin, margin + controlSpacing * 4), // pos
					Coords.fromXY(buttonSize.x, controlSpacing * 4), // size
					// dataBindingForItems
					DataBinding.fromContextAndGet
					(
						ship, (c: Ship) => c.devicesUsable(world)
					),
					DataBinding.fromGet
					(
						(c: Device) => c.defn(world).name
					), // bindingForOptionText
					fontNameAndHeight,
					new DataBinding
					(
						ship,
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
					fontNameAndHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						ship,
						(c) => (c.deviceSelected != null)
					),
					() => // click
					{
						var venue = universe.venueCurrent as VenueStarsystem;
						var ship = venue.selectedEntity as Ship;
						var device = ship.deviceSelected;
						device.use(uwpe);
					}
				)
			];

			childControls.push(...childControlsDetailed);
		}

		var returnValue = ControlContainer.from4
		(
			"containerShip",
			Coords.fromXY(0, 0), // pos
			containerSize,
			childControls
		);

		return returnValue;
	}

	// diplomacy

	strategicValue(world: WorldExtended): number
	{
		return 1; // todo
	}

	// turns

	updateForTurn(universe: Universe, world: World, faction: Faction): void
	{
		this.turnTaker().clear();

		var devices = this.devices();
		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, world, null, this, null
		);

		for (var i = 0; i < devices.length; i++)
		{
			var device = devices[i];
			uwpe.entity2Set(device.toEntity(uwpe));
			device.updateForTurn(uwpe);
		}
	}

	// TurnTaker.

	turnTaker(): TurnTaker
	{
		return this.propertyByName(TurnTaker.name) as TurnTaker;
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
