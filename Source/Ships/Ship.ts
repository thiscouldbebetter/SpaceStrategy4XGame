
class Ship extends Entity
{
	defn: BodyDefn;
	componentEntities: Entity[];

	_displacement: Coords;
	_visual: VisualBase;

	constructor
	(
		name: string,
		defn: BodyDefn,
		pos: Coords,
		faction: Faction,
		componentEntities: Entity[]
	)
	{
		super
		(
			name,
			[
				Actor.default(),
				defn,
				Ship.collidableBuild(pos),
				new Controllable(Ship.toControl),
				new DeviceUser(),
				new Factionable(faction.name),
				Killable.fromIntegrityMax(10),
				Locatable.fromPos(pos),
				Movable.default(),
				new Orderable(),
				new StarsystemTraverser(100)
			]
		);

		this.defn = defn;
		this.componentEntities = componentEntities;
		
		this._displacement = Coords.create();
	}
	
	// static methods

	static bodyDefnBuild(color: Color): BodyDefn
	{
		var scaleFactor = 10;

		var visual = Ship.visualForColorAndScaleFactor(color, scaleFactor);

		var returnValue = new BodyDefn
		(
			"Ship",
			Coords.fromXY(1, 1).multiplyScalar(scaleFactor), // size
			visual
		);

		return returnValue;
	}

	static collidableBuild(pos: Coords): Collidable
	{
		var collider = Sphere.fromRadiusAndCenter
		(
			VisualStar.radiusActual(), pos
		);

		return Collidable.fromColliderAndCollideEntities
		(
			collider,
			Ship.collideEntities
		);
	}

	static collideEntities(uwpe: UniverseWorldPlaceEntities, collision: Collision): void
	{
		var universe = uwpe.universe;
		var ship = uwpe.entity as Ship;
		var target = uwpe.entity2;

		var targetTypeName = target.constructor.name;
		if (targetTypeName == LinkPortal.name)
		{
			var portal = target as LinkPortal;
			ship.linkPortalEnter(
				(universe.world as WorldExtended).network, portal, ship
			);
		}
		else if (targetTypeName == Planet.name)
		{
			var planet = target as Planet;
			var venue = universe.venueCurrent() as VenueStarsystem;
			var starsystem = venue.starsystem;
			ship.planetOrbitEnter(universe, starsystem, planet);
		}
		else if (targetTypeName == Ship.name)
		{
			var shipCollidable = ship.collidable();
			var collision = Collision.fromEntitiesColliding(ship, target);
			shipCollidable.collisionHandle(uwpe, collision);
		}
		else
		{
			throw new Error("Unexpected collision!");
		}
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
		return (this.orderable().order(this).isAwaitingTarget() );
	}

