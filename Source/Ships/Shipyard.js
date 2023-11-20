"use strict";
class Shipyard {
    static fromEntity(entity) {
        return entity.propertyByName(Shipyard.name);
    }
    shipAssembleFromComponentsAndLaunch(universe, world, faction, planet, shipyardEntity, componentNames) {
        var returnValue = null;
        var cellPosToLaunchAt = planet.cellPositionsAvailableToOccupyInOrbit(universe)[0];
        if (cellPosToLaunchAt == null) {
            throw new Error("No room to launch ship!");
        }
        var planetItemHolder = planet.itemHolder();
        var componentItems = componentNames.map(x => planetItemHolder.itemsByDefnName(x)[0]);
        var hasAllItems = planetItemHolder.hasItems(componentItems);
        if (hasAllItems == false) {
            throw new Error("Specified items not in stock!");
        }
        planetItemHolder.itemsRemove(componentItems);
        var uwpe = new UniverseWorldPlaceEntities(universe, world, null, shipyardEntity, null);
        var componentItemsAsEntities = componentItems.map(x => x.toEntity(uwpe));
        planet.buildableEntitiesRemove(universe, componentItemsAsEntities);
        var itemDefns = componentNames.map(itemDefnName => world.defn.itemDefnByName(itemDefnName));
        var items = itemDefns.map(itemDefn => itemDefn.toItem());
        faction.shipsBuiltSoFarCount++;
        var shipNumber = faction.shipsBuiltSoFarCount;
        var shipName = faction.name
            + " " + Ship.name
            + " " + shipNumber;
        var shipBodyDefn = Ship.bodyDefnBuild(faction.color);
        returnValue = new Ship(shipName, shipBodyDefn, cellPosToLaunchAt, faction.name, items);
        returnValue.updateForTurn(universe, world, faction);
        return returnValue;
    }
    // Controllable.
    toControl(uwpe) {
        var universe = uwpe.universe;
        var world = uwpe.world;
        var planet = universe.venueCurrent.modelParent;
        var ship = uwpe.entity;
        var size = universe.display.sizeDefault();
        var fontHeight = 10;
        var fontNameAndHeight = FontNameAndHeight.fromHeightInPixels(fontHeight);
        var margin = fontHeight * 1.5;
        var buttonSize = Coords.fromXY(2, 2).multiplyScalar(fontHeight);
        var listSize = Coords.fromXY((size.x - margin * 4 - buttonSize.x) / 2, size.y - margin * 4 - fontHeight * 2);
        var itemHolderShipyard = planet.itemHolder();
        var itemHolderShip = ship.itemHolder();
        var venuePrev = universe.venueCurrent;
        var back = () => universe.venueTransitionTo(venuePrev);
        var transferItemFromShipyardToShip = () => {
            // todo
        };
        var transferItemFromShipToShipyard = () => {
            // todo
        };
        var returnValue = new ControlContainer("containerTransfer", Coords.create(), // pos
        size.clone(), 
        // children
        [
            new ControlLabel("labelInStock", Coords.fromXY(margin, margin), // pos
            Coords.fromXY(listSize.x, 25), // size
            false, // isTextCenteredHorizontally
            false, // isTextCenteredVertically
            DataBinding.fromContext("In Stock:"), fontNameAndHeight),
            new ControlList("listContainerItems", Coords.fromXY(margin, margin * 2), // pos
            listSize.clone(), DataBinding.fromContextAndGet(itemHolderShipyard, (c) => c.items), // items
            DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
            fontNameAndHeight, new DataBinding(itemHolderShipyard, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
            DataBinding.fromGet((c) => c), // bindingForItemValue
            DataBinding.fromTrue(), // isEnabled
            transferItemFromShipyardToShip, // confirm
            null),
            ControlButton.from8("buttonTransferToShip", Coords.fromXY((size.x - buttonSize.x) / 2, (size.y - buttonSize.y - margin) / 2), // pos
            buttonSize.clone(), ">", fontNameAndHeight, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            transferItemFromShipyardToShip // click
            ),
            ControlButton.from8("buttonPut", Coords.fromXY((size.x - buttonSize.x) / 2, (size.y + buttonSize.y + margin) / 2), // pos
            buttonSize.clone(), "<", fontNameAndHeight, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            transferItemFromShipToShipyard // click
            ),
            new ControlLabel("labelGetterPutterName", Coords.fromXY(size.x - margin - listSize.x, margin), // pos
            Coords.fromXY(85, 25), // size
            false, // isTextCenteredHorizontally
            false, // isTextCenteredVertically
            DataBinding.fromContext(ship.name + ":"), fontNameAndHeight),
            new ControlList("listOtherItems", Coords.fromXY(size.x - margin - listSize.x, margin * 2), // pos
            listSize.clone(), DataBinding.fromContextAndGet(itemHolderShip, (c) => c.items //.filter(x => x.item().defnName != itemDefnNameCurrency);
            ), // items
            DataBinding.fromGet((c) => c.toString(world)), // bindingForItemText
            fontNameAndHeight, new DataBinding(itemHolderShip, (c) => c.itemSelected, (c, v) => c.itemSelected = v), // bindingForItemSelected
            DataBinding.fromGet((c) => c), // bindingForItemValue
            DataBinding.fromTrue(), // isEnabled
            transferItemFromShipToShipyard, // confirm
            null),
            new ControlLabel("infoStatus", Coords.fromXY(size.x / 2, size.y - margin - fontHeight), // pos
            Coords.fromXY(size.x, fontHeight), // size
            true, // isTextCenteredHorizontally
            false, // isTextCenteredVertically
            DataBinding.fromContextAndGet(this, c => "[status]"), fontNameAndHeight),
            ControlButton.from8("buttonBuild", Coords.fromXY(size.x - (margin - buttonSize.x) * 2, size.y - margin - buttonSize.y), // pos
            buttonSize.clone(), "Build Ship", fontNameAndHeight, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            back // click
            ),
            ControlButton.from8("buttonDone", Coords.fromXY(size.x - margin - buttonSize.x, size.y - margin - buttonSize.y), // pos
            buttonSize.clone(), "Cancel", fontNameAndHeight, true, // hasBorder
            DataBinding.fromTrue(), // isEnabled
            back // click
            )
        ], [new Action("Back", back)], [new ActionToInputsMapping("Back", [Input.Names().Escape], true)]);
        return returnValue;
    }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
    // Equatable.
    equals(other) { return false; }
}
