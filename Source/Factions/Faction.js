"use strict";
class Faction {
    constructor(name, homeStarsystemName, homePlanetName, color, relationships, technologyResearcher, planets, ships, knowledge) {
        this.name = name;
        this.homeStarsystemName = homeStarsystemName;
        this.homePlanetName = homePlanetName;
        this.color = color;
        this.relationships = relationships;
        this.technologyResearcher = technologyResearcher;
        this.planets = planets;
        this.ships = ships;
        this.knowledge = knowledge;
        this.notificationSession = new NotificationSession(this.name, []);
        this.relationshipsByFactionName = ArrayHelper.addLookups(this.relationships, (x) => x.factionNameOther);
        this.shipsBuiltSoFarCount = 0;
    }
    static fromName(name) {
        return new Faction(name, null, // homeStarsystemName,
        null, // homePlanetName,
        Color.Instances().Red, new Array(), TechnologyResearcher.default(), new Array(), new Array(), FactionKnowledge.default());
    }
    detailsView(universe) {
        var factionDetailsAsControl = this.toControl_Details(universe);
        var venueNext = new VenueControls(factionDetailsAsControl, false);
        universe.venueNext = venueNext;
    }
    researchSessionStart(universe) {
        var researchSession = new TechnologyResearchSession(universe.world.technologyTree, this.technologyResearcher);
        var venueNext = new VenueTechnologyResearchSession(researchSession);
        venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
        universe.venueNext = venueNext;
    }
    planetAdd(planet) {
        this.planets.push(planet);
    }
    planetHome(world) {
        return this.starsystemHome(world).planets.find(x => x.name == this.homePlanetName);
    }
    starsystemHome(world) {
        return world.network.nodeByName(this.homeStarsystemName).starsystem;
    }
    toString() {
        return this.name;
    }
    // controls
    toControl_ClusterOverlay(universe, containerOuterSize, containerInnerSize, margin, controlHeight, buttonWidth) {
        var fontHeightInPixels = 10;
        var faction = this;
        var size = Coords.fromXY(containerInnerSize.x, controlHeight * 2 + margin * 3);
        var returnValue = ControlContainer.from4("containerFaction", Coords.fromXY(containerOuterSize.x
            - margin
            - containerInnerSize.x, margin), // pos
        size, 
        // children
        [
            new ControlLabel("labelFaction", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(containerInnerSize.x - margin * 3, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("Faction:"), fontHeightInPixels),
            new ControlLabel("textFaction", Coords.fromXY(margin * 2 + containerInnerSize.x * .3, margin), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext(faction.name), fontHeightInPixels),
            ControlButton.from8("buttonDetails", Coords.fromXY(margin, margin * 2 + controlHeight), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            "Details", fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            // click
            () => faction.detailsView(universe) // click
            )
        ]);
        return returnValue;
    }
    static toControl_Intelligence(diplomaticSession, pos, containerSize) {
        var margin = 10;
        var controlSpacing = 20;
        var listWidth = 100;
        var columnWidth = 60;
        var fontHeightInPixels = 10;
        var returnValue = ControlContainer.from4("containerFactionIntelligence", pos, containerSize, 
        // children
        [
            new ControlLabel("labelFaction", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(columnWidth, controlSpacing), // size
            false, // isTextCentered
            DataBinding.fromContext("Faction:"), fontHeightInPixels),
            new ControlLabel("textFaction", Coords.fromXY(margin * 2 + columnWidth, margin), // pos
            Coords.fromXY(columnWidth, controlSpacing), // size,
            false, // isTextCentered
            DataBinding.fromContextAndGet(diplomaticSession, (c) => (c.factionSelected == null ? "[none]" : c.factionSelected.name)), fontHeightInPixels),
            new ControlLabel("labelRelationship", Coords.fromXY(margin, margin + controlSpacing), // pos
            Coords.fromXY(columnWidth, controlSpacing), // size
            false, // isTextCentered
            DataBinding.fromContext("Relationship:"), fontHeightInPixels),
            new ControlLabel("textRelationship", Coords.fromXY(margin + columnWidth, margin + controlSpacing), // pos
            Coords.fromXY(columnWidth, controlSpacing), // size,
            false, // isTextCentered
            DataBinding.fromContext("[relationship]"), fontHeightInPixels),
            new ControlLabel("labelPlanets", Coords.fromXY(margin, margin + controlSpacing * 2), // pos
            Coords.fromXY(columnWidth, controlSpacing), // size
            false, // isTextCentered
            DataBinding.fromContext("Planets:"), fontHeightInPixels),
            ControlList.from8("listPlanets", Coords.fromXY(margin, margin + controlSpacing * 3), // pos
            Coords.fromXY(listWidth, controlSpacing * 4), // size
            new DataBinding(diplomaticSession, (c) => (c.factionSelected == null ? new Array() : c.factionSelected.planets), null), // items
            DataBinding.fromGet((c) => "todo" // bindingForItemText,
            ), fontHeightInPixels, 
            // dataBindingForItemSelected
            new DataBinding(diplomaticSession, (c) => (c.factionSelected == null ? null : c.factionSelected.planetSelected), (c, v) => {
                if (c.factionSelected != null) {
                    c.factionSelected.planetSelected = v;
                }
            }), null // bindingForItemValue
            ),
            new ControlLabel("labelShips", Coords.fromXY(margin, margin + controlSpacing * 7), // pos
            Coords.fromXY(columnWidth, controlSpacing), // size
            false, // isTextCentered
            DataBinding.fromContext("Ships:"), fontHeightInPixels),
            ControlList.from7("listShips", Coords.fromXY(margin, margin + controlSpacing * 8), // pos
            Coords.fromXY(listWidth, controlSpacing * 4), // size
            DataBinding.fromContextAndGet(diplomaticSession, (c) => (c.factionSelected == null ? new Array() : c.factionSelected.ships)), // options
            DataBinding.fromGet((c) => "todo"), // bindingForOptionText,
            null, // fontHeightInPixels
            // dataBindingForValueSelected
            new DataBinding(diplomaticSession, (c) => (c.factionSelected == null ? null : c.factionSelected.shipSelected), (c, v) => {
                if (c.factionSelected != null) {
                    c.factionSelected.shipSelected = v;
                }
            })),
        ]);
        return returnValue;
    }
    toControl_Details(universe) {
        var size = universe.display.sizeInPixels;
        var margin = 8;
        var fontHeightInPixels = 10;
        var controlHeight = 12;
        var tabButtonSize = Coords.fromXY(4, 2).multiplyScalar(controlHeight);
        var tabbedControlSize = Coords.fromXY(size.x, size.y - tabButtonSize.y - margin);
        var faction = this;
        var containerStatus = ControlContainer.from4("Status", Coords.create(), tabbedControlSize, 
        // children
        [
            new ControlLabel("labelFaction", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(tabbedControlSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("Faction:"), fontHeightInPixels),
            new ControlLabel("textBoxFaction", Coords.fromXY(margin * 8, margin), // pos
            Coords.fromXY(tabbedControlSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext(faction.name), fontHeightInPixels),
        ]);
        var containerNotifications = this.toControl_Details_Notifications(universe, tabbedControlSize);
        var containerDiplomacy = this.toControl_Details_Diplomacy(universe, tabbedControlSize);
        var containerTechnology = this.toControl_Details_Technology(universe, tabbedControlSize);
        var containerPlanets = this.toControl_Details_Planets(universe, tabbedControlSize, margin, controlHeight, fontHeightInPixels);
        var containerShips = this.toControl_Details_Ships(universe, tabbedControlSize, margin, controlHeight, fontHeightInPixels);
        var controlsForTabs = [
            containerStatus,
            containerNotifications,
            containerDiplomacy,
            containerTechnology,
            containerPlanets,
            containerShips
        ];
        var venueToReturnTo = universe.venueCurrent;
        var back = () => universe.venueNext = venueToReturnTo;
        var returnControl = new ControlTabbed("tabbedItems", Coords.create(), // pos
        size, tabButtonSize, controlsForTabs, fontHeightInPixels, back, faction // context
        );
        return returnControl;
    }
    toControl_Details_Diplomacy(universe, size) {
        var world = universe.world;
        var factionCurrent = this;
        var factionsOther = world.factionsOtherThan(factionCurrent);
        var diplomaticSession = DiplomaticSession.demo(factionCurrent, factionsOther, universe.venueCurrent);
        var diplomaticSessionAsControl = diplomaticSession.toControl(universe, size);
        return diplomaticSessionAsControl;
    }
    toControl_Details_Notifications(universe, size) {
        return this.notificationSession.toControl(universe, size);
    }
    toControl_Details_Planets(universe, size, margin, controlHeight, fontHeightInPixels) {
        var world = universe.world;
        var faction = this;
        var containerPlanets = ControlContainer.from4("Planets", Coords.create(), size, 
        // children
        [
            new ControlLabel("labelPlanets", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(size.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("Planets:"), fontHeightInPixels),
            new ControlLabel("textPlanetCount", Coords.fromXY(margin * 8, margin), // pos
            Coords.fromXY(size.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(faction, (c) => "" + c.planets.length), fontHeightInPixels),
            ControlList.from8("listPlanets", Coords.fromXY(margin, margin * 2 + controlHeight), // pos
            Coords.fromXY(size.x - margin * 2, size.y - margin * 4 - controlHeight * 2), // size
            DataBinding.fromContextAndGet(faction, (c) => faction.planets), // items
            DataBinding.fromGet((c) => c.toStringDescription(world)), // bindingForItemText
            fontHeightInPixels, 
            // dataBindingForItemSelected
            new DataBinding(faction, (c) => c.planetSelected, (c, v) => {
                c.planetSelected = v;
            }), null // bindingForItemValue
            ),
            ControlButton.from8("buttonGoToSelected", Coords.fromXY(margin, size.y - margin - controlHeight), // pos
            Coords.fromXY(5, 1).multiplyScalar(controlHeight), // size
            "Go To", fontHeightInPixels, true, // hasBorder
            DataBinding.fromContextAndGet(faction, (c) => (c.planetSelected != null)), // isEnabled
            () => faction.planetSelected.jumpTo(universe) // click
            ),
        ]);
        return containerPlanets;
    }
    toControl_Details_Ships(universe, size, margin, controlHeight, fontHeightInPixels) {
        var faction = this;
        var containerShips = ControlContainer.from4("Ships", Coords.create(), size, 
        // children
        [
            new ControlLabel("labelShips", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(size.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("Ships:"), fontHeightInPixels),
            new ControlLabel("textShipCount", Coords.fromXY(margin * 8, margin), // pos
            Coords.fromXY(size.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(faction, (c) => "" + c.ships.length), fontHeightInPixels),
            ControlList.from8("listShips", Coords.fromXY(margin, margin * 2 + controlHeight), // pos
            Coords.fromXY(size.x - margin * 2, size.y - margin * 4 - controlHeight * 2), // size
            DataBinding.fromContextAndGet(faction, (c) => faction.ships), // items
            DataBinding.fromGet((c) => c.toStringDescription()), // bindingForItemText
            fontHeightInPixels, 
            // dataBindingForItemSelected
            new DataBinding(faction, (c) => c.shipSelected, (c, v) => {
                c.shipSelected = v;
            }), null // bindingForItemValue
            ),
            ControlButton.from8("buttonGoToSelected", Coords.fromXY(margin, size.y - margin - controlHeight), // pos
            Coords.fromXY(5, 1).multiplyScalar(controlHeight), // size
            "Go To", fontHeightInPixels, true, // hasBorder
            DataBinding.fromContextAndGet(faction, (c) => (c.shipSelected != null)), // isEnabled
            () => faction.shipSelected.jumpTo(universe) // click
            ),
        ]);
        return containerShips;
    }
    toControl_Details_Technology(universe, size) {
        var researchSession = new TechnologyResearchSession(universe.world.technologyTree, this.technologyResearcher);
        var researchSessionAsControl = researchSession.toControl(universe, size);
        return researchSessionAsControl;
    }
    // diplomacy
    allianceProposalAcceptFrom(factionOther) {
        return true;
    }
    allies(world) {
        return this.factionsMatchingRelationshipState(world, DiplomaticRelationship.States().Alliance);
    }
    enemies(world) {
        return this.factionsMatchingRelationshipState(world, DiplomaticRelationship.States().War);
    }
    factionsMatchingRelationshipState(world, stateToMatch) {
        var returnValues = [];
        for (var i = 0; i < this.relationships.length; i++) {
            var relationship = this.relationships[i];
            if (relationship.state == stateToMatch) {
                var factionOther = relationship.factionOther(world);
                returnValues.push(factionOther);
            }
        }
        return returnValues;
    }
    peaceOfferAcceptFrom(factionOther) {
        return true;
    }
    relationsInitialize(universe) {
        var diplomaticSessionAsControl = this.toControl_Details_Diplomacy(universe, universe.display.sizeInPixels);
        var venueNext = diplomaticSessionAsControl.toVenue();
        venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
        universe.venueNext = venueNext;
    }
    relationshipByFactionName(factionName) {
        return this.relationshipsByFactionName.get(factionName);
    }
    selfAndAllies(world) {
        var returnValues = this.factionsMatchingRelationshipState(world, DiplomaticRelationship.States().Alliance);
        returnValues.push(this);
        return returnValues;
    }
    strength(world) {
        var returnValue = 0;
        var ships = this.ships;
        for (var i = 0; i < ships.length; i++) {
            var ship = ships[i];
            returnValue += ship.strength(world);
        }
        var planets = this.planets;
        for (var i = 0; i < planets.length; i++) {
            var planet = planets[i];
            returnValue += planet.strength(world);
        }
        returnValue += this.technologyResearcher.strength(world);
        return returnValue;
    }
    warThreatOfferConcessionsTo(factionOther) {
        return true;
    }
    // notifications
    notificationSessionStart(universe) {
        var notificationSessionAsControl = this.toControl_Details_Notifications(universe, universe.display.sizeInPixels);
        var venueNext = notificationSessionAsControl.toVenue();
        venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
        universe.venueNext = venueNext;
    }
    // turns
    researchPerTurn(universe, world) {
        var returnValue = 0;
        for (var i = 0; i < this.planets.length; i++) {
            var planet = this.planets[i];
            var planetResearchThisTurn = planet.researchPerTurn(universe, world, this);
            returnValue += planetResearchThisTurn;
        }
        return returnValue;
    }
    updateForTurn(universe, world) {
        for (var i = 0; i < this.planets.length; i++) {
            var planet = this.planets[i];
            planet.updateForTurn(universe, world, this);
        }
        for (var i = 0; i < this.ships.length; i++) {
            var ship = this.ships[i];
            ship.updateForTurn(universe, world, this);
        }
        this.technologyResearcher.updateForTurn(universe, world, this);
    }
}