	jumpTo(universe: Universe): void
	{
		var starsystem =
			this.starsystem(universe.world as WorldExtended);
		var venueStarsystem = new VenueStarsystem
		(
			universe.venueCurrent(), // venueToReturnTo
			starsystem // modelParent
		);
		universe.venueTransitionTo(venueStarsystem);
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

	notificationsForRoundAddToArray
	(
		universe: Universe,
		world: WorldExtended,
		faction: Faction,
		notificationsSoFar: Notification2[]
	): Notification2[]
	{
		return notificationsSoFar; // todo
	}

	order(): Order
	{
		return this.orderable().order(this);
	}

	orderSet(order: Order): void
	{
		var orderable = Orderable.fromEntity(this);
		orderable.orderSet(order);
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

				var planetBeingOrbitedLayout = planetBeingOrbited.layout(universe);
				var planetMap = planetBeingOrbitedLayout.map;
				var posToBuildAt =
					planetMap.sizeInCells.clone().half().clearZ();

				var entityForHubLocatable = Locatable.fromPos(posToBuildAt);
				entityForHub.propertyAdd(entityForHubLocatable);

				planetBeingOrbited.buildableEntityBuild(universe, entityForHub);

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
			+ " - Integrity: " + this.integrityCurrentOverMax();
		
		var order = this.order();
		var orderAsString = order.toStringDescription();

		returnValue +=
			" - " + orderAsString;

		return returnValue;
	}

	// Devices.

	deviceSelect(deviceToSelect: Device): void
	{
		var deviceUser = this.deviceUser();
		deviceUser.deviceSelect(deviceToSelect);

		var order = this.order();
		order.deviceToUseSet(deviceToSelect);
	}

	deviceSelected(): Device
	{
		return this.deviceUser().deviceSelected();
	}

	deviceUser(): DeviceUser
	{
		return DeviceUser.ofEntity(this);
	}

	devices(): Device[]
	{
		return this.deviceUser().devices(this);
	}

	devicesDrives(): Device[]
	{
		return this.deviceUser().devicesDrives(this);
	}

	devicesUsable(): Device[]
	{
		return this.deviceUser().devicesUsable(this);
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

	moveRepeat(universe: Universe): void
	{
		var order = this.order();
		if (order != null)
		{
			var uwpe = new UniverseWorldPlaceEntities(universe, null, null, this, null);
			order.obey(uwpe);
		}
	}

	moveStart(universe: Universe): void
	{
		var devicesDrives = this.devicesDrives();
		var deviceDriveToSelect = devicesDrives[0];
		this.deviceSelect(deviceDriveToSelect);

		var venueStarsystem = universe.venueCurrent() as VenueStarsystem;
		var cursor = venueStarsystem.cursor;
		cursor.clear();
		cursor.entityUsingCursorToTarget = this;

		var order = this.order();
		var orderDefnGo = OrderDefn.Instances().Go;
		order.clear().entityBeingOrderedSet(this).defnSet(orderDefnGo);
	}

	moveTowardTargetAndReturnDistance
	(
		target: Entity
	): number
	{
		var shipPos = this.locatable().loc.pos;
		var targetPos = target.locatable().loc.pos;
		var displacementToTarget =
			this._displacement.overwriteWith(targetPos).subtract(shipPos);
		var distanceToTarget = displacementToTarget.magnitude();
		var speed = 1;
		if (distanceToTarget > speed)
		{
			var directionToTarget = displacementToTarget.divideScalar(distanceToTarget);
			var displacementToMove = directionToTarget.multiplyScalar(speed);
			shipPos.add(displacementToMove);
			distanceToTarget -= speed;
		}
		else
		{
			shipPos.overwriteWith(targetPos);
			distanceToTarget = 0;
		}
		return distanceToTarget;
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
		planet.shipAddToOrbit(this);

		this.locatable().loc.placeName =
			Planet.name + ":" + planet.name;
	}

	planetOrbitExit
	(
		world:  WorldExtended,
		planet: Planet
	): void
	{
		planet.shipLeaveOrbit(this, world);
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
			var labelIntegrity = new ControlLabel
			(
				"labelIntegrity",
				Coords.fromXY(margin, margin + controlSpacing),
				Coords.fromXY(containerSize.x, controlSpacing), // this.size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext("H:"),
				fontNameAndHeight
			);

			var textIntegrity = new ControlLabel
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
			);

			var labelEnergy = new ControlLabel
			(
				"labelEnergy",
				Coords.fromXY(containerSize.x / 2, margin + controlSpacing),
				Coords.fromXY(containerSize.x, controlSpacing), // this.size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext("E:"),
				fontNameAndHeight
			);

			var textEnergy = new ControlLabel
			(
				"textEnergy",
				Coords.fromXY(3 * containerSize.x / 4, margin + controlSpacing),
				Coords.fromXY(containerSize.x, controlSpacing), // this.size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContextAndGet
				(
					ship, (c: Ship) => "todo"
				),
				fontNameAndHeight
			);

			var buttonMove = ControlButton.from8
			(
				"buttonMove",
				Coords.fromXY(margin, margin + controlSpacing * 2), // pos
				buttonHalfSize,
				"Move",
				fontNameAndHeight,
				true, // hasBorder
				DataBinding.fromTrue(), // isEnabled // todo - Disable if depleted.
				() => ship.moveStart(universe)
			);

			var buttonRepeat = ControlButton.from8
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
				() => ship.moveRepeat(universe) // click
			);

			var labelDevices = new ControlLabel
			(
				"labelDevices",
				Coords.fromXY(margin, margin + controlSpacing * 3), // pos
				Coords.fromXY(containerSize.x, 0), // this.size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext("Devices:"),
				fontNameAndHeight
			);

			var listDevices = ControlList.from8
			(
				"listDevices",
				Coords.fromXY(margin, margin + controlSpacing * 4), // pos
				Coords.fromXY(buttonSize.x, controlSpacing * 4), // size
				// dataBindingForItems
				DataBinding.fromContextAndGet
				(
					ship, (c: Ship) => c.devicesUsable()
				),
				DataBinding.fromGet
				(
					(c: Device) => c.defn().name
				), // bindingForOptionText
				fontNameAndHeight,
				new DataBinding
				(
					ship,
					(c: Ship) => c.deviceSelected(),
					(c: Ship, v: Device) => c.deviceSelect(v)
				), // dataBindingForItemSelected
				DataBinding.fromContext(null) // bindingForItemValue
			);

			var buttonDeviceUse = ControlButton.from8
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
					var venue = universe.venueCurrent() as VenueStarsystem;
					var ship = venue.selectedEntity as Ship;
					var device = ship.deviceSelected();
					device.use(uwpe);
				}
			);

			var childControlsDetailed: ControlBase[] =
			[
				labelIntegrity,
				textIntegrity,
				labelEnergy,
				textEnergy,
				buttonMove,
				buttonRepeat,
				labelDevices,
				listDevices,
				buttonDeviceUse
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

	updateForRound(universe: Universe, world: World, faction: Faction): void
	{
		var devices = this.devices();
		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, world, null, this, null
		);

		for (var i = 0; i < devices.length; i++)
		{
			var device = devices[i];
			uwpe.entity2Set(device.toEntity() );
			device.updateForRound(uwpe);
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
		return new VisualNone(); // todo
	}

	static visualForColorAndScaleFactor(color: Color, scaleFactor: number): VisualBase
	{
		var visual = new VisualGroup
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
				Color.Instances().Black, // colorBorder
				false // shouldUseEntityOrientation
			),
		]);

		return visual;
	}
}
