
class BodyDefn implements EntityProperty
{
	name: string;
	size: Coords;
	visual: Visual;

	sizeHalf: Coords;

	constructor(name: string, size: Coords, visual: Visual)
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

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}
