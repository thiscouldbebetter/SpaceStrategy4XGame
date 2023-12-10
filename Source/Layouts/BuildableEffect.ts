
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
