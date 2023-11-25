
class Device extends Item
{
	_deviceDefn: DeviceDefn;

	energyThisTurn: number;
	isActive: boolean;
	shieldingThisTurn: number;
	usesThisTurn: number;

	projectile: Projectile;

	targetEntity: Entity;

	constructor(defn: DeviceDefn)
	{
		super(defn.name, 1);
		this._deviceDefn = defn;
	}

	static fromEntity(deviceAsEntity: Entity): Device
	{
		return deviceAsEntity.propertyByName(Device.name) as Device;
	}

	deviceDefn(world: World): DeviceDefn
	{
		return this._deviceDefn;
	}

	updateForRound(uwpe: UniverseWorldPlaceEntities): void
	{
		var defn = this.deviceDefn(uwpe.world);
		defn.updateForRound(uwpe);
	}

	use(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.entity2 = this.toEntity(uwpe);
		var defn = this.deviceDefn(uwpe.world);
		defn.use(uwpe);
	}
}
