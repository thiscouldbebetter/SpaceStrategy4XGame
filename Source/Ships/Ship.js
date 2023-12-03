"use strict";
class Ship extends Entity {
    constructor(name, defn, pos, faction, componentEntities) {
        super(name, [
            Actor.default(),
            defn,
            Collidable.fromCollider(Sphere.fromRadiusAndCenter(VisualStar.radiusActual(), pos)),
            new Controllable(Ship.toControl),
            new Factionable(faction.name),
            Killable.fromIntegrityMax(10),
            Locatable.fromPos(pos),
            new Orderable(),
            new TurnTaker()
        ]);
        this.defn = defn;
        this.componentEntities = componentEntities;
    }
    // static methods
    static bodyDefnBuild(color) {
        var scaleFactor = 10;
        var visual = Ship.visualForColorAndScaleFactor(color, scaleFactor);
        var returnValue = new BodyDefn("Ship", Coords.fromXY(1, 1).multiplyScalar(scaleFactor), // size
        visual);
        return returnValue;
    }
    // instance methods
    collideWithEntity(uwpe, target) {
        var ship = this;
        var universe = uwpe.universe;
        var targetBodyDefn = BodyDefn.fromEntity(target);
        var targetDefnName = targetBodyDefn.name;
        if (targetDefnName == LinkPortal.name) {
            var portal = target;
            ship.linkPortalEnter(universe.world.network, portal, ship);
        }
        else if (targetDefnName == Planet.name) {
            var planet = target;
            var venue = universe.venueCurrent();
            var starsystem = venue.starsystem;
            ship.planetOrbitEnter(universe, starsystem, planet);
        }
        else if (targetDefnName == Ship.name) {
            var shipCollidable = ship.collidable();
            var collision = Collision.fromEntitiesColliding(ship, target);
            shipCollidable.collisionHandle(uwpe, collision);
        }
    }
    deviceSelect(deviceToSelect) {
        this._deviceSelected = deviceToSelect;
    }
    deviceSelected() {
        return this._deviceSelected;
    }
    devices() {
        var deviceEntities = this.componentEntities.filter(x => Device.ofEntity(x) != null);
        var devices = deviceEntities.map(x => Device.ofEntity(x));
        return devices;
    }
    faction(world) {
        return this.factionable().faction(world);
    }
    factionable() {
        return this.propertyByName(Factionable.name);
    }
    integrityCurrentOverMax() {
        return this.killable().integrityCurrentOverMax();
    }
    isAwaitingTarget() {
        return (this.deviceSelected != null);
    }
    jumpTo(universe) {
        var starsystem = this.starsystem(universe.world);
        var venueStarsystem = new VenueStarsystem(universe.venueCurrent(), // venueToReturnTo
        starsystem // modelParent
        );
        universe.venueTransitionTo(venueStarsystem);
    }
    link(world) {
        var linkFound = world.network.links.find(x => (x.ships.indexOf(this) >= 0));
        return linkFound;
    }
    nameWithFaction() {
        return this.factionable().factionName + this.name;
    }
    notificationsForRoundAddToArray(universe, world, faction, notificationsSoFar) {
        return notificationsSoFar; // todo
    }
    order() {
        return this.orderable().order;
    }
    orderSet(order) {
        var orderable = Orderable.fromEntity(this);
        orderable.order = order;
    }
    orderable() {
        return Orderable.fromEntity(this);
    }
    planet(world) {
        var planetName = this.locatable().loc.placeName.split(":")[1];
        var starsystemName = planetName.split(" ")[0];
        var starsystem = world.network.starsystemByName(starsystemName);
        var planet = starsystem.planets.find(x => x.ships.indexOf(this) >= 0);
        return planet;
    }
    planetColonize(universe, world) {
        var wasColonizationSuccessful = false;
        var planetBeingOrbited = this.planet(world);
        var planetBeingOrbitedFaction = planetBeingOrbited.factionable().faction(world);
        if (planetBeingOrbited != null
            && planetBeingOrbitedFaction == null) {
            var itemHolder = this.itemHolder();
            var itemDefnNameHub = world.defn.itemDefnByName("Colony Hub").name;
            var hasHub = itemHolder.hasItemWithDefnName(itemDefnNameHub);
            if (hasHub) {
                var itemForHub = itemHolder.itemsByDefnName(itemDefnNameHub)[0];
                var uwpe = new UniverseWorldPlaceEntities(universe, world, null, this, null);
                var entityForHub = itemForHub.toEntity(uwpe);
                var planetBeingOrbitedLayout = planetBeingOrbited.layout(universe);
                var planetMap = planetBeingOrbitedLayout.map;
                var posToBuildAt = planetMap.sizeInCells.clone().half().clearZ();
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
                if (starsystemFactionName == null) {
                    starsystem.factionName = shipFactionName;
                }
                else if (starsystemFactionName != shipFactionName) {
                    // todo - Diplomatic incident.
                }
            }
        }
        return wasColonizationSuccessful;
    }
    starsystem(world) {
        var networkNodeFound = world.network.nodes.find(x => (x.starsystem.ships.indexOf(this) >= 0));
        var starsystemFound = (networkNodeFound == null ? null : networkNodeFound.starsystem);
        return starsystemFound;
    }
    toStringDescription() {
        var returnValue = this.name
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
    devicesDrives() {
        if (this._devicesDrives == null) {
            var devices = this.devices();
            this._devicesDrives = devices.filter(x => x.defn().categoryNames.indexOf("Drive") >= 0);
        }
        return this._devicesDrives;
    }
    devicesUsable() {
        if (this._devicesUsable == null) {
            var devices = this.devices();
            this._devicesUsable =
                devices.filter(x => x.defn().isActive);
        }
        return this._devicesUsable;
    }
    // movement
    linkPortalEnter(cluster, linkPortal, ship) {
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
        if (isLinkForward == false) {
            linkDirection.multiplyScalar(-1);
        }
        shipLoc.vel.overwriteWith(linkDirection);
    }
    linkExit(world, link) {
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
        var portalToExitFrom = starsystemDestination.linkPortalByStarsystemName(starsystemSource.name);
        var exitPos = portalToExitFrom.locatable().loc.pos;
        shipPos.overwriteWith(exitPos).add(Coords.Instances().Ones);
        starsystemDestination.shipAdd(ship, world);
        var shipFaction = ship.faction(world);
        var factionKnowledge = shipFaction.knowledge;
        factionKnowledge.starsystemAdd(starsystemDestination, world);
    }
    moveRepeat(universe) {
        var ship = this;
        var order = Orderable.fromEntity(ship).order;
        if (order != null) {
            order.obey(universe, null, null, ship);
        }
    }
    moveStart(universe) {
        var ship = this;
        var devicesDrives = ship.devicesDrives();
        var deviceDriveToSelect = devicesDrives[0];
        ship.deviceSelect(deviceDriveToSelect);
        var venue = universe.venueCurrent();
        var cursor = venue.cursor;
        var orderDefns = OrderDefn.Instances();
        cursor.entityAndOrderNameSet(ship, orderDefns.Go.name);
    }
    moveTowardTarget(uwpe, target, ship) {
        var turnTaker = this.turnTaker();
        turnTaker.moveShipTowardTarget(uwpe, ship, target);
    }
    movementThroughLinkPerTurn(link) {
        return 8; // todo
    }
    planetOrbitEnter(universe, starsystem, planet) {
        starsystem.shipRemove(this);
        planet.shipAddToOrbit(this);
        this.locatable().loc.placeName =
            Planet.name + ":" + planet.name;
    }
    planetOrbitExit(world, planet) {
        planet.shipLeaveOrbit(this, world);
    }
    // controls
    static toControl(uwpe, size, controlTypeName) {
        var returnValue = null;
        var ship = uwpe.entity;
        if (controlTypeName == Starsystem.name) {
            var universe = uwpe.universe;
            returnValue = ship.toControl_Starsystem(universe, size);
        }
        else if (controlTypeName == "Status") {
            returnValue = ship.toControl_Status(uwpe);
        }
        else {
            throw new Error("Unrecognized controlTypeName: " + controlTypeName);
        }
        return returnValue;
    }
    toControl_Status(uwpe) {
        var containerSize = uwpe.universe.display.sizeInPixels;
        var margin = 8;
        var fontHeightInPixels = 10;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var returnControl = ControlContainer.from4("containerShipStatus", Coords.fromXY(0, 0), // pos
        containerSize, 
        // children
        [
            new ControlLabel("headingShip", Coords.fromXY(margin, margin), Coords.fromXY(containerSize.x, 0), // this.size
            false, // isTextCenteredHorizontally
            false, // isTextCenteredVertically
            DataBinding.fromContext(Ship.name), fontNameAndHeight)
        ]);
        return returnControl;
    }
    toControl_Starsystem(universe, containerSize) {
        var ship = this;
        var world = universe.world;
        var margin = 8;
        var controlSpacing = 16;
        var buttonSize = Coords.fromXY(containerSize.x - margin * 2, 15);
        var buttonHalfSize = buttonSize.clone().multiply(Coords.fromXY(.5, 1));
        var fontHeightInPixels = margin;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var uwpe = new UniverseWorldPlaceEntities(universe, world, null, ship, null);
        var childControls = [
            new ControlLabel("textShipAsSelection", Coords.fromXY(margin, margin), Coords.fromXY(containerSize.x, 0), // this.size
            false, // isTextCenteredHorizontally
            false, // isTextCenteredVertically
            DataBinding.fromContext(this.name), fontNameAndHeight)
        ];
        var shipBelongsToUser = ship.faction(world).isControlledByUser();
        if (shipBelongsToUser) {
            var childControlsDetailed = [
                new ControlLabel("labelIntegrity", Coords.fromXY(margin, margin + controlSpacing), Coords.fromXY(containerSize.x, controlSpacing), // this.size
                false, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                DataBinding.fromContext("H:"), fontNameAndHeight),
                new ControlLabel("textIntegrity", Coords.fromXY(containerSize.x / 4, margin + controlSpacing), Coords.fromXY(containerSize.x, controlSpacing), // this.size
                false, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                DataBinding.fromContextAndGet(ship, (c) => "" + c.integrityCurrentOverMax()), fontNameAndHeight),
                new ControlLabel("labelEnergy", Coords.fromXY(containerSize.x / 2, margin + controlSpacing), Coords.fromXY(containerSize.x, controlSpacing), // this.size
                false, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                DataBinding.fromContext("E:"), fontNameAndHeight),
                new ControlLabel("textEnergy", Coords.fromXY(3 * containerSize.x / 4, margin + controlSpacing), Coords.fromXY(containerSize.x, controlSpacing), // this.size
                false, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                DataBinding.fromContextAndGet(ship, (c) => "" + c.turnTaker().energyThisTurn), fontNameAndHeight),
                ControlButton.from8("buttonMove", Coords.fromXY(margin, margin + controlSpacing * 2), // pos
                buttonHalfSize, "Move", fontNameAndHeight, true, // hasBorder
                DataBinding.fromTrue(), // isEnabled // todo - Disable if depleted.
                () => ship.moveStart(universe)),
                ControlButton.from8("buttonRepeat", Coords.fromXY(margin + buttonHalfSize.x, margin + controlSpacing * 2), // pos
                buttonHalfSize, "Repeat", fontNameAndHeight, true, // hasBorder
                DataBinding.fromTrue(), // isEnabled
                () => ship.moveRepeat(universe) // click
                ),
                new ControlLabel("labelDevices", Coords.fromXY(margin, margin + controlSpacing * 3), // pos
                Coords.fromXY(containerSize.x, 0), // this.size
                false, // isTextCenteredHorizontally
                false, // isTextCenteredVertically
                DataBinding.fromContext("Devices:"), fontNameAndHeight),
                ControlList.from8("listDevices", Coords.fromXY(margin, margin + controlSpacing * 4), // pos
                Coords.fromXY(buttonSize.x, controlSpacing * 4), // size
                // dataBindingForItems
                DataBinding.fromContextAndGet(ship, (c) => c.devicesUsable()), DataBinding.fromGet((c) => c.defn().name), // bindingForOptionText
                fontNameAndHeight, new DataBinding(ship, (c) => c.deviceSelected(), (c, v) => c.deviceSelect(v)), // dataBindingForItemSelected
                DataBinding.fromContext(null) // bindingForItemValue
                ),
                ControlButton.from8("buttonDeviceUse", Coords.fromXY(margin, margin * 2 + controlSpacing * 7.5), // pos
                buttonSize, "Use Device", fontNameAndHeight, true, // hasBorder
                DataBinding.fromContextAndGet(ship, (c) => (c.deviceSelected != null)), () => // click
                 {
                    var venue = universe.venueCurrent();
                    var ship = venue.selectedEntity;
                    var device = ship.deviceSelected();
                    device.use(uwpe);
                })
            ];
            childControls.push(...childControlsDetailed);
        }
        var returnValue = ControlContainer.from4("containerShip", Coords.fromXY(0, 0), // pos
        containerSize, childControls);
        return returnValue;
    }
    // diplomacy
    strategicValue(world) {
        return 1; // todo
    }
    // turns
    updateForRound(universe, world, faction) {
        this.turnTaker().clear();
        var devices = this.devices();
        var uwpe = new UniverseWorldPlaceEntities(universe, world, null, this, null);
        for (var i = 0; i < devices.length; i++) {
            var device = devices[i];
            uwpe.entity2Set(device.toEntity());
            device.updateForRound(uwpe);
        }
    }
    // TurnTaker.
    turnTaker() {
        return this.propertyByName(TurnTaker.name);
    }
    // drawable
    draw(universe, nodeRadiusActual, camera, drawPos) {
        var world = universe.world;
        var display = universe.display;
        var ship = this;
        var shipPos = ship.locatable().loc.pos;
        camera.coordsTransformWorldToView(drawPos.overwriteWith(shipPos));
        var visual = this.visual(world);
        var uwpe = new UniverseWorldPlaceEntities(universe, world, null, ship, null);
        visual.draw(uwpe, display); // todo
    }
    visual(world) {
        return new VisualNone(); // todo
    }
    static visualForColorAndScaleFactor(color, scaleFactor) {
        var visual = new VisualGroup([
            new VisualPolygon(new Path([
                Coords.fromXY(.5, 0).multiplyScalar(scaleFactor),
                Coords.fromXY(-.5, .5).multiplyScalar(scaleFactor),
                Coords.fromXY(-.5, -.5).multiplyScalar(scaleFactor),
            ]), color, Color.Instances().Black, // colorBorder
            false // shouldUseEntityOrientation
            ),
        ]);
        return visual;
    }
}
