"use strict";
class Starsystem extends PlaceBase {
    constructor(name, size, star, linkPortals, planets, factionName) {
        super(name, Starsystem.name, // defnName
        null, // parentName
        size, 
        // entities
        ArrayHelper.flattenArrayOfArrays(new Array([star], linkPortals, planets)));
        this.star = star;
        this.linkPortals = linkPortals;
        this.planets = planets;
        this.factionName = factionName;
        this.ships = new Array();
        this.planetsByName = ArrayHelper.addLookupsByName(this.planets);
        // Helper variables
        this.posSaved = Coords.create();
        this.visualElevationStem = new VisualElevationStem();
        var gridColor = Color.Instances().Cyan.clone();
        gridColor.alphaSet(.5);
        this.visualGrid = new VisualGrid(40, 10, gridColor);
    }
    static SizeStandard() {
        if (Starsystem._sizeStandard == null) {
            Starsystem._sizeStandard = new Coords(100, 100, 100);
        }
        return Starsystem._sizeStandard;
    }
    // static methods
    static generateRandom(universe, name) {
        name = name || NameGenerator.generateName();
        var size = Starsystem.SizeStandard();
        var starType = StarType.random();
        var star = Star.fromNameStarTypeAndPos(this.name, starType, new Coords(0, 0, -10) // todo - Why -10?
        );
        var numberOfPlanetsMin = 1;
        var numberOfPlanetsMax = 4;
        var numberOfPlanetsRange = numberOfPlanetsMax - numberOfPlanetsMin;
        var numberOfPlanets = numberOfPlanetsMin + Math.floor(Math.random() * numberOfPlanetsRange);
        var planetsInOrderOfIncreasingDistanceFromSun = new Array();
        for (var i = 0; i < numberOfPlanets; i++) {
            var planetName = name + " " + (i + 1);
            var planetType = PlanetType.random();
            var planetPos = Coords.create().randomize(universe.randomizer).multiply(size).multiplyScalar(2).subtract(size);
            var planetDemographics = new PlanetDemographics(0);
            var planetIndustry = new PlanetIndustry(); // 0, null),
            var planet = new Planet(planetName, planetType, planetPos, null, // factionName
            planetDemographics, planetIndustry, null // layout
            );
            var planetDistanceFromSun = planetPos.magnitude();
            var p = 0;
            for (p = 0; p < planetsInOrderOfIncreasingDistanceFromSun.length; p++) {
                var planetExisting = planetsInOrderOfIncreasingDistanceFromSun[p];
                var planetExistingDistanceFromSun = planetExisting.locatable().loc.pos.magnitude();
                if (planetDistanceFromSun < planetExistingDistanceFromSun) {
                    break;
                }
            }
            planetsInOrderOfIncreasingDistanceFromSun.splice(p, 0, planet);
        }
        var returnValue = new Starsystem(name, size, star, [], // linkPortals - generated later
        planetsInOrderOfIncreasingDistanceFromSun, null // factionName
        );
        return returnValue;
    }
    entitiesForPlanetsLinkPortalsAndShips() {
        if (this._entitiesForPlanetsLinkPortalsAndShips == null) {
            var entities = new Array();
            entities.push(...this.planets);
            entities.push(...this.linkPortals);
            entities.push(...this.ships);
            this._entitiesForPlanetsLinkPortalsAndShips = entities;
        }
        return this._entitiesForPlanetsLinkPortalsAndShips;
    }
    faction(world) {
        return (this.factionName == null ? null : world.factionByName(this.factionName));
    }
    factionSet(faction) {
        this.factionName = faction.name;
    }
    factionToMove(world) {
        if (this._factionToMoveIndex == null) {
            this._factionToMoveIndex = 0;
        }
        var factionsPresent = this.factionsPresent(world);
        var factionToMove = factionsPresent[this._factionToMoveIndex];
        return factionToMove;
    }
    factionToMoveAdvance(world) {
        var factionsPresent = this.factionsPresent(world);
        this._factionToMoveIndex++;
        if (this._factionToMoveIndex >= factionsPresent.length) {
            this._factionToMoveIndex = 0;
        }
    }
    factionsPresent(world) {
        var factionsPresentByName = new Map();
        this.planets.forEach(x => {
            var faction = x.factionable().faction();
            if (faction != null) // Is this necessary?
             {
                var factionName = faction.name;
                if (factionsPresentByName.has(factionName) == false) {
                    factionsPresentByName.set(factionName, faction);
                }
            }
        });
        this.ships.forEach(x => {
            var faction = x.factionable().faction();
            if (faction != null) // Is this necessary?
             {
                var factionName = faction.name;
                if (factionsPresentByName.has(factionName) == false) {
                    factionsPresentByName.set(factionName, faction);
                }
            }
        });
        var factionsPresent = Array.from(factionsPresentByName.keys()).map(factionName => factionsPresentByName.get(factionName));
        return factionsPresent;
    }
    factionSetByName(factionName) {
        this.factionName = factionName;
    }
    jumpTo(universe) {
        var venueStarsystem = new VenueStarsystem(universe.venueCurrent(), this // modelParent
        );
        universe.venueTransitionTo(venueStarsystem);
    }
    linkPortalAdd(linkPortalToAdd) {
        this.linkPortals.push(linkPortalToAdd);
    }
    linkPortalByStarsystemName(starsystemName) {
        if (this._linkPortalsByStarsystemName == null) {
            this._linkPortalsByStarsystemName = ArrayHelper.addLookups(this.linkPortals, x => x.starsystemNamesFromAndTo[1]);
        }
        return this._linkPortalsByStarsystemName.get(starsystemName);
    }
    links(cluster) {
        var returnValues = [];
        for (var i = 0; i < this.linkPortals.length; i++) {
            var linkPortal = this.linkPortals[i];
            var link = linkPortal.link(cluster);
            returnValues.push(link);
        }
        return returnValues;
    }
    notificationsForRoundAddToArray(universe, world, faction, notificationsSoFar) {
        var shipsInStarsystem = this.ships;
        var factions = world.factions;
        var factionForPlayer = factions[0];
        var shipsBelongingToPlayer = shipsInStarsystem.filter(x => x.factionable().faction() == factionForPlayer);
        var factionsPresent = this.factionsPresent(world);
        var factionForPlayerDiplomacy = factionForPlayer.diplomacy;
        var areThereEnemyFactionsPresent = factionsPresent.some(x => factionForPlayerDiplomacy.isAtWarWithFaction(x));
        if (areThereEnemyFactionsPresent) {
            var shipsSleeping = shipsBelongingToPlayer.filter(x => x.sleeping());
            shipsSleeping.forEach(x => x.sleepCancel());
        }
        var areThereShipsWithMovesRemaining = shipsBelongingToPlayer.some(x => x.deviceUser().energyRemainsThisRoundAny());
        var shouldNotify = areThereShipsWithMovesRemaining;
        if (shouldNotify) {
            var message = "There are moves remaining in the "
                + this.name
                + " system.";
            var starsystem = this;
            var notification = new Notification2(message, () => starsystem.jumpTo(universe));
            notificationsSoFar.push(notification);
        }
        return notificationsSoFar;
    }
    planetByName(planetName) {
        return this.planetsByName.get(planetName);
    }
    projectiles() {
        return this.entitiesAll().filter((x) => x.constructor.name == Projectile.name);
    }
    shipAdd(shipToAdd, world) {
        this.entityToSpawnAdd(shipToAdd);
        this.ships.push(shipToAdd);
        shipToAdd.locatable().loc.placeName =
            Starsystem.name + ":" + this.name;
        var factionsInStarsystem = this.factionsPresent(world);
        factionsInStarsystem.forEach(faction => {
            var factionKnowledge = faction.knowledge;
            factionKnowledge.shipAdd(shipToAdd, world);
            factionKnowledge.starsystemAdd(this, world);
        });
    }
    shipRemove(shipToRemove) {
        ArrayHelper.remove(this.ships, shipToRemove);
        this.entityRemove(shipToRemove);
    }
    toVenue() {
        return new VenueStarsystem(null, this);
    }
    // Controls.
    controlBuildMoveRepeatOrPass(universe, pos, size, margin, controlHeight, venueStarsystem) {
        var world = universe.world;
        var margin = universe.display.sizeInPixels.x / 60; // hack
        var fontHeightInPixels = margin;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var buttonHeight = fontHeightInPixels * 1.25;
        var buttonSize = Coords.fromXY(size.x - margin * 3, buttonHeight);
        var buttonHalfSize = buttonSize.clone().multiply(Coords.fromXY(.5, 1));
        var buttonRepeat = ControlButton.from8("buttonRepeat", Coords.fromXY(margin, margin), // pos
        buttonHalfSize, "Repeat", fontNameAndHeight, true, // hasBorder
        DataBinding.fromTrue(), // isEnabled
        () => {
            var venueCurrent = universe.venueCurrent();
            var shipSelected = venueCurrent.entitySelected;
            if (shipSelected != null) {
                var shipFaction = shipSelected.factionable().faction();
                var factionForPlayer = world.factions[0];
                var doesShipBelongToPlayer = (shipFaction == factionForPlayer);
                if (doesShipBelongToPlayer) {
                    shipSelected.moveRepeat(universe);
                }
            }
        });
        var buttonPass = ControlButton.from8("buttonPass", Coords.fromXY(margin * 2 + buttonHalfSize.x, margin), // pos
        buttonHalfSize, "Pass", fontNameAndHeight, true, // hasBorder
        DataBinding.fromTrue(), // isEnabled
        () => {
            var venueCurrent = universe.venueCurrent();
            var shipSelected = venueCurrent.entitySelected;
            if (shipSelected != null) {
                var shipFaction = shipSelected.factionable().faction();
                var factionForPlayer = world.factions[0];
                var doesShipBelongToPlayer = (shipFaction == factionForPlayer);
                if (doesShipBelongToPlayer) {
                    var shipAsDeviceUser = shipSelected.deviceUser();
                    shipAsDeviceUser.energyRemainingThisRoundClear();
                }
            }
        });
        var returnValue = ControlContainer.from3("containerMoveRepeatOrPass", pos.clone(), size.clone(), 
        // children
        [
            buttonRepeat,
            buttonPass
        ]);
        return returnValue;
    }
    controlBuildPlanetsLinksAndShips(universe, pos, size, margin, controlHeight, venueStarsystem) {
        // todo - Move this to starsystem?
        var starsystem = venueStarsystem.starsystem;
        controlHeight /= 2;
        var fontHeightInPixels = margin;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var labelPlanetsLinksShips = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin), // pos
        Coords.fromXY(size.x - margin * 2, controlHeight), // size
        DataBinding.fromContext("Objects:"), // text
        fontNameAndHeight);
        var textPlanetsLinksShipsCount = ControlLabel.from4Uncentered(Coords.fromXY(size.x / 2, margin), // pos
        Coords.fromXY(size.x - margin * 2, controlHeight), // size
        DataBinding.fromContextAndGet(starsystem, (c) => "" + c.entitiesForPlanetsLinkPortalsAndShips().length), fontNameAndHeight);
        var buttonSize = Coords.fromXY((size.x - margin * 3) / 2, controlHeight * 2);
        var listSize = Coords.fromXY(size.x - margin * 2, size.y - margin * 4 - controlHeight * 2 - buttonSize.y);
        var listPlanetsLinksShips = ControlList.from7("listPlanetsLinksShips", Coords.fromXY(margin, margin * 2 + controlHeight * 1), // pos
        listSize, 
        // items
        DataBinding.fromContextAndGet(venueStarsystem, (c) => c.starsystem.entitiesForPlanetsLinkPortalsAndShips()), DataBinding.fromGet((c) => c.name), // bindingForItemText
        fontNameAndHeight, new DataBinding(venueStarsystem, (c) => c.entityHighlighted, (c, v) => c.entityHighlighted = v));
        var buttonSelect = ControlButton.from8("buttonSelect", // name,
        Coords.fromXY(margin, size.y - margin - buttonSize.y), // pos
        buttonSize, "Select", // text,
        fontNameAndHeight, true, // hasBorder
        DataBinding.fromContextAndGet(venueStarsystem, (c) => (c.entityHighlighted != null)), // isEnabled
        () => // click
         venueStarsystem.entitySelected = venueStarsystem.entityHighlighted);
        var buttonTarget = ControlButton.from8("buttonTarget", // name,
        Coords.fromXY(margin * 2 + buttonSize.x, size.y - margin - buttonSize.y), // pos
        buttonSize, "Target", // text,
        fontNameAndHeight, true, // hasBorder
        DataBinding.fromContextAndGet(venueStarsystem, (c) => (c.entitySelected != null)), // isEnabled
        () => alert("todo - target") // click
        );
        var returnValue = new ControlContainer("containerSelected", pos.clone(), size.clone(), 
        // children
        [
            labelPlanetsLinksShips,
            textPlanetsLinksShipsCount,
            listPlanetsLinksShips,
            buttonSelect,
            buttonTarget
        ], null, null // actions, actionToInputsMappings
        );
        return returnValue;
    }
    controlBuildTimeAndPlace(universe, containerMainSize, containerInnerSize, margin, controlHeight) {
        var fontHeightInPixels = margin;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var textPlace = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContextAndGet(universe, (c) => {
            // hack
            var venue = c.venueCurrent();
            return (venue.model == null ? "" : venue.model().name);
        }), fontNameAndHeight);
        var textRoundColonSpace = "Round:";
        var labelRound = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin + controlHeight), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContext(textRoundColonSpace), fontNameAndHeight);
        var textRound = ControlLabel.from4Uncentered(Coords.fromXY(margin + textRoundColonSpace.length * fontHeightInPixels * 0.45, margin + controlHeight), // pos
        Coords.fromXY(containerInnerSize.x - margin * 3, controlHeight), // size
        DataBinding.fromContextAndGet(universe, (c) => "" + (c.world.roundsSoFar + 1)), fontNameAndHeight);
        var childControls = [
            textPlace,
            labelRound,
            textRound
        ];
        var size = Coords.fromXY(containerInnerSize.x, margin * 3 + controlHeight * 2);
        var returnValue = ControlContainer.from4("containerTimeAndPlace", Coords.fromXY(margin, margin), size, childControls);
        return returnValue;
    }
    // moves
    updateForMove() {
        alert("todo");
    }
    // turns
    updateForRound(universe, world) {
        for (var i = 0; i < this.planets.length; i++) {
            var planet = this.planets[i];
            var faction = planet.faction();
            planet.updateForRound(universe, world, faction);
        }
        for (var i = 0; i < this.ships.length; i++) {
            var ship = this.ships[i];
            var faction = ship.faction();
            ship.updateForRound(universe, world, faction);
        }
    }
    // drawing
    camera2(universe) {
        // hack - Get a camera, without a Place.
        var venue = universe.venueCurrent();
        var venueTypeName = venue.constructor.name;
        if (venueTypeName == VenueFader.name) {
            var venueAsVenueFader = venue;
            venue = venueAsVenueFader.venueCurrent();
        }
        var venueAsVenueStarsystem = venue;
        var camera = venueAsVenueStarsystem.cameraEntity.camera();
        return camera;
    }
    draw(universe, world, display) {
        var camera = this.camera2(universe);
        var uwpe = new UniverseWorldPlaceEntities(universe, world, this, null, null);
        this.visualGrid.draw(uwpe, display);
        var projectiles = this.projectiles();
        var bodiesByType = [
            [this.star],
            this.linkPortals,
            this.planets,
            this.ships,
            projectiles
        ];
        var bodyToSortDrawPos = Coords.create();
        var bodySortedDrawPos = Coords.create();
        var bodiesToDrawSorted = new Array();
        for (var t = 0; t < bodiesByType.length; t++) {
            var bodies = bodiesByType[t];
            for (var i = 0; i < bodies.length; i++) {
                var bodyToSort = bodies[i];
                var bodyToSortPos = bodyToSort.locatable().loc.pos;
                camera.coordsTransformWorldToView(bodyToSortDrawPos.overwriteWith(bodyToSortPos));
                var j = 0;
                for (j = 0; j < bodiesToDrawSorted.length; j++) {
                    var bodySorted = bodiesToDrawSorted[j];
                    camera.coordsTransformWorldToView(bodySortedDrawPos.overwriteWith(bodySorted.locatable().loc.pos));
                    if (bodyToSortDrawPos.z >= bodySortedDrawPos.z) {
                        break;
                    }
                }
                ArrayHelper.insertElementAt(bodiesToDrawSorted, bodyToSort, j);
            }
        }
        for (var i = 0; i < bodiesToDrawSorted.length; i++) {
            var body = bodiesToDrawSorted[i];
            this.draw_Body(uwpe.entitySet(body), display);
        }
    }
    draw_Body(uwpe, display) {
        var universe = uwpe.universe;
        var entity = uwpe.entity;
        var bodyPos = entity.locatable().loc.pos;
        this.posSaved.overwriteWith(bodyPos);
        var camera = this.camera2(universe);
        camera.coordsTransformWorldToView(bodyPos);
        var bodyDefn = BodyDefn.fromEntity(uwpe.entity);
        var bodyVisual = bodyDefn.visual;
        bodyVisual.draw(uwpe, display);
        bodyPos.overwriteWith(this.posSaved);
        this.visualElevationStem.draw(uwpe, display);
    }
}
