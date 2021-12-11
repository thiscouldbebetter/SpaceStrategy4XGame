"use strict";
class VenueLayout {
    constructor(venueParent, modelParent, layout) {
        this.venueParent = venueParent;
        this.modelParent = modelParent;
        this.layout = layout;
    }
    buildableDefnsAllowedOnTerrain(buildableDefnsToCheck, terrain) {
        var returnValues = buildableDefnsToCheck.filter(x => x.isAllowedOnTerrain(terrain));
        return returnValues;
    }
    finalize(universe) {
        // Do nothing.
    }
    initialize(universe) {
        var controlRoot = this.toControl(universe);
        this.venueControls = new VenueControls(controlRoot, null);
        this.layout.initialize(universe);
    }
    model() {
        return this.layout;
    }
    updateForTimerTick(universe) {
        var venueLayout = this;
        this.venueControls.updateForTimerTick(universe);
        var inputHelper = universe.inputHelper;
        var planet = this.modelParent;
        var layout = this.layout;
        var map = layout.map;
        var cursor = map.cursor;
        var cursorPos = cursor.pos;
        cursorPos.overwriteWith(inputHelper.mouseMovePos).subtract(map.pos).divide(map.cellSizeInPixels).round();
        if (cursorPos.isInRangeMax(map.sizeInCellsMinusOnes)) {
            if (inputHelper.isMouseClicked(null)) {
                inputHelper.isMouseClicked(false);
                var bodyAtCursor = this.layout.map.bodyAtCursor();
                if (bodyAtCursor == null) {
                    var buildableEntityInProgress = planet.buildableEntityInProgress();
                    var acknowledge = () => universe.venueNext = venueLayout;
                    if (buildableEntityInProgress == null) {
                        var neighboringBodies = map.bodiesNeighboringCursor();
                        if (neighboringBodies.length == 0) {
                            universe.venueNext = VenueMessage.fromTextAndAcknowledge("Cannot build there.", acknowledge);
                        }
                        else {
                            var controlBuildables = this.controlBuildableSelectBuild(universe, cursorPos);
                            universe.venueNext = new VenueControls(controlBuildables, null);
                        }
                    }
                    else {
                        universe.venueNext = VenueMessage.fromTextAndAcknowledge("Already building something.", acknowledge);
                    }
                }
                else {
                    var controlBuildableDetails = this.controlBuildableDetailsBuild(universe);
                    universe.venueNext = new VenueControls(controlBuildableDetails, null);
                }
            }
        }
        this.draw(universe);
    }
    // controls
    controlBuildableDetailsBuild(universe) {
        var layout = this.layout;
        var buildableAtCursorEntity = this.layout.map.bodyAtCursor();
        var buildableAtCursor = Buildable.fromEntity(buildableAtCursorEntity);
        var displaySize = universe.display.sizeInPixels;
        var containerSize = displaySize.clone().half();
        var margin = Coords.fromXY(1, 1).multiplyScalar(8);
        var fontHeightInPixels = 10; // hack
        var listSize = containerSize.clone().subtract(margin).subtract(margin);
        var buttonSize = Coords.fromXY(listSize.x, fontHeightInPixels * 2);
        var venueThis = this; // hack
        var returnValue = ControlContainer.from4("containerBuildableDetails", displaySize.clone().subtract(containerSize).half(), // pos
        containerSize, [
            new ControlLabel("labelBuildableName", Coords.fromXY(1, 1).multiply(margin), listSize, false, // isTextCentered
            DataBinding.fromContext(buildableAtCursor.defnName), // text
            fontHeightInPixels),
            ControlButton.from8("buttonDemolish", Coords.fromXY(margin.x, containerSize.y - margin.y * 2 - buttonSize.y * 2), //pos,
            buttonSize, "Demolish", // text,
            fontHeightInPixels, true, // hasBorder,
            DataBinding.fromTrue(), // isEnabled,
            () => // click
             {
                ArrayHelper.remove(layout.map.bodies, buildableAtCursorEntity);
                universe.venueNext = venueThis;
            }),
            ControlButton.from8("buttonDone", Coords.fromXY(margin.x, containerSize.y - margin.y - buttonSize.y), //pos,
            buttonSize, "Done", // text,
            fontHeightInPixels, true, // hasBorder,
            DataBinding.fromTrue(), // isEnabled,
            () => universe.venueNext = venueThis // click
            ),
        ]);
        return returnValue;
    }
    controlBuildableSelectBuild(universe, cursorPos) {
        var venueLayout = this;
        var world = universe.world;
        var layout = this.layout;
        var map = layout.map;
        var faction = this.modelParent.faction(world);
        // todo - Allow ships to colonize planets with no faction.
        var buildableDefnsAvailable = (faction == null ? [] : faction.technologyResearcher.buildablesAvailable(world));
        var terrain = map.terrainAtCursor();
        var displaySize = universe.display.sizeInPixels.clone().clearZ();
        var containerSize = displaySize.clone().half();
        var margin = Coords.fromXY(1, 1).multiplyScalar(8);
        var fontHeightInPixels = 10; // hack
        var columnWidth = containerSize.x - margin.x * 2;
        var buttonHeight = fontHeightInPixels * 2;
        var buttonSize = Coords.fromXY((columnWidth - margin.x) / 2, buttonHeight);
        var listSize = Coords.fromXY(columnWidth, containerSize.y - buttonHeight * 2 - margin.y * 4);
        var listBuildables = ControlList.from8("listBuildables", Coords.fromXY(margin.x, margin.y * 2 + buttonSize.y), listSize, DataBinding.fromContextAndGet(this, (c) => c.buildableDefnsAllowedOnTerrain(buildableDefnsAvailable, terrain)), DataBinding.fromGet((c) => c.name), //bindingForItemText,
        fontHeightInPixels, new DataBinding(this, (c) => c.buildableDefnSelected, (c, v) => c.buildableDefnSelected = v), // bindingForItemSelected,
        DataBinding.fromGet((c) => c.name) // bindingForItemValue
        );
        var buttonBuild_Clicked = () => {
            var buildableDefnSelected = venueLayout.buildableDefnSelected;
            if (buildableDefnSelected != null) {
                var buildableDefnName = buildableDefnSelected.name;
                var layout = venueLayout.layout;
                var cursorPos = layout.map.cursor.pos;
                var buildable = new Buildable(buildableDefnName, cursorPos.clone(), false);
                var buildableEntity = buildable.toEntity(world);
                this.modelParent.buildableEntityBuild(buildableEntity);
            }
            universe.venueNext = venueLayout;
        };
        var buttonCancel_Clicked = () => {
            universe.venueNext = venueLayout;
        };
        var returnValue = ControlContainer.from4("containerBuild", displaySize.clone().subtract(containerSize).half(), // pos
        containerSize, [
            new ControlLabel("labelFacilityToBuild", margin, listSize, false, // isTextCentered
            DataBinding.fromContext("Facility to Build:"), // text
            fontHeightInPixels),
            listBuildables,
            ControlButton.from8("buttonBuild", Coords.fromXY(margin.x, containerSize.y - margin.y - buttonSize.y), //pos,
            buttonSize, "Build", // text,
            fontHeightInPixels, true, // hasBorder,
            DataBinding.fromTrue(), // isEnabled,
            buttonBuild_Clicked),
            ControlButton.from8("buttonCancel", Coords.fromXY(margin.x * 2 + buttonSize.x, containerSize.y - margin.y - buttonSize.y), //pos,
            buttonSize, "Cancel", // text,
            fontHeightInPixels, true, // hasBorder,
            DataBinding.fromTrue(), // isEnabled,
            buttonCancel_Clicked)
        ]);
        return returnValue;
    }
    toControl(universe) {
        var world = universe.world;
        var controlBuilder = universe.controlBuilder;
        var display = universe.display;
        var containerMainSize = display.sizeInPixels.clone();
        var controlHeight = 14;
        var margin = 8;
        var fontHeightInPixels = display.fontHeightInPixels;
        var containerInnerSize = Coords.fromXY(100, 60);
        var buttonWidth = (containerInnerSize.x - margin * 3) / 2;
        var container = ControlContainer.from4("containerMain", Coords.fromXY(0, 0), // pos
        containerMainSize, 
        // children
        [
            ControlButton.from8("buttonBack", Coords.fromXY((containerMainSize.x - buttonWidth) / 2, containerMainSize.y - margin - controlHeight), // pos
            Coords.fromXY(buttonWidth, controlHeight), // size
            "Back", fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                var venue = universe.venueCurrent;
                var venueNext = venue.venueParent;
                venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                universe.venueNext = venueNext;
            }),
            this.toControl_Vitals(universe, containerMainSize, containerInnerSize, margin, controlHeight),
        ]);
        var planet = this.modelParent;
        if (planet.factionName != null) {
            var factionCurrent = world.factionCurrent();
            if (factionCurrent.name == planet.factionName) {
                var faction = factionCurrent;
                var controlFaction = faction.toControl_ClusterOverlay(universe, containerMainSize, containerInnerSize, margin, controlHeight, buttonWidth);
                container.childAdd(controlFaction);
                var controlIndustry = this.toControl_Industry(universe, containerMainSize, containerInnerSize, margin, controlHeight, buttonWidth);
                container.childAdd(controlIndustry);
                var controlSelection = controlBuilder.selection(universe, Coords.fromXY(containerMainSize.x - margin - containerInnerSize.x, containerMainSize.y - margin - containerInnerSize.y), containerInnerSize, margin, controlHeight);
                container.childAdd(controlSelection);
            }
        }
        var returnValue = new ControlContainerTransparent(container);
        return returnValue;
    }
    toControl_Industry(universe, containerMainSize, containerInnerSize, margin, controlHeight, buttonWidth) {
        var world = universe.world;
        var planet = this.modelParent;
        var fontHeightInPixels = margin;
        var returnValue = ControlContainer.from4("containerViewControls", Coords.fromXY(margin, containerMainSize.y
            - margin
            - containerInnerSize.y), containerInnerSize, 
        // children
        [
            new ControlLabel("labelBuilding", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("Building:"), fontHeightInPixels),
            new ControlLabel("labelBuildable", Coords.fromXY(margin, controlHeight + margin), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size,
            false, // isTextCentered
            DataBinding.fromContextAndGet(planet, (c) => {
                var buildable = c.buildableInProgress();
                var returnValue = (buildable == null
                    ? "[none]"
                    : buildable.defnName);
                return returnValue;
            }), fontHeightInPixels),
            new ControlLabel("labelResourcesRequired", Coords.fromXY(margin, controlHeight * 2 + margin), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(planet, (c) => {
                var buildable = c.buildableInProgress();
                var returnValue = (buildable == null
                    ? "-"
                    : buildable.defn(world).resourcesToBuild.toString());
                return returnValue;
            }), fontHeightInPixels),
        ]);
        return returnValue;
    }
    toControl_Vitals(universe, containerMainSize, containerInnerSize, margin, controlHeight) {
        var planet = this.modelParent;
        var world = universe.world;
        var faction = planet.faction(world);
        var column1PosX = margin * 8;
        controlHeight = 10;
        var fontHeightInPixels = controlHeight;
        var size = containerInnerSize;
        var returnValue = ControlContainer.from4("containerTimeAndPlace", Coords.fromXY(margin, margin), size, 
        // children
        [
            new ControlLabel("textPlace", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(planet, (c) => c.name), fontHeightInPixels),
            new ControlLabel("labelPopulation", Coords.fromXY(margin, margin + controlHeight), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("Population:"), fontHeightInPixels),
            new ControlLabel("textPopulation", Coords.fromXY(column1PosX, margin + controlHeight), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(planet, (c) => "" + c.demographics.population), fontHeightInPixels),
            new ControlLabel("labelIndustry", Coords.fromXY(margin, margin + controlHeight * 2), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("Industry:"), fontHeightInPixels),
            new ControlLabel("textIndustry", Coords.fromXY(column1PosX, margin + controlHeight * 2), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(planet, (c) => "" + c.industryPerTurn(universe, world, faction)), fontHeightInPixels),
            new ControlLabel("labelProsperity", Coords.fromXY(margin, margin + controlHeight * 3), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("Prosperity:"), fontHeightInPixels),
            new ControlLabel("textProsperity", Coords.fromXY(column1PosX, margin + controlHeight * 3), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(planet, (c) => "" + c.prosperityPerTurn(universe, world, faction)), fontHeightInPixels),
            new ControlLabel("labelResearch", Coords.fromXY(margin, margin + controlHeight * 4), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("Research:"), fontHeightInPixels),
            new ControlLabel("textResearch", Coords.fromXY(column1PosX, margin + controlHeight * 4), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(planet, (c) => "" + c.researchPerTurn(universe, world, faction)), fontHeightInPixels),
        ]);
        return returnValue;
    }
    // drawable
    draw(universe) {
        this.layout.draw(universe, universe.display);
        if (this.venueControls != null) {
            this.venueControls.draw(universe);
        }
    }
}
