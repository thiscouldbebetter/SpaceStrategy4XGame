

class BuildableDefn
{
	name: string;
	terrainNamesAllowed: string[];
	visual: VisualBase;
	resourcesToBuild: Resource[];
	resourcesPerTurn: Resource[];

	constructor
	(
		name: string,
		terrainNamesAllowed: string[],
		visual: VisualBase,
		resourcesToBuild: Resource[],
		resourcesPerTurn: Resource[]
		// todo - use.
	)
	{
		this.name = name;
		this.terrainNamesAllowed = terrainNamesAllowed;
		this.visual = visual;
		this.resourcesToBuild = resourcesToBuild;
		this.resourcesPerTurn = resourcesPerTurn;
	}
}
