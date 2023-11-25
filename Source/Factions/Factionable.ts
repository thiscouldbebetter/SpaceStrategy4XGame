
class Factionable implements EntityProperty<Factionable>
{
	factionName: string

	constructor(factionName: string)
	{
		this.factionName = factionName;
	}

	static ofEntity(entity: Entity): Factionable
	{
		return entity.propertyByName(Factionable.name) as Factionable;
	}

	faction(world: WorldExtended): Faction
	{
		var factionName = this.factionName;
		var faction = (factionName == null ? null : world.factionByName(factionName) );
		return faction;
	}

	factionSet(faction: Faction): void
	{
		this.factionName = faction.name;
	}

	factionSetByName(value: string): void
	{
		this.factionName = value;
	}

	// EntityProperty.

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	// Clonable.

	clone(): Factionable
	{
		return new Factionable(this.factionName);
	}

	overwriteWith(other: Factionable): Factionable
	{
		this.factionName = other.factionName;
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
		return this.factionName == other.factionName;
	}

}