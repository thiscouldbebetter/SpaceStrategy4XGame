
class Device2 extends EntityPropertyBase<Device2>
{
	_defn: DeviceDefn;

	isActive: boolean;
	usesRemainingThisRound: number;

	projectile: Projectile;

	targetEntity: Entity;

	constructor(defn: DeviceDefn)
	{
		super();

		this._defn = defn;
		this.usesRemainingThisRoundReset();
	}

	static ofEntity(entity: Entity): Device2
	{
		return entity.propertyByName(Device2.name) as Device2;
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

	nameAndUsesRemainingThisRound(): string
	{
		var name = this.defn().name;
		var returnValue = name + " (" + this.usesRemainingThisRound + ")";
		return returnValue;
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
		this.usesRemainingThisRoundReset();
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

	usesRemainingThisRoundReset(): void
	{
		var defn = this.defn();
		this.usesRemainingThisRound = defn.usesPerRound;
	}

}
