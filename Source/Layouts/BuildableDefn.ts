

class BuildableDefn
{
	name: string;
	isItem: boolean;
	terrainNamesAllowed: string[];
	visual: VisualBase;
	resourcesToBuild: Resource[];
	resourcesPerTurn: Resource[];
	entityModifyOnBuild: (entity: Entity) => void;

	constructor
	(
		name: string,
		isItem: boolean,
		terrainNamesAllowed: string[],
		visual: VisualBase,
		resourcesToBuild: Resource[],
		resourcesPerTurn: Resource[],
		entityModifyOnBuild: (entity: Entity) => void
	)
	{
		this.name = name;
		this.isItem = isItem;
		this.terrainNamesAllowed = terrainNamesAllowed;
		this.visual = visual;
		this.resourcesToBuild = resourcesToBuild;
		this.resourcesPerTurn = resourcesPerTurn;
		this.entityModifyOnBuild = entityModifyOnBuild;
	}

	buildableToEntity(buildable: Buildable): Entity
	{
		var returnValue = new Entity
		(
			this.name,
			[
				buildable,
				buildable.locatable()
			]
		);

		if (this.isItem)
		{
			returnValue.propertyAdd
			(
				new Item(this.name, 1)
			);
		}

		if (this.entityModifyOnBuild != null)
		{
			this.entityModifyOnBuild(returnValue);
		}

		return returnValue;
	}
}
