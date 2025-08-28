
class BodyDefn extends EntityPropertyBase<BodyDefn>
{
	name: string;
	size: Coords;
	visual: VisualBase;

	sizeHalf: Coords;

	constructor(name: string, size: Coords, visual: VisualBase)
	{
		super();

		this.name = name;
		this.size = size;
		this.visual = visual;

		this.sizeHalf = this.size.clone().half();
	}

	static fromEntity(entity: Entity): BodyDefn
	{
		return entity.propertyByName(BodyDefn.name) as BodyDefn;
	}
}
