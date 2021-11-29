
class Buildable implements EntityPropertyBase
{
	defnName: string;
	pos: Coords;
	isComplete: boolean;

	_locatable: Locatable;
	_visual: VisualBase;

	constructor(defnName: string, pos: Coords, isComplete: boolean)
	{
		this.defnName = defnName;
		var loc = Disposition.fromPos(pos);
		this._locatable = new Locatable(loc);
		this.isComplete = (isComplete || false);
	}

	static fromEntity(entity: Entity): Buildable
	{
		return entity.propertyByName(Buildable.name) as Buildable;
	}

	defn(world: WorldExtended): BuildableDefn
	{
		return world.buildableDefnByName(this.defnName);
	}

	locatable(): Locatable
	{
		return this._locatable;
	}

	visual(world: WorldExtended): VisualBase
	{
		if (this._visual == null)
		{
			var defnVisual = this.defn(world).visual;
			if (this.isComplete)
			{
				this._visual = defnVisual;
			}
			else
			{
				this._visual = new VisualGroup
				([
					defnVisual,
					VisualText.fromTextAndColor("X", Color.byName("White"))
				]);
			}
		}

		return this._visual;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable.
	equals(other: Buildable): boolean { return false; }
}
