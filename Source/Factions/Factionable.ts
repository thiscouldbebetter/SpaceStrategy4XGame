
class Factionable implements EntityProperty<Factionable>
{
	_faction: Faction;

	constructor(faction: Faction)
	{
		this._faction = faction;
	}

	static ofEntity(entity: Entity): Factionable
	{
		return entity.propertyByName(Factionable.name) as Factionable;
	}

	faction(): Faction
	{
		return this._faction;
	}

	factionSet(faction: Faction): void
	{
		this._faction = faction;
	}

	// EntityProperty.

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	// Clonable.

	clone(): Factionable
	{
		return new Factionable(this.faction() );
	}

	overwriteWith(other: Factionable): Factionable
	{
		this.faction = other.faction;
		return this;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing;
	}

	// Equatable

	equals(other: Factionable): boolean
	{
		return this.faction == other.faction;
	}

}
