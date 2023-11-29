
class BuildableDefn
{
	name: string;
	isItem: boolean;
	terrainsAllowedNames: string[];
	sizeInPixels: Coords;
	visual: VisualBase;
	industryToBuild: number;
	effect: BuildableEffect;
	entityModifyOnBuild: (entity: Entity) => void;

	constructor
	(
		name: string,
		isItem: boolean,
		terrainsAllowedNames: string[],
		sizeInPixels: Coords,
		visual: VisualBase,
		industryToBuild: number,
		effect: BuildableEffect,
		entityModifyOnBuild: (entity: Entity) => void
	)
	{
		this.name = name;
		this.isItem = isItem;
		this.terrainsAllowedNames = terrainsAllowedNames;
		this.sizeInPixels = sizeInPixels;
		this.visual = this.visualWrapWithOverlay(visual);
		this.industryToBuild = industryToBuild;
		this.effect = effect;
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

	effectApply(uwpe: UniverseWorldPlaceEntities): void
	{
		this.effect.apply(uwpe);
	}

	isAllowedOnTerrain(terrain: MapTerrain): boolean
	{
		var returnValue = ArrayHelper.contains
		(
			this.terrainsAllowedNames, terrain.name
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
