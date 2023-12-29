
class Ship extends Entity
{
	defn: BodyDefn;
	hullSize: ShipHullSize;
	componentEntities: Entity[];

	_displacement: Coords;
	_visual: VisualBase;

	constructor
	(
		name: string,
		hullSize: ShipHullSize,
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
				Drawable.fromVisual(Ship.visualForColorAndScaleFactor(faction.color, 10) ),
				new Factionable(faction),
				Ship.killableBuild(hullSize, faction),
				Locatable.fromPos(pos),
				Movable.default(),
				new Orderable()
			]
		);

		this.defn = defn;
		this.hullSize = hullSize;
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
			Ship.name,
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
				(universe.world as WorldExtended).starCluster, portal, ship
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
			// todo - ship-ship collision
		}
		else
		{
			// Do nothing.
			// throw new Error("Unexpected collision!");
		}
	}

	static killableBuild(hullSize: ShipHullSize, faction: Faction): Killable
	{
		var factionDefn = faction.defn();

		var integrityMax =
			hullSize.integrityMax
			* factionDefn.shipHullIntegrityMultiplier;

		return Killable.fromIntegrityMaxAndDie
		(
			integrityMax,
			Ship.killableDie
		)
	}

	static killableDie(uwpe: UniverseWorldPlaceEntities): void
	{
		// todo
		console.log("todo - Ship.die()");
	}

	faction(): Faction
	{
		return this.factionable().faction();
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
	
	link(world: WorldExtended): StarClusterLink
	{
		var linkFound = world.starCluster.links.find
		(
			x => (x.ships.indexOf(this) >= 0)
		);

		return linkFound
	}

	nameWithFaction(): string
	{
		return this.factionable().faction().name + "_" + this.name;
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
		var starsystem = world.starCluster.starsystemByName(starsystemName);

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
		var planetBeingOrbitedFaction = planetBeingOrbited.factionable().faction();

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

				var shipFaction = this.factionable().faction();

				planetBeingOrbited.factionable().factionSet(shipFaction);
				shipFaction.planetAdd(planetBeingOrbited);

				wasColonizationSuccessful = true;

				var planet = this.planet(world);
				var starsystem = planet.starsystem(world);
				var starsystemFaction = starsystem.faction(world);
				if (starsystemFaction == null)
				{
					starsystem.factionSet(shipFaction);
				}
				else if (starsystemFaction != shipFaction)
				{
					// todo - Diplomatic incident.
				}
			}
		}

		return wasColonizationSuccessful;
	}

	sleepCancel(): void
	{
		var isSleeping = this.sleeping();
		if (isSleeping)
		{
			var order = this.order();
			var orderDefnDoNothing = OrderDefn.Instances().DoNothing;
			order.defnSet(orderDefnDoNothing);
		}
	}

	sleeping(): boolean
	{
		var order = this.order();
		var isSleeping = (order.defn == OrderDefn.Instances().Sleep);
		return isSleeping;
	}

	starsystem(world: WorldExtended): Starsystem
	{
		var starClusterNodeFound = world.starCluster.nodes.find
		(
			x => (x.starsystem.ships.indexOf(this) >= 0)
		);

		var starsystemFound =
		(
			starClusterNodeFound == null ? null : starClusterNodeFound.starsystem
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

	deviceUseStart(universe: Universe): void
	{
		var venueStarsystem = universe.venueCurrent() as VenueStarsystem;
		var cursor = venueStarsystem.cursor;
		cursor.clear();
		cursor.entityUsingCursorToTarget = this;

		var order = this.order();
		order.clear();

		order.entityBeingOrderedSet(this)

		var orderDefnAttack = OrderDefn.Instances().UseDevice;
		order.defnSet(orderDefnAttack)

		var deviceUser = this.deviceUser();
		var deviceSelected = deviceUser.deviceSelected();
		order.deviceToUseSet(deviceSelected);
	}

	deviceUser(): DeviceUser { return DeviceUser.ofEntity(this); }

	// movement

	linkPortalEnter
	(
		cluster: StarCluster,
		linkPortal: LinkPortal,
		ship: Ship
	): void
	{
		var deviceUser = ship.deviceUser();
		var starlaneDrives = deviceUser.devicesStarlaneDrives(ship);
		if (starlaneDrives.length == 0)
		{
			this.nudgeInFrontOfEntityIfTouching(linkPortal);
		}
		else
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

			shipLoc.placeName = StarClusterLink.name + ":" + link.name;

			var nodeFrom = (isLinkForward ? linkNode0 : linkNode1);
			shipLoc.pos.overwriteWith(nodeFrom.locatable().loc.pos);

			var linkDirection = link.displacement(cluster).normalize();
			if (isLinkForward == false)
			{
				linkDirection.multiplyScalar(-1)
			}
			shipLoc.vel.overwriteWith(linkDirection);
		}
	}

	linkExit(world: WorldExtended, link: StarClusterLink): void
	{
		var ship = this;
		link.shipRemove(ship); // todo

		var cluster = world.starCluster;
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

		var shipFaction = ship.faction();
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

	moveSleepOrWake(): void
	{
		var wasSleeping = this.sleeping();
		var order = this.order();
		var orders = OrderDefn.Instances();
		var orderDefnToSet = wasSleeping ? orders.DoNothing : orders.Sleep;
		order.clear();
		order.defnSet(orderDefnToSet);
	}

	moveStart(universe: Universe): void
	{
		var deviceUser = this.deviceUser();
		var devicesDrives = deviceUser.devicesDrives(this);
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

	nudgeInFrontOfEntityIfTouching(entityToNudgeInFrontOf: Entity): void
	{
		// For adding visual separation between two formerly colliding entities.

		var shipToNudge = this;

		var shipToNudgePos = shipToNudge.locatable().loc.pos;
		var entityToNudgeInFrontOfPos =
			entityToNudgeInFrontOf.locatable().loc.pos;

		var distanceBetweenShipAndEntity = this._displacement.overwriteWith
		(
			entityToNudgeInFrontOfPos
		).subtract
		(
			shipToNudgePos
		).magnitude();

		var distanceBetweenShipAndEntityMin = 3;
		var isShipTooCloseToEntity =
			(distanceBetweenShipAndEntity < distanceBetweenShipAndEntityMin);

		if (isShipTooCloseToEntity)
		{
			var displacement = this._displacement.overwriteWith
			(
				Coords.Instances().ZeroOneZero
			).multiplyScalar
			(
				distanceBetweenShipAndEntityMin
			);

			shipToNudgePos.overwriteWith(entityToNudgeInFrontOfPos).add(displacement);
		}
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

	private _speedThroughLinkThisRound: number;

	speedThroughLinkThisRound(link: StarClusterLink): number
	{
		var linkFrictionDivisor = link.frictionDivisor();

		if (this._speedThroughLinkThisRound == null)
		{
			var deviceUser = this.deviceUser();
			var starlaneDrivesAsDevices = deviceUser.devicesStarlaneDrives(this);

			var uwpe = UniverseWorldPlaceEntities.create().entitySet(this);

			for (var i = 0; i < starlaneDrivesAsDevices.length; i++)
			{
				var starlaneDrive = starlaneDrivesAsDevices[i];
				// uwpe.entity2Set(starlaneDrive);
				starlaneDrive.use(uwpe);
			}

			var shipFaction = this.factionable().faction();
			var shipFactionDefn = shipFaction.defn();

			this._speedThroughLinkThisRound
				*= shipFactionDefn.starlaneTravelSpeedMultiplier;

			this._speedThroughLinkThisRound
				/= linkFrictionDivisor;
		}

		return this._speedThroughLinkThisRound;
	}

	speedThroughLinkThisRoundReset(): void
	{
		this._speedThroughLinkThisRound = null;
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

	toControl_Starsystem
	(
		universe: Universe, containerSize: Coords
	): ControlBase
	{
		var ship = this;

		var world = universe.world as WorldExtended;

		var margin = universe.display.sizeInPixels.x / 60; // hack

		var fontHeightInPixels = margin;
		var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);

		var buttonHeight = fontHeightInPixels * 1.25;

		var buttonSize = Coords.fromXY
		(
			containerSize.x - margin * 2,
			buttonHeight
		);
		var buttonHalfSize =
			buttonSize.clone().multiply(Coords.fromXY(.5, 1));

		var labelHeight = fontHeightInPixels;

		var labelSize = Coords.fromXY(containerSize.x - margin * 2, fontHeightInPixels);

		var childControls = new Array<ControlBase>();

		var shipFaction = ship.faction();
		var factionCurrent = world.factionCurrent();
		var shipBelongsToFactionCurrent = (shipFaction == factionCurrent);

		var starsystem = this.starsystem(world);
		var shipsInStarsystem = starsystem.ships;
		var shipsBelongingToFactionCurrent = shipsInStarsystem.filter
		(
			x => x.factionable().faction() == factionCurrent
		);
		var displacement = this._displacement;
		var shipIsWithinSensorRange = shipsBelongingToFactionCurrent.some
		(
			shipSensing =>
			{
				var sensorRange = shipSensing.deviceUser().sensorRange(shipSensing);

				var shipSensingPos = shipSensing.locatable().loc.pos;
				var shipBeingSensedPos = ship.locatable().loc.pos;

				var distance = displacement.overwriteWith
				(
					shipBeingSensedPos
				).subtract
				(
					shipSensingPos
				).magnitude();

				var isWithinRange = (distance <= sensorRange);

				return isWithinRange;
			}
		);

		var shipVitalsAreVisible =
			shipBelongsToFactionCurrent
			|| shipIsWithinSensorRange;

		if (shipVitalsAreVisible)
		{
			var labelIntegrity = ControlLabel.from4Uncentered
			(
				Coords.fromXY(margin, margin),
				labelSize,
				DataBinding.fromContext("Hull:"),
				fontNameAndHeight
			);

			var textIntegrity = ControlLabel.from4Uncentered
			(
				Coords.fromXY(containerSize.x / 4, margin),
				labelSize,
				DataBinding.fromContextAndGet
				(
					ship, (c: Ship) => "" + c.integrityCurrentOverMax()
				),
				fontNameAndHeight
			);

			var labelEnergy = ControlLabel.from4Uncentered
			(
				Coords.fromXY(containerSize.x / 2, margin),
				labelSize,
				DataBinding.fromContext("Energy:"),
				fontNameAndHeight
			);

			var textEnergy = ControlLabel.from4Uncentered
			(
				Coords.fromXY(containerSize.x * 3/4, margin),
				labelSize,
				DataBinding.fromContextAndGet
				(
					ship,
					(c: Ship) => "" + c.deviceUser().energyRemainingOverMax(c)
				),
				fontNameAndHeight
			);

			var childControlsVitals: ControlBase[] =
			[
				labelIntegrity,
				textIntegrity,
				labelEnergy,
				textEnergy
			];

			childControls.push(...childControlsVitals);
		}

		var shipIsCommandable = shipBelongsToFactionCurrent;

		if (shipIsCommandable)
		{
			var buttonMove = ControlButton.from8
			(
				"buttonMove",
				Coords.fromXY
				(
					margin,
					margin * 2 + labelHeight
				), // pos
				buttonHalfSize,
				"Move",
				fontNameAndHeight,
				true, // hasBorder
				DataBinding.fromTrue(), // isEnabled // todo - Disable if depleted.
				() => ship.moveStart(universe)
			);

			var buttonSleep = ControlButton.from8WithTextAsBinding<Ship>
			(
				"buttonSleep",
				Coords.fromXY
				(
					margin + buttonHalfSize.x,
					margin * 2 + labelHeight
				), // pos
				buttonHalfSize,
				DataBinding.fromContextAndGet<Ship, string>
				(
					this,
					(c: Ship) => c.sleeping() ? "Wake" : "Sleep"
				),
				fontNameAndHeight,
				true, // hasBorder
				DataBinding.fromTrueWithContext<Ship>(ship), // isEnabled
				() => ship.moveSleepOrWake() // click
			);

			var labelDevices = ControlLabel.from4Uncentered
			(
				Coords.fromXY
				(
					margin,
					margin * 3 + labelHeight + buttonHeight
				), // pos
				labelSize,
				DataBinding.fromContext("Devices:"),
				fontNameAndHeight
			);

			var listSize = Coords.fromXY
			(
				containerSize.x - margin  * 2,
				containerSize.y - margin * 4 - labelHeight - buttonHeight * 2
			); // size

			var listPos = Coords.fromXY
			(
				margin,
				margin * 3 + labelHeight + buttonHeight
			); // pos

			var listDevices = ControlList.from8
			(
				"listDevices",
				listPos,
				listSize,
				// dataBindingForItems
				DataBinding.fromContextAndGet
				(
					ship, (c: Ship) => c.deviceUser().devicesUsable(c)
				),
				DataBinding.fromGet
				(
					(c: Device) => c.nameAndUsesRemainingThisRound()
				), // bindingForOptionText
				fontNameAndHeight,
				new DataBinding
				(
					ship,
					(c: Ship) => c.deviceUser().deviceSelected(),
					(c: Ship, v: Device) => c.deviceSelect(v)
				), // dataBindingForItemSelected
				DataBinding.fromContext(null) // bindingForItemValue
			);

			var buttonDeviceUse = ControlButton.from8
			(
				"buttonDeviceUse",
				Coords.fromXY(margin, listPos.y + listSize.y), // pos
				buttonSize,
				"Use Device",
				fontNameAndHeight,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					ship,
					(c) => (c.deviceUser().deviceSelectedCanBeUsedThisRound() )
				), // isEnabled
				() => // click
				{
					var venue = universe.venueCurrent() as VenueStarsystem;
					var ship = venue.entitySelected() as Ship;
					ship.deviceUseStart(universe);
				}
			);

			var childControlsCommands: ControlBase[] =
			[
				buttonMove,
				buttonSleep,
				labelDevices,
				listDevices,
				buttonDeviceUse
			];

			childControls.push(...childControlsCommands);
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
		var returnValue =
			this.hullSize.strategicValue();

		this.componentEntities.forEach
		(
			(x: Entity) =>
			{
				returnValue += Buildable.ofEntity(x).defn.strategicValue();
			}
		);

		return returnValue;
	}

	// Rounds.

	updateForRound(universe: Universe, world: World, faction: Faction): void
	{
		var deviceUser = this.deviceUser();

		deviceUser.reset();

		var devices = deviceUser.devices(this);
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

		deviceUser.energyRemainingThisRoundReset(this);
	}

	/*
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
	*/

	visual(world: WorldExtended): VisualBase
	{
		return new VisualNone(); // todo
	}

	static visualForColorAndScaleFactor(color: Color, scaleFactor: number): VisualBase
	{
		var visual: VisualBase = new VisualGroup
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

		visual = new VisualCameraProjection
		(
			uwpe => (uwpe.place as Starsystem).camera2(uwpe.universe),
			visual
		);

		visual = new VisualGroup
		([
			new VisualElevationStem(),
			visual
		]);

		return visual;
	}
}
