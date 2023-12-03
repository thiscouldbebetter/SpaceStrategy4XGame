"use strict";
class VenueLayout {
    constructor(venueParent, modelParent, layout) {
        this.venueParent = venueParent;
        this.modelParent = modelParent;
        this.layout = layout;
        this.hasBeenUpdatedSinceDrawn = true;
    }
    buildableDefnsAllowedAtPosInCells(buildableDefnsToCheck, posInCells) {
        var returnValues = buildableDefnsToCheck.filter(x => x.canBeBuiltOnMapAtPosInCells(this.layout.map, posInCells));
        return returnValues;
    }
    finalize(universe) {
        // Do nothing.
    }
    initialize(universe) {
        var controlRoot = this.toControl(universe);
        this.venueControls = new VenueControls(controlRoot, null);
        this.layout.initialize(universe);
        this.hasBeenUpdatedSinceDrawn = true;
    }
    model() {
        return this.layout;
    }
    updateForTimerTick(universe) {
        this.venueControls.updateForTimerTick(universe);
        var inputHelper = universe.inputHelper;
        if (inputHelper.inputsActive().length > 0) {
            this.hasBeenUpdatedSinceDrawn = true;
        }
        var planet = this.modelParent;
        var layout = this.layout;
        var map = layout.map;
        var cursor = map.cursor;
        var cursorPosInCells = cursor.pos;
        cursorPosInCells.overwriteWith(inputHelper.mouseMovePos).subtract(map.pos).divide(map.cellSizeInPixels).round().clearZ();
        if (cursorPosInCells.isInRangeMax(map.sizeInCellsMinusOnes)) {
            if (inputHelper.isMouseClicked()) {
                inputHelper.mouseClickedSet(false);
                this.updateForTimerTick_1(universe, planet, cursorPosInCells);
            }
        }
        this.draw(universe);
    }
    updateForTimerTick_1(universe, planet, cursorPosInCells) {
        var layout = this.layout;
        var bodyAtCursor = layout.map.bodyAtCursor();
        if (bodyAtCursor != null) {
            var controlBuildableDetails = this.controlBuildableDetailsBuild(universe);
            universe.venueJumpTo(new VenueControls(controlBuildableDetails, null));
        }
        else {
            var buildableEntityInProgress = planet.buildableEntityInProgress(universe);
            var venueLayout = this;
            var acknowledge = () => universe.venueJumpTo(venueLayout);
            var dialogSize = universe.display.sizeInPixels.clone().half();
            if (buildableEntityInProgress != null) {
                universe.venueJumpTo(VenueMessage.fromTextAcknowledgeAndSize("Already building something.", acknowledge, dialogSize));
            }
            else if (planet.populationIdle(universe) <= 0) {
                universe.venueJumpTo(VenueMessage.fromTextAcknowledgeAndSize("No free population yet.", acknowledge, dialogSize));
            }
            else {
                var canBuildAtCursor = false;
                var terrainAtCursor = layout.map.terrainAtCursor();
                var isSurface = terrainAtCursor.isSurface();
                if (isSurface) {
                    var map = layout.map;
                    var neighboringBodies = map.bodiesNeighboringCursor();
                    if (neighboringBodies.length == 0) {
                        universe.venueJumpTo(VenueMessage.fromTextAcknowledgeAndSize("Must build near other facilities.", acknowledge, dialogSize));
                    }
                    else {
                        canBuildAtCursor = true;
                    }
                }
                else {
                    canBuildAtCursor = true;
                }
                if (canBuildAtCursor) {
                    var controlBuildables = this.controlBuildableSelectBuild(universe, cursorPosInCells);
                    universe.venueJumpTo(new VenueControls(controlBuildables, null));
                }
            }
        }
    }
    // controls
    controlBuildableDetailsBuild(universe) {
        var layout = this.layout;
        var map = layout.map;
        var buildableAtCursorEntity = map.bodyAtCursor();
        var buildableAtCursor = Buildable.ofEntity(buildableAtCursorEntity);
        var buildableAtCursorDefn = buildableAtCursor.defn;
        var terrainAtCursor = map.terrainAtCursor();
        var displaySize = universe.display.sizeInPixels;
        var containerSize = displaySize.clone().half();
        var margin = Coords.fromXY(1, 1).multiplyScalar(8);
        var fontHeightInPixels = 10; // hack
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var listSize = containerSize.clone().subtract(margin).subtract(margin);
        var buttonSize = Coords.fromXY(listSize.x, fontHeightInPixels * 2);
        var venueThis = this; // hack
        var childControls = new Array();
        var labelBuildableName = ControlLabel.from4Uncentered(Coords.fromXY(1, 1).multiply(margin), listSize, DataBinding.fromContext(buildableAtCursorDefn.name
            + " on " + terrainAtCursor.name + " cell"), fontNameAndHeight);
        childControls.push(labelBuildableName);
        var buildableIsComplete = buildableAtCursor.isComplete;
        if (buildableIsComplete) {
            var effectsAvailableToUse = buildableAtCursorDefn.effectsAvailableToUse;
            for (var e = 0; e < effectsAvailableToUse.length; e++) {
                const effect = effectsAvailableToUse[e]; // Must be const, or otherwise all buttons perform the final effect.
                var eReversed = effectsAvailableToUse.length - e - 1;
                var buttonForEffect = ControlButton.from5(Coords.fromXY(margin.x, containerSize.y - (margin.y + buttonSize.y) * (3 + eReversed)), //pos,
                buttonSize, effect.name, // text,
                fontNameAndHeight, () => {
                    var planet = venueThis.modelParent;
                    var planetAsPlace = planet.toPlace();
                    var uwpe = new UniverseWorldPlaceEntities(universe, universe.world, planetAsPlace, buildableAtCursorEntity, null);
                    effect.apply(uwpe);
                });
                childControls.push(buttonForEffect);
            }
        }
        var textDemolishOrAbandon = (buildableIsComplete ? "Demolish" : "Abandon");
        var buttonDemolishOrAbandon = ControlButton.from5(Coords.fromXY(margin.x, containerSize.y - (margin.y + buttonSize.y) * 2), //pos,
        buttonSize, textDemolishOrAbandon, fontNameAndHeight, () => // click
         {
            var world = universe.world;
            var entityToDemolish = buildableAtCursorEntity;
            var entityToDemolishFactionable = Factionable.ofEntity(entityToDemolish);
            var entityToDemolishFaction = entityToDemolishFactionable == null
                ? null
                : entityToDemolishFactionable.faction(world);
            var factionCurrent = world.factionCurrent();
            var entityToDemolishBelongsToAnotherFaction = entityToDemolishFaction != null
                && entityToDemolishFaction != factionCurrent;
            var controlBuilder = universe.controlBuilder;
            var controlDialog;
            if (entityToDemolishBelongsToAnotherFaction) {
                controlDialog = controlBuilder.message4(universe, containerSize, DataBinding.fromContext("Can't demolish things you don't own!"), () => { });
            }
            else {
                controlDialog = controlBuilder.confirmForUniverseSizeMessageConfirmCancel(universe, containerSize, "Really " + textDemolishOrAbandon.toLowerCase() + "?", () => // confirm
                 {
                    var mapBodies = layout.map.bodies();
                    ArrayHelper.remove(mapBodies, entityToDemolish);
                    universe.venueNextSet(venueThis);
                }, null // cancel
                );
            }
            var controlDialogAsVenue = controlDialog.toVenue();
            universe.venueNextSet(controlDialogAsVenue); // hack - Must be .venueNextSet, otherwise it messes up the expected venue stack.
        });
        childControls.push(buttonDemolishOrAbandon);
        var buttonDone = ControlButton.from5(Coords.fromXY(margin.x, containerSize.y - margin.y - buttonSize.y), //pos,
        buttonSize, "Done", // text,
        fontNameAndHeight, () => universe.venueJumpTo(venueThis) // click
        );
        childControls.push(buttonDone);
        var returnValue = ControlContainer.from4("containerBuildableDetails", displaySize.clone().subtract(containerSize).half(), // pos
        containerSize, childControls);
        return returnValue;
    }
    controlBuildableSelectBuild(universe, cursorPos) {
        var venueLayout = this;
        var world = universe.world;
        var layout = this.layout;
        var map = layout.map;
        var cursor = map.cursor;
        var cursorPosInCells = cursor.pos;
        var faction = this.modelParent.faction(world);
        // todo - Allow ships to colonize planets with no faction.
        var buildableDefnsAvailable = (faction == null ? [] : faction.technologyResearcher.buildablesAvailable(world));
        var displaySize = universe.display.sizeInPixels.clone().clearZ();
        var containerSize = displaySize.clone().half();
        var margin = Coords.fromXY(1, 1).multiplyScalar(8);
        var fontHeightInPixels = 10; // hack
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var columnWidth = containerSize.x - margin.x * 2;
        var buttonHeight = fontHeightInPixels * 2;
        var buttonSize = Coords.fromXY((columnWidth - margin.x) / 2, buttonHeight);
        var listSize = Coords.fromXY(columnWidth, containerSize.y - buttonHeight * 2 - margin.y * 4);
        var listBuildables = ControlList.from8("listBuildables", Coords.fromXY(margin.x, margin.y * 2 + buttonSize.y), listSize, DataBinding.fromContextAndGet(this, (c) => c.buildableDefnsAllowedAtPosInCells(buildableDefnsAvailable, cursorPosInCells)), DataBinding.fromGet((c) => c.name), //bindingForItemText,
        fontNameAndHeight, new DataBinding(this, (c) => c.buildableDefnSelected, (c, v) => c.buildableDefnSelected = v), // bindingForItemSelected,
        DataBinding.fromGet((c) => c.name) // bindingForItemValue
        );
        var buttonBuild_Clicked = () => {
            var buildableDefnSelected = venueLayout.buildableDefnSelected;
            if (buildableDefnSelected != null) {
                var layout = venueLayout.layout;
                var cursorPos = layout.map.cursor.pos;
                var buildable = new Buildable(buildableDefnSelected, cursorPos.clone(), false, false);
                var buildableEntity = buildable.toEntity(world);
                this.modelParent.buildableEntityBuild(universe, buildableEntity);
            }
            universe.venueJumpTo(venueLayout);
        };
        var buttonCancel_Clicked = () => {
            universe.venueJumpTo(venueLayout);
        };
        var labelFacilityToBuild = ControlLabel.from4Uncentered(margin, listSize, DataBinding.fromContext("Facility to Build on this Cell:"), // text
        fontNameAndHeight);
        var buttonBuild = ControlButton.from8("buttonBuild", Coords.fromXY(margin.x, containerSize.y - margin.y - buttonSize.y), //pos,
        buttonSize, "Build", // text,
        fontNameAndHeight, true, // hasBorder,
        DataBinding.fromContextAndGet(this, (c) => (c.buildableDefnSelected != null)), // isEnabled,
        buttonBuild_Clicked);
        var buttonCancel = ControlButton.from8("buttonCancel", Coords.fromXY(margin.x * 2 + buttonSize.x, containerSize.y - margin.y - buttonSize.y), //pos,
        buttonSize, "Cancel", // text,
        fontNameAndHeight, true, // hasBorder,
        DataBinding.fromTrue(), // isEnabled,
        buttonCancel_Clicked);
        var returnValue = ControlContainer.from4("containerBuild", displaySize.clone().subtract(containerSize).half(), // pos
        containerSize, [
            labelFacilityToBuild,
            listBuildables,
            buttonBuild,
            buttonCancel
        ]);
        return returnValue;
    }
    toControl(universe) {
        var world = universe.world;
        var display = universe.display;
        var containerMainSize = display.sizeInPixels.clone();
        var margin = containerMainSize.x / 60;
        var fontHeightInPixels = margin;
        var controlHeight = margin * 2;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var containerInnerSize = containerMainSize.clone().multiply(Coords.fromXY(.3, .12));
        var buttonWidth = (containerInnerSize.x - margin * 3) / 2;
        var buttonBack = ControlButton.from8("buttonBack", Coords.fromXY((containerMainSize.x - buttonWidth) / 2, containerMainSize.y - margin - controlHeight), // pos
        Coords.fromXY(buttonWidth, controlHeight), // size
        "Back", fontNameAndHeight, true, // hasBorder
        DataBinding.fromTrue(), // isEnabled
        () => // click
         {
            var venue = universe.venueCurrent();
            var venueNext = venue.venueParent;
            universe.venueTransitionTo(venueNext);
        });
        var controlNameTypeOwner = this.toControl_NameTypeOwner(universe, containerMainSize, containerInnerSize, margin, controlHeight);
        var controlPopulationAndProduction = this.toControl_PopulationAndProduction(universe, containerMainSize, containerInnerSize, margin, controlHeight);
        var container = ControlContainer.from4("containerMain", Coords.fromXY(0, 0), // pos
        containerMainSize, 
        // children
        [
            buttonBack,
            controlNameTypeOwner,
            controlPopulationAndProduction
        ]);
        var planet = this.modelParent;
        var planetFactionName = planet.factionable().factionName;
        if (planetFactionName != null) {
            var factionCurrent = world.factionCurrent();
            if (factionCurrent.name == planetFactionName) {
                var faction = factionCurrent;
                var controlFaction = faction.toControl_ClusterOverlay(universe, containerMainSize, containerInnerSize, margin, controlHeight, buttonWidth, false // includeDetailsButton
                );
                container.childAdd(controlFaction);
            }
        }
        var returnValue = new ControlContainerTransparent(container);
        return returnValue;
    }
    toControl_NameTypeOwner(universe, containerMainSize, containerInnerSize, margin, controlHeight) {
        var planet = this.modelParent;
        var column1PosX = margin * 6;
        controlHeight = margin * 1;
        var fontHeightInPixels = margin;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var size = containerInnerSize;
        var labelName = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContext("Name:"), fontNameAndHeight);
        var textPlace = ControlLabel.from4Uncentered(Coords.fromXY(column1PosX, margin), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContextAndGet(planet, (c) => c.name), fontNameAndHeight);
        var labelType = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin + controlHeight * 1), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContext("Type:"), fontNameAndHeight);
        var textPlanetType = ControlLabel.from4Uncentered(Coords.fromXY(column1PosX, margin + controlHeight * 1), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContextAndGet(planet, (c) => c.planetType.name()), fontNameAndHeight);
        var labelOwnedBy = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin + controlHeight * 2), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContext("Owned by:"), fontNameAndHeight);
        var textFaction = ControlLabel.from4Uncentered(Coords.fromXY(column1PosX, margin + controlHeight * 2), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContextAndGet(planet, (c) => c.factionable().factionName), fontNameAndHeight);
        var returnValue = ControlContainer.from4("containerTimeAndPlace", Coords.fromXY(margin, margin), size, 
        // children
        [
            labelName,
            textPlace,
            labelType,
            textPlanetType,
            labelOwnedBy,
            textFaction
        ]);
        return returnValue;
    }
    toControl_PopulationAndProduction(universe, containerMainSize, containerInnerSize, margin, controlHeight) {
        var planet = this.modelParent;
        var world = universe.world;
        var faction = planet.faction(world);
        var column1PosX = margin * 6;
        controlHeight = margin * 1;
        var fontHeightInPixels = margin;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var size = containerInnerSize;
        var labelPopulation = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin + controlHeight * 0), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContext("Population:"), fontNameAndHeight);
        var textPopulation = ControlLabel.from4Uncentered(Coords.fromXY(column1PosX, margin + controlHeight * 0), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContextAndGet(planet, (c) => "" + c.populationOverMaxPlusIdle(universe)), fontNameAndHeight);
        var labelIndustry = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin + controlHeight * 1), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContext("Industry:"), fontNameAndHeight);
        var textIndustry = ControlLabel.from4Uncentered(Coords.fromXY(column1PosX, margin + controlHeight * 1), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContextAndGet(planet, (c) => "" + c.industryAndBuildableInProgress(universe, world)), fontNameAndHeight);
        var labelProsperity = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin + controlHeight * 2), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContext("Prosperity:"), fontNameAndHeight);
        var textProsperity = ControlLabel.from4Uncentered(Coords.fromXY(column1PosX, margin + controlHeight * 2), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContextAndGet(planet, (c) => c.prosperityNetWithNeededToGrow(universe)), fontNameAndHeight);
        var labelResearch = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin + controlHeight * 3), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContext("Research:"), fontNameAndHeight);
        var textResearch = ControlLabel.from4Uncentered(Coords.fromXY(column1PosX, margin + controlHeight * 3), // pos
        Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
        DataBinding.fromContextAndGet(planet, (c) => "" + c.researchPerTurn(universe, world, faction)), fontNameAndHeight);
        var returnValue = ControlContainer.from4("containerPopulationAndProduction", Coords.fromXY(margin, containerMainSize.y - margin - containerInnerSize.y), size, 
        // children
        [
            labelPopulation,
            textPopulation,
            labelIndustry,
            textIndustry,
            labelProsperity,
            textProsperity,
            labelResearch,
            textResearch
        ]);
        return returnValue;
    }
    // drawable
    draw(universe) {
        var world = universe.world;
        var shouldDraw = world.shouldDrawOnlyWhenUpdated == false
            || this.hasBeenUpdatedSinceDrawn;
        if (shouldDraw) {
            this.hasBeenUpdatedSinceDrawn = false;
            this.layout.draw(universe, universe.display);
            if (this.venueControls != null) {
                this.venueControls.draw(universe);
            }
        }
    }
}
