
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
	_entityModifyOnBuild: (uwpe: UniverseWorldPlaceEntities) => void;

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
		entityModifyOnBuild: (uwpe: UniverseWorldPlaceEntities) => void
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
		this._entityModifyOnBuild = entityModifyOnBuild;
	}

	buildableToEntity(buildable: Buildable, world: WorldExtended): Entity
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

		var uwpe = new UniverseWorldPlaceEntities
		(
			null, world, null, returnValue, null
		);
		this.entityModifyOnBuild(uwpe);

		return returnValue;
	}

	canBeBuiltOnMapAtPosInCells(map: MapLayout, posInCells: Coords): boolean
	{
		return this._canBeBuiltOnMapAtPosInCells(map, posInCells);
	}

	effectPerRoundApply(uwpe: UniverseWorldPlaceEntities): void
	{
		this.effectPerRound.apply(uwpe);
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

}

class BuildableCategory
{
	name: string;

	constructor(name: string)
	{
		this.name = name;
	}

	static _instances: BuildableCategory_Instances;
	static Instances(): BuildableCategory_Instances
	{
		if (BuildableCategory._instances == null)
		{
			BuildableCategory._instances = new BuildableCategory_Instances();
		}
		return BuildableCategory._instances;
	}
}

class BuildableCategory_Instances
{
	ShipDrive: BuildableCategory;
	ShipGenerator: BuildableCategory;
	ShipItem: BuildableCategory;
	ShipSensor: BuildableCategory;
	ShipShield: BuildableCategory;
	ShipStarlaneDrive: BuildableCategory;
	ShipWeapon: BuildableCategory;

	constructor()
	{
		this.ShipDrive 			= new BuildableCategory("Ship Drive");
		this.ShipGenerator 		= new BuildableCategory("Ship Generator");
		this.ShipItem 			= new BuildableCategory("Ship Item");
		this.ShipSensor 		= new BuildableCategory("Ship Sensor");
		this.ShipShield 		= new BuildableCategory("Ship Shield");
		this.ShipStarlaneDrive 	= new BuildableCategory("Ship Starlane Drive");
		this.ShipWeapon 		= new BuildableCategory("Ship Weapon");
	}
}


class BuildableEffect
{
	name: string;
	orderToApplyIn: number;
	_apply: (uwpe: UniverseWorldPlaceEntities) => void;

	constructor
	(
		name: string,
		orderToApplyIn: number,
		apply: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.name = name;
		this.orderToApplyIn = orderToApplyIn;
		this._apply = apply;
	}

	static _instances: BuildableEffect_Instances;
	static Instances(): BuildableEffect_Instances
	{
		if (BuildableEffect._instances == null)
		{
			BuildableEffect._instances = new BuildableEffect_Instances();
		}
		return BuildableEffect._instances;
	}

	static applyManyInOrder(effects: BuildableEffect[], uwpe: UniverseWorldPlaceEntities): void
	{
		var orders = new Array<number>();
		var effectArraysByOrder = new Map<number, BuildableEffect[]>();

		effects.forEach
		(
			effect =>
			{
				var order = effect.orderToApplyIn;
				if (effectArraysByOrder.has(order) == false)
				{
					orders.push(order);
					effectArraysByOrder.set(order, []);
				}
				var effectsWithSameOrder = effectArraysByOrder.get(order);
				effectsWithSameOrder.push(effect);
			}
		);

		for (var i = 0; i < orders.length; i++)
		{
			var order = orders[i];
			var effects = effectArraysByOrder.get(order);
			for (var e = 0; e < effects.length; e++)
			{
				var effect = effects[e];
				effect.apply(uwpe);
			}
		}
	}

	apply(uwpe: UniverseWorldPlaceEntities): void
	{
		this._apply(uwpe);
	}
}

class BuildableEffect_Instances
{
	None: BuildableEffect;
	ThrowError: BuildableEffect;

	constructor()
	{
		this.None = new BuildableEffect("None", 0, (uwpe: UniverseWorldPlaceEntities) => {} );
		this.ThrowError = new BuildableEffect("Throw Error", 0, (uwpe: UniverseWorldPlaceEntities) => { throw new Error(BuildableEffect.name); } );
	}
}
