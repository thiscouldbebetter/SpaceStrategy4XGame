
class MapTerrain
{
	name: string;
	codeChar: string;
	visual: VisualBase;
	isBlocked: boolean;

	constructor
	(
		name: string, codeChar: string, visual: VisualBase, isBlocked: boolean
	)
	{
		this.name = name;
		this.codeChar = codeChar;
		this.visual = visual;
		this.isBlocked = isBlocked;
	}
}
