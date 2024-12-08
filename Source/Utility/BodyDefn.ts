
class BodyDefn implements EntityPropertyBase
{
	name: string;
	size: Coords;
	visual: VisualBase;

	sizeHalf: Coords;

	constructor(name: string, size: Coords, visual: VisualBase)
	{
		this.name = name;
		this.size = size;
		this.visual = visual;

		this.sizeHalf = this.size.clone().half();
	}

	static fromEntity(entity: Entity): BodyDefn
	{
		return entity.propertyByName(BodyDefn.name) as BodyDefn;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return BodyDefn.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable.
	equals(other: BodyDefn): boolean { return false; }
}
