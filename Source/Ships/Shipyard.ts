
class Shipyard implements EntityProperty<Shipyard>
{
	static fromEntity(entity: Entity): Shipyard
	{
		return entity.propertyByName(Shipyard.name) as Shipyard;
	}

	shipAssembleFromComponentsAndLaunch
	(
		universe: Universe,
		world: WorldExtended,
		faction: Faction,
		planet: Planet,
		shipyardEntity: Entity,
		componentNames: string[]
	): Ship
	{
		var returnValue = null;

		var cellPosToLaunchAt =
			planet.cellPositionsAvailableToOccupyInOrbit()[0];

		if (cellPosToLaunchAt == null)
		{
			throw new Error("No room to launch ship!");
		}

		var planetItemHolder = planet.itemHolder();
		var componentItems = componentNames.map
		(
			x => planetItemHolder.itemsByDefnName(x)[0]
		)

		var hasAllItems = planetItemHolder.hasItems(componentItems);

		if (hasAllItems == false)
		{
			throw new Error("Specified items not in stock!");
		}

		planetItemHolder.itemsRemove(componentItems);

		var uwpe = new UniverseWorldPlaceEntities
		(
			universe, world, null, shipyardEntity, null
		);

		var componentItemsAsEntities =
			componentItems.map(x => x.toEntity(uwpe));

		planet.buildableEntitiesRemove(componentItemsAsEntities);

		var itemDefns = componentNames.map
		(
			itemDefnName => world.defn.itemDefnByName(itemDefnName)
		);

		var items = itemDefns.map
		(
			itemDefn => itemDefn.toItem()
		);

		faction.shipsBuiltSoFarCount++;
		var shipNumber = faction.shipsBuiltSoFarCount;

		var shipName =
			faction.name
			+ " " + Ship.name
			+ " " + shipNumber;

		var shipBodyDefn = Ship.bodyDefnBuild(faction.color);

		returnValue = new Ship
		(
			shipName,
			shipBodyDefn,
			cellPosToLaunchAt,
			faction.name,
			items
		);

		returnValue.updateForTurn(universe, world, faction);

		return returnValue;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable.
	equals(other: Shipyard): boolean { return false; }

}