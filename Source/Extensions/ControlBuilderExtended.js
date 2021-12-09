"use strict";
class ControlBuilderExtended extends ControlBuilder {
    constructor() {
        super(null, null);
    }
    selection(universe, pos, size, margin, controlHeight) {
        var fontHeightInPixels = 10; // universe.display.fontHeightInPixels;
        var returnValue = new ControlContainer("containerSelected", pos.clone(), size.clone(), 
        // children
        [
            ControlLabel.from5("labelSelected", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(size.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("Selection:") // text
            ),
            ControlLabel.from5("textSelectionName", Coords.fromXY(margin, margin + controlHeight * .6), // pos
            Coords.fromXY(size.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(universe, (c) => {
                var returnValue = null;
                var venue = c.venueCurrent;
                var venueTypeName = venue.constructor.name;
                if (venueTypeName == VenueWorldExtended.name) {
                    returnValue = venue.selectionName();
                }
                else if (venueTypeName == VenueStarsystem.name) {
                    returnValue = venue.selectionName();
                }
                return returnValue;
            })),
            new ControlDynamic("dynamicSelection", Coords.fromXY(margin, margin * 2 + controlHeight * 2), // pos
            Coords.fromXY(size.x - margin * 2, size.y - margin * 4 - controlHeight * 3), // size
            new DataBinding(universe, (c) => c.venueCurrent.selection, // get
            null // set
            )),
            ControlButton.from8("buttonCenter", // name,
            Coords.fromXY(margin, size.y - margin - controlHeight), // pos
            Coords.fromXY((size.x - margin * 3) / 2, controlHeight), // size,
            "Center", // text,
            fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                universe.venueCurrent.cameraCenterOnSelection();
            }),
            ControlButton.from8("buttonDetails", // name,
            Coords.fromXY(margin * 2 + ((size.x - margin * 3) / 2), size.y - margin - controlHeight), // pos
            Coords.fromXY((size.x - margin * 3) / 2, controlHeight), // size,
            "Details", // text,
            fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                var venueCurrent = universe.venueCurrent;
                var selection = venueCurrent.selection;
                if (selection != null) {
                    var venueNext;
                    var selectionTypeName = selection.constructor.name;
                    if (selectionTypeName == NetworkNode2.name) {
                        var selectionAsNetworkNode = selection;
                        var starsystem = selectionAsNetworkNode.starsystem;
                        if (starsystem != null) {
                            venueNext = new VenueStarsystem(venueCurrent, starsystem);
                        }
                    }
                    else if (selectionTypeName == Planet.name) {
                        var selectionAsPlanet = selection;
                        venueNext = new VenueLayout(venueCurrent, selectionAsPlanet, selectionAsPlanet.layout);
                    }
                    else if (selectionTypeName == Ship.name) {
                        throw new Error("Not yet implemented!");
                    }
                    if (venueNext != null) {
                        venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
                        universe.venueNext = venueNext;
                    }
                }
            })
        ], null, null // actions, actionToInputsMappings
        );
        return returnValue;
    }
    timeAndPlace(universe, containerMainSize, containerInnerSize, margin, controlHeight) {
        var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);
        var fontHeightInPixels = 10; //universe.display.fontHeightInPixels;
        var returnValue = ControlContainer.from4("containerTimeAndPlace", Coords.fromXY(margin, margin), containerInnerSize, 
        // children
        [
            ControlLabel.from5("textPlace", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(universe, (c) => {
                // hack
                var venue = c.venueCurrent;
                return (venue.model == null ? "" : venue.model().name);
            })),
            ControlLabel.from5("labelTurn", Coords.fromXY(margin, margin + controlHeight), // pos
            Coords.fromXY(containerInnerSize.x - margin * 2, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("Turn:")),
            ControlLabel.from5("textTurn", Coords.fromXY(margin + 25, margin + controlHeight), // pos
            Coords.fromXY(containerInnerSize.x - margin * 3, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContextAndGet(universe, (c) => "" + c.world.turnsSoFar)),
            ControlButton.from8("buttonTurnNext", // name,
            Coords.fromXY(margin + 50, margin + controlHeight), // pos
            Coords.fromXY(controlHeight, controlHeight), // size,
            ">", // text,
            fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                universe.world.updateForTurn(uwpe);
            }),
            ControlButton.from8("buttonTurnFastForward", // name,
            Coords.fromXY(margin + 50 + controlHeight, margin + controlHeight), // pos
            Coords.fromXY(controlHeight, controlHeight), // size,
            ">>", // text,
            fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                var world = universe.world;
                var faction = world.factions[0];
                var notificationSession = faction.notificationSession;
                var notifications = notificationSession.notifications;
                if (notifications.length > 0) {
                    world.updateForTurn(uwpe);
                }
                else {
                    while (notifications.length == 0) {
                        world.updateForTurn(uwpe);
                    }
                }
            })
        ]);
        return returnValue;
    }
    view(universe, containerMainSize, containerInnerSize, margin, controlHeight) {
        var cameraSpeed = 10;
        var fontHeightInPixels = 10; // universe.display.fontHeightInPixels;
        var returnValue = ControlContainer.from4("containerViewControls", Coords.fromXY(margin, containerMainSize.y
            - margin
            - containerInnerSize.y), containerInnerSize, 
        // children
        [
            ControlLabel.from5("labelControls", Coords.fromXY(margin, 0), // pos
            Coords.fromXY(containerInnerSize.x, controlHeight), // size
            false, // isTextCentered
            DataBinding.fromContext("View")),
            new ControlButton("buttonViewUp", Coords.fromXY(margin + controlHeight, margin * 2), // pos
            Coords.fromXY(controlHeight, controlHeight), // size
            "^", fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                universe.venueCurrent.cameraUp(cameraSpeed);
            }, true // canBeHeldDown
            ),
            new ControlButton("buttonViewDown", Coords.fromXY(margin + controlHeight, margin * 2 + controlHeight), // pos
            Coords.fromXY(controlHeight, controlHeight), // size
            "v", fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                universe.venueCurrent.cameraDown(cameraSpeed);
            }, true // canBeHeldDown
            ),
            new ControlButton("buttonViewLeft", Coords.fromXY(margin, margin * 2 + controlHeight), // pos
            Coords.fromXY(controlHeight, controlHeight), // size
            "<", fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                universe.venueCurrent.cameraLeft(cameraSpeed);
            }, true // canBeHeldDown
            ),
            new ControlButton("buttonViewRight", Coords.fromXY(margin + controlHeight * 2, margin * 2 + controlHeight), // pos
            Coords.fromXY(controlHeight, controlHeight), // size
            ">", fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                universe.venueCurrent.cameraRight(cameraSpeed);
            }, true // canBeHeldDown
            ),
            new ControlButton("buttonViewZoomIn", Coords.fromXY(margin * 2 + controlHeight * 2, margin), // pos
            Coords.fromXY(controlHeight, controlHeight), // size
            "In", fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                universe.venueCurrent.cameraIn(cameraSpeed);
            }, true // canBeHeldDown
            ),
            new ControlButton("buttonViewZoomOut", Coords.fromXY(margin * 2 + controlHeight * 3, margin), // pos
            Coords.fromXY(controlHeight, controlHeight), // size
            "Out", fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                universe.venueCurrent.cameraOut(cameraSpeed);
            }, true // canBeHeldDown
            ),
            new ControlButton("buttonViewReset", Coords.fromXY(margin * 2.5 + controlHeight * 3, margin * 2 + controlHeight), // pos
            Coords.fromXY(controlHeight, controlHeight), // size
            "x", fontHeightInPixels, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            () => // click
             {
                universe.venueCurrent.cameraReset();
            }, false // canBeHeldDown
            ),
        ]);
        return returnValue;
    }
}
