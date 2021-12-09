"use strict";
class Ship extends Entity {
    constructor(name, defn, pos, factionName, items) {
        super(name, [
            Actor.create(),
            defn,
            ItemHolder.fromItems(items),
            Killable.fromIntegrityMax(10),
            Locatable.fromPos(pos),
            new Orderable()
        ]);
        this.defn = defn;
        this.factionName = factionName;
        this.energyThisTurn = 0;
        this.distancePerMove = 0;
        this.shieldingThisTurn = 0;
        // Helper variables.
        this._displacement = Coords.create();
        this.buildable(); // hack
    }
    // static methods
    static bodyDefnBuild(color) {
        var scaleFactor = 10;
        var returnValue = new BodyDefn("Ship", Coords.fromXY(1, 1).multiplyScalar(scaleFactor), // size
        new VisualGroup([
            new VisualPolygon(new Path([
                Coords.fromXY(.5, 0).multiplyScalar(scaleFactor),
                Coords.fromXY(-.5, .5).multiplyScalar(scaleFactor),
                Coords.fromXY(-.5, -.5).multiplyScalar(scaleFactor),
            ]), color, null, // colorBorder?
            false // shouldUseEntityOrientation
            ),
        ]));
        return returnValue;
    }
    buildable() {
        if (this._buildable == null) {
            this._buildable = new Buildable(this.defn.name, Coords.create(), false);
            this.propertyAdd(this._buildable);
        }
        return this._buildable;
    }
    devices() {
        var items = this.itemHolder().items;
        var returnDevices = items.filter(x => x.constructor.name == Device.name);
        return returnDevices;
    }
    devicesByDefnName(deviceDefnName) {
        return this.devices().filter(x => x.defnName == deviceDefnName);
    }
    faction(world) {
        var returnValue = (this.factionName == null
            ? null
            : world.factionByName(this.factionName));
        return returnValue;
    }
    link(world) {
        var linkFound = world.network.links.find(x => (x.ships.indexOf(this) >= 0));
        return linkFound;
    }
    nameWithFaction() {
        return this.factionName + this.name;
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
        if (planetBeingOrbited != null
            && planetBeingOrbited.factionName == null) {
            var itemHolder = this.itemHolder();
            var itemDefnNameHub = world.defn.itemDefnByName("Colony Hub").name;
            var hasHub = itemHolder.hasItemWithDefnName(itemDefnNameHub);
            if (hasHub) {
                var itemForHub = itemHolder.itemsByDefnName(itemDefnNameHub)[0];
                var uwpe = new UniverseWorldPlaceEntities(universe, world, null, this, null);
                var entityForHub = itemForHub.toEntity(uwpe);
                var planetMap = planetBeingOrbited.layout.map;
                var posToBuildAt = planetMap.sizeInCells.clone().half().clearZ();
                var entityForHubLocatable = Locatable.fromPos(posToBuildAt);
                entityForHub.propertyAdd(entityForHubLocatable);
                planetBeingOrbited.buildableEntityBuild(entityForHub);
                planetBeingOrbited.factionName = this.factionName;
                var shipFaction = this.faction(world);
                shipFaction.planetAdd(planetBeingOrbited);
                wasColonizationSuccessful = true;
                var starsystem = this.planet(world).starsystem(world);
                if (starsystem.factionName == null) {
                    starsystem.factionName = this.factionName;
                }
                else if (starsystem.factionName != this.factionName) {
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
    // Devices.
    devicesUsable(world) {
        if (this._devicesUsable == null) {
            this._devicesUsable = [];
            var devices = this.devices();
            for (var i = 0; i < devices.length; i++) {
                var device = devices[i];
                var deviceDefn = device.deviceDefn(world);
                if (deviceDefn.isActive) {
                    this._devicesUsable.push(device);
                }
            }
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
        starsystemDestination.shipAdd(ship);
        var shipFaction = ship.faction(world);
        var factionKnowledge = shipFaction.knowledge;
        var starsystemNamesKnown = factionKnowledge.starsystemNames;
        var starsystemName = starsystemDestination.name;
        if (ArrayHelper.contains(starsystemNamesKnown, starsystemName) == false) {
            starsystemNamesKnown.push(starsystemName);
            var linkPortals = starsystemDestination.linkPortals;
            for (var i = 0; i < linkPortals.length; i++) {
                var linkPortal = linkPortals[i];
                var link = linkPortal.link(cluster);
                var linkName = link.name;
                factionKnowledge.linkNames.push(linkName);
            }
            factionKnowledge.worldKnownUpdate();
        }
    }
    moveTowardTarget(universe, target, ship) {
        if (this.distanceLeftThisMove == null) {
            if (this.energyThisTurn >= this.energyPerMove) {
                this.energyThisTurn -= this.energyPerMove;
                this.distanceLeftThisMove = this.distancePerMove;
            }
        }
        if (this.distanceLeftThisMove > 0) {
            var shipLoc = this.locatable().loc;
            var shipPos = shipLoc.pos;
            var targetLoc = target.locatable().loc;
            var targetPos = targetLoc.pos;
            var displacementToTarget = this._displacement.overwriteWith(targetPos).subtract(shipPos);
            var distanceToTarget = displacementToTarget.magnitude();
            var distanceMaxPerTick = 3; // hack
            var distanceToMoveThisTick = (this.distanceLeftThisMove < distanceMaxPerTick
                ? this.distanceLeftThisMove
                : distanceMaxPerTick);
            if (distanceToTarget < distanceToMoveThisTick) {
                shipPos.overwriteWith(targetPos);
                // hack
                this.distanceLeftThisMove = null;
                this.actor().activity.doNothing();
                universe.inputHelper.isEnabled = true;
                this.order().complete();
                var targetBodyDefn = BodyDefn.fromEntity(target);
                var targetDefnName = targetBodyDefn.name;
                if (targetDefnName == LinkPortal.name) {
                    var portal = target;
                    this.linkPortalEnter(universe.world.network, portal, ship);
                }
                else if (targetDefnName == Planet.name) {
                    var planet = target;
                    var venue = universe.venueCurrent;
                    var starsystem = venue.starsystem;
                    this.planetOrbitEnter(universe, starsystem, planet);
                }
            }
            else {
                var directionToTarget = displacementToTarget.divideScalar(distanceToTarget);
                var shipVel = shipLoc.vel;
                shipVel.overwriteWith(directionToTarget).multiplyScalar(distanceToMoveThisTick);
                shipPos.add(shipVel);
                this.distanceLeftThisMove -= distanceToMoveThisTick;
                if (this.distanceLeftThisMove <= 0) {
                    // hack
                    this.distanceLeftThisMove = null;
                    this.actor().activity.doNothing();
                    universe.inputHelper.isEnabled = true;
                }
            }
        }
    }
    movementThroughLinkPerTurn(link) {
        return 8; // todo
    }
    planetOrbitEnter(universe, starsystem, planet) {
        starsystem.shipRemove(this);
        planet.shipAdd(this);
        this.locatable().loc.placeName =
            Planet.name + ":" + planet.name;
    }
    planetOrbitExit(universe, starsystem, planet) {
        planet.shipRemove(this);
        starsystem.shipAdd(this);
        this.locatable().loc.placeName =
            Starsystem.name + ":" + starsystem.name;
    }
    // controls
    toControl(universe, containerSize) {
        var world = universe.world;
        var margin = 8;
        var controlSpacing = 16;
        var buttonSize = Coords.fromXY(containerSize.x - margin * 2, 15);
        var fontHeightInPixels = margin;
        var uwpe = new UniverseWorldPlaceEntities(universe, universe.world, null, this, null);
        var returnValue = ControlContainer.from4("containerShip", Coords.fromXY(0, 0), // pos
        containerSize, 
        // children
        [
            ControlLabel.from5("textShipAsSelection", Coords.fromXY(margin, margin), Coords.fromXY(containerSize.x, 0), // this.size
            false, // isTextCentered
            DataBinding.fromContext(this.name)),
            ControlLabel.from5("labelIntegrity", Coords.fromXY(margin, margin + controlSpacing), Coords.fromXY(containerSize.x, controlSpacing), // this.size
            false, // isTextCentered
            DataBinding.fromContext("H:")),
            ControlLabel.from5("textIntegrity", Coords.fromXY(containerSize.x / 4, margin + controlSpacing), Coords.fromXY(containerSize.x, controlSpacing), // this.size
            false, // isTextCentered
            DataBinding.fromContextAndGet(this, (c) => "" + c.integrity)),
            ControlLabel.from5("labelEnergy", Coords.fromXY(containerSize.x / 2, margin + controlSpacing), Coords.fromXY(containerSize.x, controlSpacing), // this.size
            false, // isTextCentered
            DataBinding.fromContext("E:")),
            ControlLabel.from5("textEnergy", Coords.fromXY(3 * containerSize.x / 4, margin + controlSpacing), Coords.fromXY(containerSize.x, controlSpacing), // this.size
            false, // isTextCentered
            DataBinding.fromContextAndGet(this, (c) => "" + c.energyThisTurn)),
            ControlButton.from8("buttonView", Coords.fromXY(margin, margin + controlSpacing * 2), // pos
            buttonSize, // size
            "View", fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => alert("todo - view") // click
            ),
            ControlButton.from8("buttonMove", Coords.fromXY(margin, margin + controlSpacing * 3), // pos
            buttonSize, "Move", fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                var venue = universe.venueCurrent;
                var ship = venue.selection;
                var mustTargetBodyFalse = false;
                var orderDefns = OrderDefn.Instances();
                venue.cursor.set(ship, orderDefns.Go.name, mustTargetBodyFalse);
            }),
            ControlButton.from8("buttonRepeat", Coords.fromXY(margin, margin + controlSpacing * 4), // pos
            buttonSize, "Repeat", fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                var venue = universe.venueCurrent;
                var ship = venue.selection;
                var order = Orderable.fromEntity(ship).order;
                if (order != null) {
                    order.obey(universe, null, null, ship);
                }
            }),
            ControlLabel.from5("labelDevices", Coords.fromXY(margin, margin + controlSpacing * 5), // pos
            Coords.fromXY(containerSize.x, 0), // this.size
            false, // isTextCentered
            DataBinding.fromContext("Devices:")),
            ControlList.from8("listDevices", Coords.fromXY(margin, margin + controlSpacing * 6), // pos
            Coords.fromXY(buttonSize.x, controlSpacing * 2), // size
            // dataBindingForItems
            DataBinding.fromContextAndGet(this, (c) => c.devicesUsable(world)), DataBinding.fromGet((c) => c.defn.name), // bindingForOptionText
            fontHeightInPixels, new DataBinding(this, (c) => c.deviceSelected, (c, v) => c.deviceSelected = v), // dataBindingForItemSelected
            DataBinding.fromContext(null) // bindingForItemValue
            ),
            ControlButton.from8("buttonDeviceUse", Coords.fromXY(margin, margin * 2 + controlSpacing * 7.5), // pos
            buttonSize, "Use Device", fontHeightInPixels, true, // hasBorder
            DataBinding.fromContextAndGet(this, (c) => (c.deviceSelected != null)), () => // click
             {
                var venue = universe.venueCurrent;
                var ship = venue.selection;
                var device = ship.deviceSelected;
                device.use(uwpe);
            }),
        ]);
        return returnValue;
    }
    // diplomacy
    strength(world) {
        return 1; // todo
    }
    // turns
    updateForTurn(universe, world, faction) {
        this.energyThisTurn = 0;
        this.distancePerMove = 0;
        this.energyPerMove = 0;
        this.shieldingThisTurn = 0;
        var devices = this.devices();
        var uwpe = new UniverseWorldPlaceEntities(universe, world, null, this, null);
        for (var i = 0; i < devices.length; i++) {
            var device = devices[i];
            uwpe.entity2Set(device.toEntity(uwpe));
            device.updateForTurn(uwpe);
        }
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
        if (this._visual == null) {
            var shipColor = this.faction(world).color;
            this._visual = Ship.visual(shipColor);
        }
        return this._visual;
    }
    static visual(color) {
        var shipSizeMultiplier = 4; // hack
        return new VisualPolygon(new Path([
            Coords.fromXY(0, 0).multiplyScalar(shipSizeMultiplier),
            Coords.fromXY(.5, -1).multiplyScalar(shipSizeMultiplier),
            Coords.fromXY(-.5, -1).multiplyScalar(shipSizeMultiplier)
        ]), color, null, // colorBorder
        false // shouldUseEntityOrientation
        );
    }
}
