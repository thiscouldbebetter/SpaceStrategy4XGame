
class Buildable implements EntityProperty<Buildable>
{
	defnName: string;
	pos: Coords;
	isComplete: boolean;
	isAutomated: boolean;

	_locatable: Locatable;
	_visual: VisualBase;

	constructor(defnName: string, pos: Coords, isComplete: boolean, isAutomated: boolean)
	{
		this.defnName = defnName;
		var loc = Disposition.fromPos(pos);
		this._locatable = new Locatable(loc);
		this.isComplete = isComplete || false;
		this.isAutomated = isAutomated || false;
	}

	static fromDefnName(defnName: string): Buildable
	{
		return new Buildable
		(
			defnName,
			null, // pos
			false, // isComplete
			false // isAutomated
		);
	}

	static fromDefnNameAndPos(defnName: string, pos: Coords): Buildable
	{
		return new Buildable(defnName, pos, false, false);
	}

	static ofEntity(entity: Entity): Buildable
	{
		return entity.propertyByName(Buildable.name) as Buildable;
	}

	defn(world: WorldExtended): BuildableDefn
	{
		return world.buildableDefnByName(this.defnName);
	}

	effectApply(uwpe: UniverseWorldPlaceEntities): void
	{
		var defn = this.defn(uwpe.world as WorldExtended);
		defn.effectApply(uwpe);
	}

	locatable(): Locatable
	{
		return this._locatable;
	}

	_entity: Entity;
	toEntity(world: WorldExtended): Entity
	{
		if (this._entity == null)
		{
			var defn = this.defn(world);
			this._entity = defn.buildableToEntity(this);
		}
		return this._entity;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable.
	equals(other: Buildable): boolean { return false; }
}
