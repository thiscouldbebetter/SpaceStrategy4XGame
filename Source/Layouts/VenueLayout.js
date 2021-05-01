"use strict";
class VenueLayout {
    constructor(venueParent, modelParent, layout) {
        this.venueParent = venueParent;
        this.modelParent = modelParent;
        this.layout = layout;
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
                    var buildableInProgress = planet.buildableInProgress();
                    if (buildableInProgress == null) {
                        var neighboringBodies = map.bodiesNeighboringCursor();
                        if (neighboringBodies.length == 0) {
                            universe.venueNext = VenueMessage.fromText("Cannot build there.");
                        }
                        else {
                            var controlBuildables = this.controlBuildableSelectBuild(universe, cursorPos);
                            universe.venueNext = new VenueControls(controlBuildables, null);
                        }
                    }
                    else {
                        universe.venueNext = VenueMessage.fromText("Already building.");
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
            ControlLabel.from5("labelBuildableName", Coords.fromXY(1, 1).multiply(margin), listSize, false, // isTextCentered
            buildableAtCursor.defnName // text
            ),
            ControlButton.from9("buttonDemolish", Coords.fromXY(margin.x, containerSize.y - margin.y * 2 - buttonSize.y * 2), //pos,
            buttonSize, "Demolish", // text,
            fontHeightInPixels, true, // hasBorder,
            true, // isEnabled,
            (universe) => // click
             {
                ArrayHelper.remove(layout.map.bodies, buildableAtCursor);
                universe.venueNext = venueThis;
            }, universe // context
            ),
            ControlButton.from9("buttonDone", Coords.fromXY(margin.x, containerSize.y - margin.y - buttonSize.y), //pos,
            buttonSize, "Done", // text,
            fontHeightInPixels, true, // hasBorder,
            true, // isEnabled,
            (universe) => // click
             {
                universe.venueNext = venueThis;
            }, universe // context
            ),
        ]);
        return returnValue;
    }
    controlBuildableSelectBuild(universe, cursorPos) {
        var world = universe.world;
        var layout = this.layout;
        var map = layout.map;
        var faction = this.modelParent.faction(world);
        var buildableDefnsAvailable = faction.technology.buildablesAvailable(world);
        var terrainName = map.terrainAtCursor().name;
        var buildableDefnsAllowedOnTerrain = [];
        for (var i = 0; i < buildableDefnsAvailable.length; i++) {
            var buildableDefn = buildableDefnsAvailable[i];
            var isBuildableDefnAllowedOnTerrain = ArrayHelper.contains(buildableDefn.terrainNamesAllowed, terrainName);
            if (isBuildableDefnAllowedOnTerrain) {
                buildableDefnsAllowedOnTerrain.push(buildableDefn);
            }
        }
        var displaySize = universe.display.sizeInPixels.clone().clearZ();
        var containerSize = displaySize.clone().half();
        var margin = Coords.fromXY(1, 1).multiplyScalar(8);
        var fontHeightInPixels = 10; // hack
        var columnWidth = containerSize.x - margin.x * 2;
        var buttonHeight = fontHeightInPixels * 2;
        var buttonSize = Coords.fromXY(columnWidth, buttonHeight);
        var listSize = Coords.fromXY(columnWidth, containerSize.y - buttonHeight * 2 - margin.y * 4);
        var venueThis = this; // hack
        var returnValue = ControlContainer.from4("containerBuild", displaySize.clone().subtract(containerSize).half(), // pos
        containerSize, [
            ControlLabel.from5("labelFacilityToBuild", margin, listSize, false, // isTextCentered
            DataBinding.fromContext("Facility to Build:") // text
            ),
            ControlList.from8("listBuildables", Coords.fromXY(margin.x, margin.y * 2 + buttonSize.y), listSize, DataBinding.fromContext(buildableDefnsAllowedOnTerrain), DataBinding.fromGet((c) => c.name), //bindingForItemText,
            fontHeightInPixels, DataBinding.fromContext(null), // bindingForItemSelected,
            DataBinding.fromContext(null)),
            ControlButton.from9("buttonBuild", Coords.fromXY(margin.x, containerSize.y - margin.y - buttonSize.y), //pos,
            buttonSize, "Build", // text,
            fontHeightInPixels, true, // hasBorder,
            true, // isEnabled,
            (universe) => // click
             {
                var venueCurrent = universe.venueCurrent;
                var container = venueCurrent.controlRoot;
                var controlList = container.childByName("listBuildables");
                var itemSelected = controlList.itemSelected(null);
                if (itemSelected != null) {
                    var buildableDefnName = itemSelected.name;
                    var layout = venueThis.layout;
                    var cursorPos = layout.map.cursor.pos;
                    var buildable = new Buildable(buildableDefnName, cursorPos.clone(), null);
                    var buildableEntity = new Entity(buildableDefnName, [buildable]);
                    layout.map.bodies.push(buildableEntity);
                }
                universe.venueNext = venueThis;
            }, universe // context
            )
        ]);
        return returnValue;
    }
    toControl(universe) {
        var world = universe.world;
        var controlBuilder = universe.controlBuilder;
        var display = universe.display;
        var containerMainSize = display.sizeInPixels.clone();
        var controlHeight = 16;
        var margin = 10;
        var fontHeightInPixels = display.fontHeightInPixels;
        var containerInnerSize = Coords.fromXY(100, 60);
        var buttonWidth = (containerInnerSize.x - margin * 3) / 2;
        var container = ControlContainer.from4("containerMain", Coords.fromXY(0, 0), // pos
        containerMainSize, 
        // children
        [
            ControlButton.from9("buttonBack", Coords.fromXY((containerMainSize.x - buttonWidth) / 2, containerMainSize.y - margin - controlHeight), // pos
            Coords.fromXY(buttonWidth, controlHeight), // size
            "Back", fontHeightInPixels, true, // hasBorder
            true, // isEnabled
            (universe) => // click
             {
                var venue = universe.venueCurrent;
                var venueNext = venue.venueParent;
                venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                universe.venueNext = venueNext;
            }, universe // context
            ),
            this.toControl_Vitals(universe, containerMainSize, containerInnerSize, margin, controlHeight),
        ]);
        var planet = this.modelParent;
        if (planet.factionName != null) {
            var factionCurrent = world.factionCurrent();
            if (factionCurrent.name == planet.factionName) {
                var faction = factionCurrent;
                var controlFaction = faction.toControl(universe, containerMainSize, containerInnerSize, margin, controlHeight, buttonWidth);
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
        var returnValue = ControlContainer.from4("containerViewControls", Coords.fromXY(margin, containerMainSize.y
            - margin
            - containerInnerSize.y), containerInnerSize, 
        // children
        [
            ControlLabel.from5("labelBuilding", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("Building:")),
            ControlLabel.from5("labelBuildable", Coords.fromXY(margin, controlHeight + margin), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size,
            false, // isTextCentered
            DataBinding.fromContextAndGet(planet, (c) => {
                var buildable = c.buildableInProgress();
                return (buildable == null ? "[none]" : buildable.defnName);
            })),
            ControlLabel.from5("labelResourcesRequired", Coords.fromXY(margin, controlHeight * 2 + margin), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(planet, (c) => {
                var buildable = c.buildableInProgress();
                return (buildable == null ? "-" : buildable.defn(world).resourcesToBuild.toString());
            })),
        ]);
        return returnValue;
    }
    toControl_Vitals(universe, containerMainSize, containerInnerSize, margin, controlHeight) {
        var planet = this.modelParent;
        var world = universe.world;
        var faction = planet.faction(world);
        var returnValue = ControlContainer.from4("containerTimeAndPlace", Coords.fromXY(margin, margin), containerInnerSize, 
        // children
        [
            ControlLabel.from5("textPlace", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(planet, (c) => c.name)),
            ControlLabel.from5("textIndustry", Coords.fromXY(margin, margin + controlHeight), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(planet, (c) => c.industryPerTurn(universe, world, faction))),
            ControlLabel.from5("textProsperity", Coords.fromXY(margin, margin + controlHeight * 2), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(planet, (c) => c.prosperityPerTurn(universe, world, faction))),
            ControlLabel.from5("labelResearch", Coords.fromXY(margin, margin + controlHeight * 3), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(planet, (c) => c.researchPerTurn(universe, world, faction))),
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
