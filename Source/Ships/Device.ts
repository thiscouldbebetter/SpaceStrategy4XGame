
class Device implements EntityProperty<Device>
{
	_defn: DeviceDefn;

	energyThisTurn: number;
	isActive: boolean;
	shieldingThisTurn: number;
	usesThisTurn: number;

	projectile: Projectile;

	targetEntity: Entity;

	constructor(defn: DeviceDefn)
	{
		this._defn = defn;
	}

	static ofEntity(entity: Entity): Device
	{
		return entity.propertyByName(Device.name) as Device;
	}

	defn(world: World): DeviceDefn
	{
		return this._defn;
	}

	toEntity(uwpe: UniverseWorldPlaceEntities): Entity
	{
		var defn = this.defn(uwpe.world);
		return new Entity(Device.name + defn.name, [ this ]);
	}

	updateForRound(uwpe: UniverseWorldPlaceEntities): void
	{
		var defn = this.defn(uwpe.world);
		defn.updateForRound(uwpe);
	}

	use(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.entity2 = this.toEntity(uwpe);
		var defn = this.defn(uwpe.world);
		defn.use(uwpe);
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	// Clonable.

	clone(): Device
	{
		return this; // todo
	}

	// Equatable.

	equals(other: Device): boolean { return false; } // todo

}
