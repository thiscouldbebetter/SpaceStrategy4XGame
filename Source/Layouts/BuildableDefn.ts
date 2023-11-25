
class BuildableDefn
{
	name: string;
	isItem: boolean;
	terrainNamesAllowed: string[];
	sizeInPixels: Coords;
	visual: VisualBase;
	industryToBuild: number;
	resourcesPerTurn: Resource[]; // hack
	entityModifyOnBuild: (entity: Entity) => void;

	constructor
	(
		name: string,
		isItem: boolean,
		terrainNamesAllowed: string[],
		sizeInPixels: Coords,
		visual: VisualBase,
		industryToBuild: number,
		resourcesPerTurn: Resource[],
		entityModifyOnBuild: (entity: Entity) => void
	)
	{
		this.name = name;
		this.isItem = isItem;
		this.terrainNamesAllowed = terrainNamesAllowed;
		this.sizeInPixels = sizeInPixels;
		this.visual = this.visualWrapWithOverlay(visual);
		this.industryToBuild = industryToBuild;
		this.resourcesPerTurn = resourcesPerTurn || [];
		this.entityModifyOnBuild = entityModifyOnBuild;
	}

	buildableToEntity(buildable: Buildable): Entity
	{
		var returnValue = new Entity
		(
			this.name,
			[
				buildable,
				buildable.locatable(),
				Drawable.fromVisual(this.visual)
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

	isAllowedOnTerrain(terrain: MapTerrain): boolean
	{
		var returnValue = ArrayHelper.contains
		(
			this.terrainNamesAllowed, terrain.name
		);

		return returnValue;
	}

	visualWrapWithOverlay(visualToWrap: VisualBase): VisualBase
	{
		var visualOverlayShadedRectangle = VisualRectangle.fromSizeAndColorFill
		(
			this.sizeInPixels,
			Color.byName("BlackHalfTransparent")
		);

		var visualOverlayText = VisualText.fromTextHeightAndColor
		(
			"...", this.sizeInPixels.y / 2, Color.byName("White")
		);

		var visualOverlayTextAndShade = new VisualGroup
		([
			visualOverlayShadedRectangle,
			visualOverlayText
		]);

		var visualOverlay = new VisualSelect
		(
			new Map
			([
				[ "Complete", new VisualNone() ],
				[ "Incomplete", visualOverlayTextAndShade ]
			]),
			this.visualWrap_SelectChildNames
		)

		var visualWrapped = new VisualGroup
		([
			visualToWrap,
			visualOverlay
		]);

		return visualWrapped;
	}

	visualWrap_SelectChildNames(uwpe: UniverseWorldPlaceEntities, d: Display): string[]
	{
		var buildable = Buildable.ofEntity(uwpe.entity2);
		return (buildable.isComplete ? ["Complete"] : ["Incomplete"] );
	}

}
