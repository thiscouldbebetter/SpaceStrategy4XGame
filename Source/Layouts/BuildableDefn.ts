
class BuildableDefn
{
	name: string;
	isItem: boolean;
	_canBeBuiltOnMapAtPosInCells: (map: MapLayout, posInCells: Coords) => boolean;
	sizeInPixels: Coords;
	visual: VisualBase;
	industryToBuild: number;
	effectPerRound: BuildableEffect;
	effectsAvailableToUse: BuildableEffect[];
	categories: BuildableCategory[];
	entityProperties: (uwpe: UniverseWorldPlaceEntities) => EntityPropertyBase[];
	_entityModifyOnBuild: (uwpe: UniverseWorldPlaceEntities) => void;
	description: string;

	constructor
	(
		name: string,
		isItem: boolean,
		canBeBuiltOnMapAtPosInCells: (map: MapLayout, posInCells: Coords) => boolean,
		sizeInPixels: Coords,
		visual: VisualBase,
		industryToBuild: number,
		effectPerRound: BuildableEffect,
		effectsAvailableToUse: BuildableEffect[],
		categories: BuildableCategory[],
		entityProperties: (uwpe: UniverseWorldPlaceEntities) => EntityPropertyBase[],
		entityModifyOnBuild: (uwpe: UniverseWorldPlaceEntities) => void,
		description: string
	)
	{
		this.name = name;
		this.isItem = isItem;
		this._canBeBuiltOnMapAtPosInCells = canBeBuiltOnMapAtPosInCells;
		this.sizeInPixels = sizeInPixels;
		this.visual = this.visualWrapWithOverlay(visual);
		this.industryToBuild = industryToBuild;
		this.effectPerRound = effectPerRound;
		this.effectsAvailableToUse = effectsAvailableToUse || new Array<BuildableEffect>();
		this.categories = categories || new Array<BuildableCategory>();
		this.entityProperties = entityProperties;
		this._entityModifyOnBuild = entityModifyOnBuild;
		this.description = description || "";
	}

	static fromName(name: string): BuildableDefn
	{
		return new BuildableDefn
		(
			name,
			false, // isItem
			null, // canBeBuiltOnMapAtPosInCells
			Coords.zeroes(), // sizeInPixels
			new VisualNone(),
			1, // industryToBuild
			null, // effectPerRound
			null, // effectsAvailableToUse
			null, // categories
			null, // entityProperties
			null, // entityModifyOnBuild
			null // description
		);
	}

	buildableToEntity(buildable: Buildable, world: WorldExtended): Entity
	{
		var properties = new Array<EntityPropertyBase>();

		properties.push(buildable);
		properties.push(buildable.locatable() );
		properties.push(Drawable.fromVisual(this.visual) );

		var returnEntity = new Entity(this.name, properties);

		var uwpe = new UniverseWorldPlaceEntities
		(
			null, world, null, returnEntity, null
		);

		if (this.entityProperties != null)
		{
			var propertiesActualized = this.entityProperties(uwpe);
			propertiesActualized.forEach(x => returnEntity.propertyAdd(x) );
		}

		if (this.isItem)
		{
			returnEntity.propertyAdd
			(
				new Item(this.name, 1)
			);
		}

		this.entityModifyOnBuild(uwpe);

		return returnEntity;
	}

	canBeBuiltOnMapAtPosInCells(map: MapLayout, posInCells: Coords): boolean
	{
		return this._canBeBuiltOnMapAtPosInCells(map, posInCells);
	}

	categoryIsOrbital(): boolean
	{
		return this.categories.indexOf(BuildableCategory.Instances().Orbital) >= 0;
	}

	categoryIsShield(): boolean
	{
		return this.categories.indexOf(BuildableCategory.Instances().Shield) >= 0;
	}

	effectPerRoundApply(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.effectPerRound != null)
		{
			this.effectPerRound.apply(uwpe);
		}
	}

	entityModifyOnBuild(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._entityModifyOnBuild != null)
		{
			this._entityModifyOnBuild(uwpe);
		}
	}

	nameAndCost(): string
	{
		return this.name + " (" + this.industryToBuild + ")";
	}

	strategicValue(): number
	{
		return this.industryToBuild;
	}

	visualWrapWithOverlay(visualToWrap: VisualBase): VisualBase
	{
		var visualOverlayShadedRectangle = VisualRectangle.fromSizeAndColorFill
		(
			this.sizeInPixels,
			Color.byName("BlackHalfTransparent")
		);

		var visualOverlayText = VisualText.fromTextBindingFontAndColor
		(
			DataBinding.fromGet
			(
				(c: UniverseWorldPlaceEntities) =>
				{
					var buildableProgress = "";
					var venueCurrent = c.universe.venueCurrent();
					var venueCurrentTypeName = venueCurrent.constructor.name;
					 // hack
					var venueLayout =
					(
						venueCurrentTypeName == VenueFader.name
						?
							(venueCurrent as VenueFader).venueToFadeTo().constructor.name == VenueLayout.name
							? (venueCurrent as VenueFader).venueToFadeTo()
							: (venueCurrent as VenueFader).venueToFadeFrom()
						: venueCurrent
					) as VenueLayout;
					var planet = venueLayout.modelParent as Planet;
					buildableProgress = planet.industryBuildableProgress(c.universe);
					return buildableProgress;
				}
			),
			FontNameAndHeight.fromHeightInPixels(this.sizeInPixels.y / 2),
			Color.byName("White")
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
		var buildableAsEntity = uwpe.entity;
		var buildable = Buildable.ofEntity(buildableAsEntity);
		return (buildable.isComplete ? ["Complete"] : ["Incomplete"] );
	}

	// Clonable.

	clone(): BuildableDefn
	{
		throw new Error("Not yet implemented.");
	}

	overwriteWith(other: BuildableDefn): BuildableDefn
	{
		throw new Error("Not yet implemented.");
	}

}
