"use strict";
class Shipyard {
    static fromEntity(entity) {
        return entity.propertyByName(Shipyard.name);
    }
    shipAssembleFromComponentsAndLaunch(universe, world, faction, planet, shipyardEntity, componentNames) {
        var returnValue = null;
        var cellPosToLaunchAt = planet.cellPositionsAvailableToOccupyInOrbit()[0];
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
        planet.buildableEntitiesRemove(componentItemsAsEntities);
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
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
    // Equatable.
    equals(other) { return false; }
}
