
class MapTerrain
{
	name: string;
	codeChar: string;
	visual: Visual;
	isBlocked: boolean;

	constructor
	(
		name: string, codeChar: string, visual: Visual, isBlocked: boolean
	)
	{
		this.name = name;
		this.codeChar = codeChar;
		this.visual = visual;
		this.isBlocked = isBlocked;
	}
}
