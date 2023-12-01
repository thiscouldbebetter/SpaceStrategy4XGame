
class Buildable implements EntityProperty<Buildable>
{
	defn: BuildableDefn;
	pos: Coords;
	isComplete: boolean;
	isAutomated: boolean;

	_locatable: Locatable;
	_visual: VisualBase;

	constructor
	(
		defn: BuildableDefn,
		pos: Coords,
		isComplete: boolean,
		isAutomated: boolean
	)
	{
		this.defn = defn;
		var loc = Disposition.fromPos(pos);
		this._locatable = new Locatable(loc);
		this.isComplete = isComplete || false;
		this.isAutomated = isAutomated || false;
	}

	static fromDefn(defn: BuildableDefn): Buildable
	{		
		return new Buildable
		(
			defn,
			null, // pos
			false, // isComplete
			false // isAutomated
		);
	}

	static fromDefnAndPosComplete(defn: BuildableDefn, pos: Coords): Buildable
	{
		return new Buildable(defn, pos, true, false);
	}

	static fromDefnAndPosIncomplete(defn: BuildableDefn, pos: Coords): Buildable
	{
		return new Buildable(defn, pos, false, false);
	}

	static ofEntity(entity: Entity): Buildable
	{
		return entity.propertyByName(Buildable.name) as Buildable;
	}

	effectApply(uwpe: UniverseWorldPlaceEntities): void
	{
		this.defn.effectApply(uwpe);
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
			this._entity = this.defn.buildableToEntity(this);
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
