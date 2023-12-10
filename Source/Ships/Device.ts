
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

	defn(): DeviceDefn
	{
		return this._defn;
	}

	toEntity(): Entity
	{
		var defn = this.defn();
		return new Entity(Device.name + defn.name, [ this ]);
	}

	updateForRound(uwpe: UniverseWorldPlaceEntities): void
	{
		var defn = this.defn();
		defn.updateForRound(uwpe);
	}

	use(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.entity2 = this.toEntity();
		var defn = this.defn();
		defn.use(uwpe);
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	// Clonable.

	clone(): Device
	{
		throw new Error("Not yet implemented.");
	}

	overwriteWith(other: Device): Device
	{
		throw new Error("Not yet implemented.");
	}

	// Equatable.

	equals(other: Device): boolean { return false; } // todo

}
