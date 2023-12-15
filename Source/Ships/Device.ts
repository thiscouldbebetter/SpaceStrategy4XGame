
class Device implements EntityProperty<Device>
{
	_defn: DeviceDefn;

	isActive: boolean;
	usesRemainingThisRound: number;

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

	canBeUsedThisRoundByDeviceUser(deviceUser: DeviceUser): boolean
	{
		var defn = this.defn();

		var returnValue =
			this.usesRemainingThisRound > 0
			&& deviceUser.energyRemainsThisRound(defn.energyPerUse);

		return returnValue;
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
		var deviceUser = DeviceUser.ofEntity(uwpe.entity);

		if (this.canBeUsedThisRoundByDeviceUser(deviceUser) )
		{
			this.usesRemainingThisRound--;

			var defn = this.defn();
			deviceUser.energyRemainingThisRoundSubtract(defn.energyPerUse);

			uwpe.entity2 = this.toEntity();
			defn.use(uwpe);
		}
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
