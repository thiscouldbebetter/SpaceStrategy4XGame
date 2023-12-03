
class PlanetAsPlace implements Place
{
	planet: Planet;

	constructor(planet: Planet)
	{
		this.planet = planet;

		this.name = this.planet.name;
	}
	
	// Place implementation.
	
	name: string;
	
	equals(other: Place): boolean
	{
		return (this.name == other.name);
	}
	
	camera(): Entity { throw new Error("Not implemented!"); }
	defn(world: World): PlaceDefn { throw new Error("Not implemented!"); }
	draw(universe: Universe, world: World, display: Display): void { throw new Error("Not implemented!"); }
	drawables(): Entity[] { throw new Error("Not implemented!"); }
	entitiesAll(): Entity[] { throw new Error("Not implemented!"); }
	entitiesByPropertyName(propertyName: string): Entity[] { throw new Error("Not implemented!"); }
	entitiesRemove(): void { throw new Error("Not implemented!"); }
	entitiesToRemoveAdd(entitiesToRemove: Entity[]): void { throw new Error("Not implemented!"); }
	entitiesToSpawnAdd(entitiesToSpawn: Entity[]): void { throw new Error("Not implemented!"); }
	entitiesSpawn(uwpe: UniverseWorldPlaceEntities): void { throw new Error("Not implemented!"); }
	entityById(entityId: number): Entity { throw new Error("Not implemented!"); }
	entityByName(entityName: string): Entity { throw new Error("Not implemented!"); }
	entityRemove(entity: Entity): void { throw new Error("Not implemented!"); }
	entitySpawn(uwpe: UniverseWorldPlaceEntities): void { throw new Error("Not implemented!"); }
	entitySpawn2(universe: Universe, world: World, entity: Entity): void { throw new Error("Not implemented!"); }
	entityToRemoveAdd(entityToRemove: Entity): void { throw new Error("Not implemented!"); }
	entityToSpawnAdd(entityToSpawn: Entity): void { throw new Error("Not implemented!"); }
	finalize(uwpe: UniverseWorldPlaceEntities): void { throw new Error("Not implemented!"); }
	initialize(uwpe: UniverseWorldPlaceEntities): void { throw new Error("Not implemented!"); }
	placeParent(world: World): Place { throw new Error("Not implemented!"); }
	placesAncestors(world: World, placesInAncestry: Place[]): Place[] { throw new Error("Not implemented!"); }
	size(): Coords { throw new Error("Not implemented!"); }
	toControl(universe: Universe, world: World): ControlBase { throw new Error("Not implemented!"); }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void { throw new Error("Not implemented!"); }
}
