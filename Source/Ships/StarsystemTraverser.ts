
class StarsystemTraverser implements EntityProperty<StarsystemTraverser>
{
	_distanceMaxPerMove: number;

	constructor(distanceMaxPerMove: number)
	{
		this._distanceMaxPerMove = distanceMaxPerMove;
	}

	static ofEntity(entity: Entity): StarsystemTraverser
	{
		return entity.propertyByName(StarsystemTraverser.name) as StarsystemTraverser;
	}

	distanceMaxPerMove(): number
	{
		return this._distanceMaxPerMove;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Clonable.

	clone(): StarsystemTraverser
	{
		throw new Error("Not yet implemented.");
	}

	overwriteWith(other: StarsystemTraverser): StarsystemTraverser
	{
		throw new Error("Not yet implemented.");
	}

	// Equatable.

	equals(other: StarsystemTraverser): boolean
	{
		return false; // todo
	}
}