"use strict";
class Faction {
    constructor(name, defnName, homeStarsystemName, homePlanetName, color, diplomacy, technologyResearcher, planets, ships, knowledge, intelligence, visualsForShipsByHullSize) {
        this.name = name;
        this.defnName = defnName;
        this.homeStarsystemName = homeStarsystemName;
        this.homePlanetName = homePlanetName;
        this.color = color;
        this.diplomacy = diplomacy;
        this.technologyResearcher = technologyResearcher;
        this.planets = planets;
        this.ships = ships;
        this.knowledge = knowledge;
        this.intelligence = intelligence;
        this._visualsForShipsByHullSize = visualsForShipsByHullSize; // todo
        this.notificationSession = new NotificationSession(this.name, []);
        this.shipsBuiltSoFarCount = ships.length;
    }
    static fromEntity(entity) {
        return entity.propertyByName(Faction.name);
    }
    static fromName(name) {
        return new Faction(name, null, null, // homeStarsystemName,
        null, // homePlanetName,
        Color.Instances().Red, FactionDiplomacy.fromFactionSelfName(name), TechnologyResearcher.default(), new Array(), new Array(), FactionKnowledge.fromFactionSelfName(name), null, // intelligence
        null // visuals
        );
    }
    static colors() {
        if (Faction._colors == null) {
            var colors = Color.Instances();
            Faction._colors =
                [
                    colors.Red,
                    colors.Orange,
                    colors.Yellow,
                    colors.Green,
                    colors.Blue,
                    colors.Cyan,
                    colors.Violet
                ];
        }
        return Faction._colors;
    }
    abilityCanBeUsed(world) {
        var defn = this.defn();
        var ability = defn.ability;
        var returnValue = ability.isCharged(world);
        return returnValue;
    }
    defn() {
        return FactionDefn.byName(this.defnName);
    }
    detailsView(universe) {
        var factionDetailsAsControl = this.toControl_Details(universe);
        var venueNext = new VenueControls(factionDetailsAsControl, false);
        universe.venueTransitionTo(venueNext);
    }
    isControlledByHuman() {
        return (this.intelligence == FactionIntelligence.Instances().Human);
    }
    researchSessionStart(universe) {
        var researchSession = new TechnologyResearchSession(universe.world.technologyGraph, this.technologyResearcher);
        var venueNext = new VenueTechnologyResearchSession(researchSession);
        universe.venueTransitionTo(venueNext);
    }
    planetAdd(planet) {
        this.planets.push(planet);
        planet.factionable().factionSet(this);
    }
    planetHome(world) {
        return this.starsystemHome(world).planets.find(x => x.name == this.homePlanetName);
    }
    shipAdd(ship) {
        this.ships.push(ship);
        ship.factionable().factionSet(this);
    }
    starsystemHome(world) {
        return world.network.nodeByName(this.homeStarsystemName).starsystem;
    }
    toEntity() {
        return new Entity(Faction.name + "_" + this.name, [this]);
    }
    toString() {
        return this.name;
    }
    visualForShipWithHullSize(hullSize) {
        return this._visualsForShipsByHullSize.get(hullSize);
    }
    // controls
    toControl_ClusterOverlay(universe, containerOuterSize, containerInnerSize, margin, controlHeight, buttonWidth, includeDetailsButton) {
        var fontHeightInPixels = margin;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var faction = this;
        var size = Coords.fromXY(containerInnerSize.x, controlHeight * 2 + margin * 3);
        var labelFaction = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin), // pos
        Coords.fromXY(containerInnerSize.x - margin * 3, controlHeight), // size
        DataBinding.fromContext("Faction:"), fontNameAndHeight);
        var textFaction = ControlLabel.from4Uncentered(Coords.fromXY(margin * 2 + containerInnerSize.x * .3, margin), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContext(faction.name), fontNameAndHeight);
        var labelFactionType = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin * 2), // pos
        Coords.fromXY(containerInnerSize.x - margin * 3, controlHeight), // size
        DataBinding.fromContext("Type:"), fontNameAndHeight);
        var textFactionType = ControlLabel.from4Uncentered(Coords.fromXY(margin * 2 + containerInnerSize.x * .3, margin * 2), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContext(faction.defn().name), fontNameAndHeight);
        var childControls = [
            labelFaction,
            textFaction,
            labelFactionType,
            textFactionType
        ];
        if (includeDetailsButton) {
            var buttonDetails = ControlButton.from8("buttonDetails", Coords.fromXY(margin, margin * 2 + controlHeight), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            "Details", fontNameAndHeight, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            // click
            () => faction.detailsView(universe) // click
            );
            childControls.push(buttonDetails);
        }
        var returnValue = ControlContainer.from4("containerFaction", Coords.fromXY(containerOuterSize.x
            - margin
            - containerInnerSize.x, margin), // pos
        size, childControls);
        return returnValue;
    }
    toControl_Details(universe) {
        var size = universe.display.sizeInPixels;
        var margin = 8;
        var fontHeightInPixels = 10;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var controlHeight = 12;
        var tabButtonSize = Coords.fromXY(4, 2).multiplyScalar(controlHeight);
        var tabbedControlSize = Coords.fromXY(size.x, size.y - tabButtonSize.y - margin - 2 // hack - Why 2?
        );
        var faction = this;
        var controlSize = Coords.fromXY(margin * 16, controlHeight);
        var labelFaction = new ControlLabel("labelFaction", Coords.fromXY(margin, margin), // pos
        controlSize, false, // isTextCenteredHorizontally
        false, // isTextCenteredVertically
        DataBinding.fromContext("Faction:"), fontNameAndHeight);
        var textFaction = new ControlLabel("textFaction", Coords.fromXY(margin * 8, margin), // pos
        controlSize, false, // isTextCenteredHorizontally
        false, // isTextCenteredVertically
        DataBinding.fromContext(faction.name), fontNameAndHeight);
        var labelFactionType = new ControlLabel("labelFactionType", Coords.fromXY(margin, margin * 2), // pos
        controlSize, false, // isTextCenteredHorizontally
        false, // isTextCenteredVertically
        DataBinding.fromContext("Type:"), fontNameAndHeight);
        var textFactionType = new ControlLabel("textFactionType", Coords.fromXY(margin * 8, margin * 2), // pos
        controlSize, false, // isTextCenteredHorizontally
        false, // isTextCenteredVertically
        DataBinding.fromContext(faction.defnName), fontNameAndHeight);
        var labelAbility = new ControlLabel("labelAbility", Coords.fromXY(margin, margin * 3), // pos
        controlSize, false, // isTextCenteredHorizontally
        false, // isTextCenteredVertically
        DataBinding.fromContext("Ability:"), fontNameAndHeight);
        var textAbility = new ControlLabel("textAbility", Coords.fromXY(margin * 8, margin * 3), // pos
        controlSize, false, // isTextCenteredHorizontally
        false, // isTextCenteredVertically
        DataBinding.fromContext(faction.defn().ability.toString(universe.world)), fontNameAndHeight);
        var buttonAbilityUse = ControlButton.from8("buttonAbilityUse", Coords.fromXY(margin * 24, margin * 3), // pos
        controlSize, "Use", fontNameAndHeight, true, // hasBorder
        DataBinding.fromTrue(), // isEnabled
        () => {
            var world = universe.world;
            var faction = world.factionCurrent();
            if (faction.abilityCanBeUsed(world)) {
                var factionDefn = faction.defn();
                factionDefn.ability.perform(world);
            }
            else {
                VenueMessage.fromText("todo - Can't use ability yet.");
            }
        } // click
        );
        var containerStatus = ControlContainer.from4("Status", Coords.create(), tabbedControlSize, 
        // children
        [
            labelFaction, textFaction,
            labelFactionType, textFactionType,
            labelAbility, textAbility, buttonAbilityUse
        ]);
        var containerNotifications = this.notificationSession.toControl(universe, tabbedControlSize);
        var containerDiplomacy = this.toControl_Details_Diplomacy(universe, tabbedControlSize);
        var containerTechnology = this.toControl_Details_Technology(universe, tabbedControlSize);
        var containerPlanets = this.toControl_Details_Planets(universe, tabbedControlSize, margin, controlHeight, fontNameAndHeight);
        var containerShips = this.toControl_Details_Ships(universe, tabbedControlSize, margin, controlHeight, fontNameAndHeight);
        var controlsForTabs = [
            containerStatus,
            containerNotifications,
            containerDiplomacy,
            containerTechnology,
            containerPlanets,
            containerShips
        ];
        var venueToReturnTo = universe.venueCurrent();
        var back = () => universe.venueTransitionTo(venueToReturnTo);
        var returnControl = new ControlTabbed("tabbedItems", Coords.create(), // pos
        size, tabButtonSize, controlsForTabs, fontNameAndHeight, back, faction // context
        );
        return returnControl;
    }
    toControl_Details_Diplomacy(universe, size) {
        var factionCurrent = this;
        var diplomaticSession = DiplomaticSession.demo(factionCurrent, universe.venueCurrent());
        var diplomaticSessionAsControl = diplomaticSession.toControl(universe, size);
        return diplomaticSessionAsControl;
    }
    toControl_Details_Planets(universe, size, margin, controlHeight, fontNameAndHeight) {
        var world = universe.world;
        var faction = this;
        var containerPlanets = ControlContainer.from4("Planets", Coords.create(), size, 
        // children
        [
            new ControlLabel("labelPlanets", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(size.x - margin * 2, controlHeight), // size
            false, // isTextCenteredHorizontally
            false, // isTextCenteredVertically
            DataBinding.fromContext("Planets:"), fontNameAndHeight),
            new ControlLabel("textPlanetCount", Coords.fromXY(margin * 8, margin), // pos
            Coords.fromXY(size.x - margin * 2, controlHeight), // size
            false, // isTextCenteredHorizontally
            false, // isTextCenteredVertically
            DataBinding.fromContextAndGet(faction, (c) => "" + c.planets.length), fontNameAndHeight),
            ControlList.from8("listPlanets", Coords.fromXY(margin, margin * 2 + controlHeight), // pos
            Coords.fromXY(size.x - margin * 2, size.y - margin * 4 - controlHeight * 2), // size
            DataBinding.fromContextAndGet(faction, (c) => faction.planets), // items
            DataBinding.fromGet((c) => c.toStringDescription(universe, world)), // bindingForItemText
            fontNameAndHeight, 
            // dataBindingForItemSelected
            new DataBinding(faction, (c) => c.planetSelected, (c, v) => {
                c.planetSelected = v;
            }), null // bindingForItemValue
            ),
            ControlButton.from8("buttonGoToSelected", Coords.fromXY(margin, size.y - margin - controlHeight), // pos
            Coords.fromXY(5, 1).multiplyScalar(controlHeight), // size
            "Go To", fontNameAndHeight, true, // hasBorder
            DataBinding.fromContextAndGet(faction, (c) => (c.planetSelected != null)), // isEnabled
            () => faction.planetSelected.jumpTo(universe) // click
            ),
        ]);
        return containerPlanets;
    }
    toControl_Details_Ships(universe, size, margin, controlHeight, fontNameAndHeight) {
        var faction = this;
        var containerShips = ControlContainer.from4("Ships", Coords.create(), size, 
        // children
        [
            new ControlLabel("labelShips", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(size.x - margin * 2, controlHeight), // size
            false, // isTextCenteredHorizontally
            false, // isTextCenteredVertically
            DataBinding.fromContext("Ships:"), fontNameAndHeight),
            new ControlLabel("textShipCount", Coords.fromXY(margin * 8, margin), // pos
            Coords.fromXY(size.x - margin * 2, controlHeight), // size
            false, // isTextCenteredHorizontally
            false, // isTextCenteredVertically
            DataBinding.fromContextAndGet(faction, (c) => "" + c.ships.length), fontNameAndHeight),
            ControlList.from8("listShips", Coords.fromXY(margin, margin * 2 + controlHeight), // pos
            Coords.fromXY(size.x - margin * 2, size.y - margin * 4 - controlHeight * 2), // size
            DataBinding.fromContextAndGet(faction, (c) => faction.ships), // items
            DataBinding.fromGet((c) => c.toStringDescription()), // bindingForItemText
            fontNameAndHeight, 
            // dataBindingForItemSelected
            new DataBinding(faction, (c) => c.shipSelected, (c, v) => {
                c.shipSelected = v;
            }), null // bindingForItemValue
            ),
            ControlButton.from8("buttonGoToSelected", Coords.fromXY(margin, size.y - margin - controlHeight), // pos
            Coords.fromXY(5, 1).multiplyScalar(controlHeight), // size
            "Go To", fontNameAndHeight, true, // hasBorder
            DataBinding.fromContextAndGet(faction, (c) => (c.shipSelected != null)), // isEnabled
            () => faction.shipSelected.jumpTo(universe) // click
            ),
        ]);
        return containerShips;
    }
    toControl_Details_Technology(universe, size) {
        var researchSession = new TechnologyResearchSession(universe.world.technologyGraph, this.technologyResearcher);
        var researchSessionAsControl = researchSession.toControl(universe, size);
        return researchSessionAsControl;
    }
    // diplomacy
    allies(world) {
        return this.factionsMatchingRelationshipState(world, DiplomaticRelationship.States().Alliance);
    }
    enemies(world) {
        return this.factionsMatchingRelationshipState(world, DiplomaticRelationship.States().War);
    }
    factionsMatchingRelationshipState(world, stateToMatch) {
        var relationships = this.diplomacy.relationships;
        var relationshipsMatching = relationships.filter(x => x.state == stateToMatch);
        var returnValues = relationshipsMatching.map(x => x.factionOther(world));
        return returnValues;
    }
    relationsInitialize(universe) {
        var diplomaticSessionAsControl = this.toControl_Details_Diplomacy(universe, universe.display.sizeInPixels);
        var venueNext = diplomaticSessionAsControl.toVenue();
        universe.venueTransitionTo(venueNext);
    }
    relationshipByFactionName(factionName) {
        var returnValue = this.diplomacy.relationships.find(x => x.factionNameOther == factionName);
        return returnValue;
    }
    selfAndAllies(world) {
        var returnValues = this.factionsMatchingRelationshipState(world, DiplomaticRelationship.States().Alliance);
        returnValues.push(this);
        return returnValues;
    }
    strategicValue(world) {
        var returnValue = 0;
        var ships = this.ships;
        for (var i = 0; i < ships.length; i++) {
            var ship = ships[i];
            returnValue += ship.strategicValue(world);
        }
        var planets = this.planets;
        for (var i = 0; i < planets.length; i++) {
            var planet = planets[i];
            returnValue += planet.strategicValue(world);
        }
        returnValue += this.technologyResearcher.strategicValue(world);
        return returnValue;
    }
    // notifications
    notificationAdd(notification) {
        this.notificationSession.notificationAdd(notification);
    }
    notificationSessionStart(universe) {
        var notificationSessionAsControl = this.notificationSession.toControl(universe, universe.display.sizeInPixels);
        var venueNext = notificationSessionAsControl.toVenue();
        universe.venueTransitionTo(venueNext);
    }
    notificationsAdd(notificationsToAdd) {
        notificationsToAdd.forEach(x => this.notificationAdd(x));
    }
    notificationsExist() {
        return this.notificationSession.notificationsExist();
    }
    notificationsForRoundAddToArray(universe, notificationsSoFar) {
        var world = universe.world;
        this.planets.forEach(x => x.notificationsForRoundAddToArray(universe, world, this, notificationsSoFar));
        this.ships.forEach(x => x.notificationsForRoundAddToArray(universe, world, this, notificationsSoFar));
        this.technologyResearcher.notificationsForRoundAddToArray(universe, notificationsSoFar);
        return notificationsSoFar;
    }
    // rounds
    researchPerTurn(universe, world) {
        var returnValue = 0;
        for (var i = 0; i < this.planets.length; i++) {
            var planet = this.planets[i];
            var planetResearchThisTurn = planet.researchPerTurn(universe, world, this);
            returnValue += planetResearchThisTurn;
        }
        return returnValue;
    }
    updateForRound(universe, world) {
        for (var i = 0; i < this.planets.length; i++) {
            var planet = this.planets[i];
            planet.updateForRound(universe, world, this);
        }
        for (var i = 0; i < this.ships.length; i++) {
            var ship = this.ships[i];
            ship.updateForRound(universe, world, this);
        }
        this.technologyResearcher.updateForRound(universe, world, this);
    }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) {
        var universe = uwpe.universe;
        var venueCurrent = universe.venueCurrent();
        if (venueCurrent.constructor.name == VenueStarsystem.name) {
            var world = universe.world;
            var venueStarsystem = venueCurrent;
            var noEntitiesAreMovingYet = (venueStarsystem.entityMoving == null);
            if (noEntitiesAreMovingYet) {
                var starsystem = venueStarsystem.starsystem;
                var factionToMove = starsystem.factionToMove(world);
                var isItThisFactionsTurnToMove = (factionToMove == this);
                if (isItThisFactionsTurnToMove && noEntitiesAreMovingYet) {
                    this.intelligence.starsystemMoveChoose(uwpe);
                }
            }
        }
    }
    // Equatable.
    equals(other) {
        return (this.name == other.name);
    }
}
