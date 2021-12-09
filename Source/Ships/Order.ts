
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

	assignToEntityOrderable(entityOrderable: Entity): Order
	{
		var orderable = Orderable.fromEntity(entityOrderable);
		orderable.order = this;
		return this;
	}

	clear(): Order
	{
		// This method seems linked to odd compile-time errors
		// in SystemTests.playFromStart().
		this.defnName = null;
		this.targetEntity = null;
		this.isComplete = false;
		return this;
	}

	complete(): Order
	{
		this.isComplete = true;
		return this;
	}

	defn(): OrderDefn
	{
		var returnValue = OrderDefn.Instances()._AllByName.get(this.defnName);
		return returnValue;
	}

	defnNameAndTargetEntitySet(defnName: string, targetEntity: Entity): Order
	{
		this.defnName = defnName;
		this.targetEntity = targetEntity;
		return this;
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
			var defn = this.defn();
			defn.obey(universe, world, place, entity);
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
