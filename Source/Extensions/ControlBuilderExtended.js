"use strict";
class ControlBuilderExtended extends ControlBuilder {
    constructor(controlBuilderInner) {
        super(controlBuilderInner.styles, controlBuilderInner.venueTransitionalFromTo);
    }
    selection(universe, pos, size, margin) {
        var fontHeightInPixels = margin;
        var labelHeight = fontHeightInPixels;
        var buttonHeight = fontHeightInPixels * 2;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var labelSelection = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin), // pos
        Coords.fromXY(size.x - margin * 2, labelHeight), // size
        DataBinding.fromContext("Selection:"), // text
        fontNameAndHeight);
        var textSelectionName = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin + labelHeight), // pos
        Coords.fromXY(size.x - margin * 2, labelHeight), // size
        DataBinding.fromContextAndGet(universe, (c) => {
            var returnValue = null;
            var venue = c.venueCurrent();
            var venueTypeName = venue.constructor.name;
            if (venueTypeName == VenueStarCluster.name) {
                returnValue = venue.selectionName();
            }
            else if (venueTypeName == VenueStarsystem.name) {
                returnValue = venue.selectionName();
            }
            return returnValue;
        }), fontNameAndHeight);
        var controlSelectionSize = Coords.fromXY(size.x - margin * 2, size.y - margin * 4 - labelHeight * 2 - buttonHeight);
        var dynamicSelection = new ControlDynamic("dynamicSelection", Coords.fromXY(margin, margin * 2 + labelHeight * 2), // pos
        controlSelectionSize, // size
        DataBinding.fromContextAndGet(universe, (c) => {
            var venue = c.venueCurrent();
            return (venue.entitySelected == null ? null : venue.entitySelected()); // get
        }), (v) => {
            var venueStarsystem = universe.venueCurrent();
            var place = venueStarsystem.starsystem;
            var uwpe = new UniverseWorldPlaceEntities(universe, universe.world, place, v, null);
            var controllable = v.controllable();
            var control = controllable.toControl(uwpe, controlSelectionSize, Starsystem.name);
            return control;
        });
        var buttonSize = Coords.fromXY((size.x - margin * 3) / 2, buttonHeight);
        var buttonCenter = ControlButton.from8("buttonCenter", // name,
        Coords.fromXY(margin, size.y - margin - buttonHeight), // pos
        buttonSize, "Center", // text,
        fontNameAndHeight, true, // hasBorder
        DataBinding.fromContextAndGet(universe.venueCurrent(), (c) => (c.entitySelected != null)), // isEnabled
        () => // click
         {
            universe.venueCurrent().cameraCenterOnSelection();
        });
        var buttonDetailsIsEnabledGet = (c) => // hack
         {
            var returnValue = (c.entitySelectedDetailsAreViewable != null // hack - VenueFader.
                ? c.entitySelectedDetailsAreViewable(universe)
                : false);
            return returnValue;
        };
        var buttonDetailsIsEnabled = DataBinding.fromContextAndGet(universe.venueCurrent(), buttonDetailsIsEnabledGet);
        var buttonDetailsClick = () => {
            var venueCurrent = universe.venueCurrent();
            venueCurrent.entitySelectedDetailsView(universe);
        };
        var buttonDetails = ControlButton.from8("buttonDetails", // name,
        Coords.fromXY(margin * 2 + ((size.x - margin * 3) / 2), size.y - margin - buttonHeight), // pos
        buttonSize, "Details", // text,
        fontNameAndHeight, true, // hasBorder
        buttonDetailsIsEnabled, buttonDetailsClick);
        var returnValue = new ControlContainer("containerSelected", pos.clone(), size.clone(), 
        // children
        [
            labelSelection,
            textSelectionName,
            dynamicSelection,
            buttonCenter,
            buttonDetails
        ], null, null // actions, actionToInputsMappings
        );
        return returnValue;
    }
    starsystemPlanetsLinksAndShips(universe, pos, size, margin, controlHeight, venueStarsystem) {
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
         venueStarsystem.entitySelect(venueStarsystem.entityHighlighted));
        var buttonTarget = ControlButton.from8("buttonTarget", // name,
        Coords.fromXY(margin * 2 + buttonSize.x, size.y - margin - buttonSize.y), // pos
        buttonSize, "Target", // text,
        fontNameAndHeight, true, // hasBorder
        DataBinding.fromContextAndGet(venueStarsystem, (c) => c.entitySelected != null
            && c.entitySelectedEquals(c.entityHighlighted)), // isEnabled
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
    view(universe, containerMainSize, containerInnerSize, margin, cameraSpeed) {
        var fontHeightInPixels = margin;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
        var labelHeight = fontHeightInPixels;
        var buttonWidthAndHeight = (containerInnerSize.x - margin * 2) / 5;
        var size = containerInnerSize.clone();
        var pos = Coords.fromXY(margin, containerMainSize.y
            - margin
            - size.y);
        var labelView = ControlLabel.from4Uncentered(Coords.fromXY(margin, margin), // pos
        Coords.fromXY(containerInnerSize.x, labelHeight), // size
        DataBinding.fromContext("View:"), fontNameAndHeight);
        var buttonSize = Coords.fromXY(1, 1).multiplyScalar(buttonWidthAndHeight);
        var buttonViewRotateUp = ControlButton.from11("buttonViewRotateUp", Coords.fromXY(margin + buttonWidthAndHeight, size.y - margin - buttonWidthAndHeight * 2), // pos
        buttonSize, "^", fontNameAndHeight, true, // hasBorder
        DataBinding.fromTrue(), // isEnabled
        () => // click
         {
            universe.venueCurrent().cameraUp(cameraSpeed);
        }, true // canBeHeldDown
        );
        var buttonViewRotateDown = ControlButton.from11("buttonViewRotateDown", Coords.fromXY(margin + buttonWidthAndHeight, size.y - margin - buttonWidthAndHeight), // pos
        buttonSize, "v", fontNameAndHeight, true, // hasBorder
        DataBinding.fromTrue(), // isEnabled
        () => // click
         {
            universe.venueCurrent().cameraDown(cameraSpeed);
        }, true // canBeHeldDown
        );
        var buttonViewRotateLeft = ControlButton.from11("buttonViewRotateLeft", Coords.fromXY(margin, size.y - margin - buttonWidthAndHeight), // pos
        buttonSize, "<", fontNameAndHeight, true, // hasBorder
        DataBinding.fromTrue(), // isEnabled
        () => // click
         {
            universe.venueCurrent().cameraLeft(cameraSpeed);
        }, true // canBeHeldDown
        );
        var buttonViewRotateRight = ControlButton.from11("buttonViewRotateRight", Coords.fromXY(margin + buttonWidthAndHeight * 2, size.y - margin - buttonWidthAndHeight), // pos
        buttonSize, ">", fontNameAndHeight, true, // hasBorder
        DataBinding.fromTrue(), // isEnabled
        () => // click
         {
            universe.venueCurrent().cameraRight(cameraSpeed);
        }, true // canBeHeldDown
        );
        var buttonViewZoomIn = ControlButton.from11("buttonViewZoomIn", Coords.fromXY(size.x - margin - buttonWidthAndHeight * 2, margin), // pos
        buttonSize, "In", fontNameAndHeight, true, // hasBorder
        DataBinding.fromTrue(), // isEnabled
        () => // click
         {
            universe.venueCurrent().cameraIn(cameraSpeed);
        }, true // canBeHeldDown
        );
        var buttonViewZoomOut = ControlButton.from11("buttonViewZoomOut", Coords.fromXY(size.x - margin - buttonWidthAndHeight, margin), // pos
        buttonSize, // size
        "Out", fontNameAndHeight, true, // hasBorder
        DataBinding.fromTrue(), // isEnabled
        () => // click
         {
            universe.venueCurrent().cameraOut(cameraSpeed);
        }, true // canBeHeldDown
        );
        var buttonViewReset = ControlButton.from5(Coords.fromXY(size.x - margin - buttonWidthAndHeight, size.y - margin - buttonWidthAndHeight), // pos
        buttonSize, "x", fontNameAndHeight, () => // click
         {
            universe.venueCurrent().cameraReset();
        });
        var returnValue = ControlContainer.from4("containerViewControls", pos, size, 
        // children
        [
            labelView,
            buttonViewRotateUp,
            buttonViewRotateDown,
            buttonViewRotateLeft,
            buttonViewRotateRight,
            buttonViewZoomIn,
            buttonViewZoomOut,
            buttonViewReset
        ]);
        return returnValue;
    }
}
