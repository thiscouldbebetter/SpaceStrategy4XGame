
class Order //
{
	defnName: string;
	targetEntity: Entity;
	isComplete: boolean;

	constructor(defnName: string, targetEntity: Entity)
	{
		this.defnName = defnName;
		this.targetEntity = targetEntity;
		this.isComplete = false;
	}

	defn(): OrderDefn
	{
		return OrderDefn.Instances()._AllByName.get(this.defnName);
	}

	obey(universe: Universe, world: World, place: Place, entity: Entity): void
	{
		var orderable = Orderable.fromEntity(entity);
		if (this.isComplete)
		{
			orderable.order = null;
		}
		else
		{
			this.defn().obey(universe, world, place, entity);
		}
	}
}

class Orderable implements EntityPropertyBase
{
	order: Order;

	static fromEntity(entity: Entity): Orderable
	{
		return entity.propertyByName(Orderable.name) as Orderable;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable.
	equals(other: EntityPropertyBase): boolean { return false; }
}
