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
            var planet = Planet.generateRandom(universe, name, size);
            var planetPos = Locatable.of(planet).loc.pos;
            var planetDistanceFromSun = planetPos.magnitude();
            var p = 0;
            for (p = 0; p < planetsInOrderOfIncreasingDistanceFromSun.length; p++) {
                var planetExisting = planetsInOrderOfIncreasingDistanceFromSun[p];
                var planetExistingDistanceFromSun = Locatable.of(planetExisting).loc.pos.magnitude();
                if (planetDistanceFromSun < planetExistingDistanceFromSun) {
                    break;
                }
            }
            planetsInOrderOfIncreasingDistanceFromSun.splice(p, 0, planet);
        }
        for (var p = 0; p < planetsInOrderOfIncreasingDistanceFromSun.length; p++) {
            var planet = planetsInOrderOfIncreasingDistanceFromSun[p];
            planet.name = name + " " + (p + 1);
        }
        var returnValue = new Starsystem(name, size, star, [], // linkPortals - generated later
        planetsInOrderOfIncreasingDistanceFromSun, null // factionName
        );
        return returnValue;
    }
    // instance methods
    cachesClear() {
        this.entitiesForPlanetsLinkPortalsAndShipsReset();
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
    entitiesForPlanetsLinkPortalsAndShipsReset() {
        this._entitiesForPlanetsLinkPortalsAndShips = null;
    }
    faction(world) {
        return (this.factionName == null ? null : world.starCluster.factionByName(this.factionName));
    }
    factionNameGet(world) {
        var faction = this.faction(world);
        return (faction == null ? "[none]" : faction.name);
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
    linkPortalAdd(universe, linkPortalToAdd) {
        this.linkPortals.push(linkPortalToAdd);
        /*
        // Had to be commented out after Framework upgrade.
        var uwpe = new UniverseWorldPlaceEntities
        (
            universe, universe.world, this, linkPortalToAdd, null
        );
        this.entitySpawn(uwpe);
        */
        this.entityToSpawnAdd(linkPortalToAdd);
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
        var factionForPlayer = world.factionPlayer();
        var shipsBelongingToPlayer = shipsInStarsystem.filter(x => x.factionable().faction() == factionForPlayer);
        var factionsPresent = this.factionsPresent(world);
        var factionForPlayerDiplomacy = factionForPlayer.diplomacy;
        var areThereEnemyFactionsPresent = factionsPresent.some(x => factionForPlayerDiplomacy.factionIsAnEnemy(x));
        var areThereAwakeShipsWithMovesRemaining = shipsBelongingToPlayer.some(x => x.sleeping() == false
            && x.deviceUser().energyRemainsThisRoundAny());
        var shouldNotify = areThereAwakeShipsWithMovesRemaining;
        if (shouldNotify) {
            var message = "There are moves remaining in the "
                + this.name
                + " system"
                + (areThereEnemyFactionsPresent ? ", and enemies are present" : "")
                + ".";
            var starsystem = this;
            var notification = new Notification2(message, () => starsystem.jumpTo(universe));
            notificationsSoFar.push(notification);
        }
        return notificationsSoFar;
    }
    planetAdd(planet) {
        this.planets.push(planet);
    }
    planetByName(planetName) {
        return this.planetsByName.get(planetName);
    }
    projectiles() {
        return this.entitiesAll().filter((x) => x.constructor.name == Projectile.name);
    }
    shipAdd(shipToAdd, uwpe) {
        this.entityToSpawnAdd(shipToAdd);
        var world = uwpe.world;
        var factionsInStarsystem = this.factionsPresent(world);
        var shipFaction = shipToAdd.factionable().faction();
        var factionsInStarsystemEnemy = factionsInStarsystem.filter(x => x.diplomacy.factionIsAnEnemy(shipFaction));
        var shipsBelongingToEnemies = this.ships.filter(x => factionsInStarsystemEnemy.some(y => x.factionable().faction() == y));
        shipsBelongingToEnemies.forEach(x => x.sleepCancel());
        this.ships.push(shipToAdd);
        Locatable.of(shipToAdd).loc.placeNameSet(Starsystem.name + ":" + this.name);
        factionsInStarsystem.forEach(faction => {
            var factionKnowledge = faction.knowledge;
            factionKnowledge.shipAdd(shipToAdd, uwpe);
            factionKnowledge.starsystemAdd(this, uwpe);
        });
        this.cachesClear();
    }
    shipRemove(shipToRemove) {
        ArrayHelper.remove(this.ships, shipToRemove);
        this.entityRemove(UniverseWorldPlaceEntities.fromEntity(shipToRemove));
        this.cachesClear();
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
        var buttonsRepeatAndPassAreEnabled = DataBinding.fromGet(() => {
            var venue = universe.venueCurrent();
            return (venue instanceof VenueStarsystem ? venue.entitiesAreMoving() == false : false);
        });
        var buttonRepeat = ControlButton.fromNamePosSizeTextFontBorderEnabledClick("buttonRepeat", Coords.fromXY(margin, margin), // pos
        buttonHalfSize, "Repeat", fontNameAndHeight, true, // hasBorder
        buttonsRepeatAndPassAreEnabled, () => {
            var venueCurrent = universe.venueCurrent();
            var shipSelected = venueCurrent.entitySelected();
            if (shipSelected != null) {
                var shipFaction = shipSelected.factionable().faction();
                var factionForPlayer = world.factionPlayer();
                var doesShipBelongToPlayer = (shipFaction == factionForPlayer);
                if (doesShipBelongToPlayer) {
                    shipSelected.moveRepeat(universe);
                }
            }
        });
        var buttonPass = ControlButton.fromNamePosSizeTextFontBorderEnabledClick("buttonPass", Coords.fromXY(margin * 2 + buttonHalfSize.x, margin), // pos
        buttonHalfSize, "Pass", fontNameAndHeight, true, // hasBorder
        buttonsRepeatAndPassAreEnabled, () => {
            var venueCurrent = universe.venueCurrent();
            var starsystem = venueCurrent.starsystem;
            starsystem.factionToMoveAdvance(world);
        });
        var returnValue = ControlContainer.fromNamePosSizeAndChildren("containerMoveRepeatOrPass", pos.clone(), size.clone(), 
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
        var labelPlanetsLinksShips = ControlLabel.fromPosSizeTextFontUncentered(Coords.fromXY(margin, margin), // pos
        Coords.fromXY(size.x - margin * 2, controlHeight), // size
        DataBinding.fromContext("Objects:"), // text
        fontNameAndHeight);
        var textPlanetsLinksShipsCount = ControlLabel.fromPosSizeTextFontUncentered(Coords.fromXY(size.x / 2, margin), // pos
        Coords.fromXY(size.x - margin * 2, controlHeight), // size
        DataBinding.fromContextAndGet(starsystem, (c) => "" + c.entitiesForPlanetsLinkPortalsAndShips().length), fontNameAndHeight);
        var buttonSize = Coords.fromXY((size.x - margin * 3) / 2, controlHeight * 2);
        var listSize = Coords.fromXY(size.x - margin * 2, size.y - margin * 4 - controlHeight * 2 - buttonSize.y);
        var listPlanetsLinksShips = ControlList.fromNamePosSizeItemsTextFontSelected("listPlanetsLinksShips", Coords.fromXY(margin, margin * 2 + controlHeight * 1), // pos
        listSize, 
        // items
        DataBinding.fromContextAndGet(venueStarsystem, (c) => c.starsystem.entitiesForPlanetsLinkPortalsAndShips()), DataBinding.fromGet((c) => c.name), // bindingForItemText
        fontNameAndHeight, new DataBinding(venueStarsystem, (c) => c.entityHighlighted, (c, v) => c.entityHighlighted = v));
        var buttonSelect = ControlButton.fromNamePosSizeTextFontBorderEnabledClick("buttonSelect", // name,
        Coords.fromXY(margin, size.y - margin - buttonSize.y), // pos
        buttonSize, "Select", // text,
        fontNameAndHeight, true, // hasBorder
        DataBinding.fromContextAndGet(venueStarsystem, (c) => (c.entityHighlighted != null)), // isEnabled
        () => // click
         venueStarsystem.entitySelect(venueStarsystem.entityHighlighted));
        var buttonTarget = ControlButton.fromNamePosSizeTextFontBorderEnabledClick("buttonTarget", // name,
        Coords.fromXY(margin * 2 + buttonSize.x, size.y - margin - buttonSize.y), // pos
        buttonSize, "Target", // text,
        fontNameAndHeight, true, // hasBorder
        DataBinding.fromContextAndGet(venueStarsystem, (c) => (c.entitySelected() != null)), // isEnabled
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
        var starsystem = this;
        var world = universe.world;
        var fontHeightInPixels = margin;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var textPlace = ControlLabel.fromPosSizeTextFontUncentered(Coords.fromXY(margin, margin), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContextAndGet(starsystem, c => c.name + " System"), fontNameAndHeight);
        var textLiteralOwnedBy = "Owned by:";
        var labelOwnedBy = ControlLabel.fromPosSizeTextFontUncentered(Coords.fromXY(margin, margin + controlHeight), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContext(textLiteralOwnedBy), fontNameAndHeight);
        var textOwnedBy = ControlLabel.fromPosSizeTextFontUncentered(Coords.fromXY(margin + textLiteralOwnedBy.length * fontHeightInPixels * 0.45, margin + controlHeight), // pos
        Coords.fromXY(containerInnerSize.x - margin * 3, controlHeight), // size
        DataBinding.fromContextAndGet(starsystem, c => c.factionNameGet(world)), fontNameAndHeight);
        var childControls = [
            textPlace,
            labelOwnedBy,
            textOwnedBy
        ];
        var size = Coords.fromXY(containerInnerSize.x, margin * 3 + controlHeight * 2);
        var returnValue = ControlContainer.fromNamePosSizeAndChildren("containerTimeAndPlace", Coords.fromXY(margin, margin), size, childControls);
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
        var camera = Camera.of(venueAsVenueStarsystem.cameraEntity);
        return camera;
    }
    draw(universe, world, display) {
        var uwpe = new UniverseWorldPlaceEntities(universe, world, this, null, null);
        this.visualGrid.draw(uwpe, display);
        var entitiesDrawable = Drawable.entitiesFromPlace(this);
        var displayFarToNear = new DisplayFarToNear(universe.display);
        universe.display = displayFarToNear;
        entitiesDrawable.forEach(entityDrawable => {
            uwpe.entitySet(entityDrawable);
            var drawable = Drawable.of(entityDrawable);
            drawable.draw(uwpe);
        });
        displayFarToNear.flush();
        universe.display = displayFarToNear.displayInner;
    }
    draw_Body(uwpe, display) {
        var universe = uwpe.universe;
        var entity = uwpe.entity;
        var bodyPos = Locatable.of(entity).loc.pos;
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
