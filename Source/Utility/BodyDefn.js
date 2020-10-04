
class BodyDefn
{
	constructor(name, size, visual)
	{
		this.name = name;
		this.size = size;
		this.visual = visual;

		this.sizeHalf = this.size.clone().divideScalar(2);
	}
}
