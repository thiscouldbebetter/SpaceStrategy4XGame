
class Order //
{
	defn: OrderDefn;
	entityBeingOrdered: Entity;
	deviceToUse: Device2;
	entityBeingTargeted: Entity;
	_isComplete: boolean;

	constructor()
	{
		this.clear();
	}

	static fromDefn(defn: OrderDefn): Order
	{
		return new Order().defnSet(defn);
	}

	clear(): Order
	{
		this.defn = OrderDefn.Instances().DoNothing;
		this.entityBeingOrderedSet(null);
		this.deviceToUse = null;
		this.entityBeingTargeted = null;
		this.isCompleteSet(false);
		return this;
	}

	complete(): Order
	{
		this.isCompleteSet(true);
		return this;
	}

	defnSet(value: OrderDefn): Order
	{
		this.defn = value;
		return this;
	}

	deviceToUseSet(value: Device2): Order
	{
		this.deviceToUse = value;
		return this;
	}

	entityBeingOrderedSet(value: Entity): Order
	{
		this.entityBeingOrdered = value;
		return this;
	}

	entityBeingTargetedSet(value: Entity): Order
	{
		this.entityBeingTargeted = value;
		return this;
	}

	isAwaitingTarget(): boolean
	{
		return (this.entityBeingTargeted == null);
	}

	isComplete(): boolean
	{
		return this._isComplete;
	}

	isCompleteSet(value: boolean): Order
	{
		this._isComplete = value;
		return this;
	}

	isNothing(): boolean
	{
		return (this.defn == OrderDefn.Instances().DoNothing);
	}

	obey(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityBeingOrdered = this.entityBeingOrdered;
		uwpe.entitySet(entityBeingOrdered);
		this.defn.obey(uwpe);
	}

	toStringDescription(): string
	{
		return this.defn.description + " " + this.entityBeingTargeted.name;
	}
}

class Orderable extends EntityPropertyBase<Orderable>
{
	_order: Order;

	static fromEntity(entity: Entity): Orderable
	{
		return entity.propertyByName(Orderable.name) as Orderable;
	}

	order(entityOrderable: Entity): Order
	{
		if (this._order == null)
		{
			this._order = new Order().entityBeingOrderedSet(entityOrderable);
		}
		return this._order;
	}

	orderSet(value: Order): void
	{
		this._order = value;
	}
}
