
class BodyDefn
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
}
