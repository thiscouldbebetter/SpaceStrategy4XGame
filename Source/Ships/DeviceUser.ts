
class DeviceUser implements EntityProperty<DeviceUser>
{
	_energyRemainingThisRound: number;
	_energyPerRound: number;

	_deviceSelected: Device;
	_devicesDrives: Device[];
	_devicesStarlaneDrives: Device[];
	_devicesUsable: Device[];

	constructor()
	{
		this._energyRemainingThisRound = 0;
		this._energyPerRound = 0;
	}

	static ofEntity(entity: Entity): DeviceUser
	{
		return entity.propertyByName(DeviceUser.name) as DeviceUser;
	}

	deviceSelect(deviceToSelect: Device): void
	{
		this._deviceSelected = deviceToSelect;
	}

	deviceSelected(): Device
	{
		return this._deviceSelected;
	}

	deviceSelectedCanBeUsedThisRound(): boolean
	{
		var deviceSelected = this.deviceSelected();
		var canBeUsed =
			deviceSelected == null
			? false
			: deviceSelected.canBeUsedThisRoundByDeviceUser(this);
		return canBeUsed;
	}

	devices(ship: Ship): Device[]
	{
		var deviceEntities = ship.componentEntities.filter
		(
			(x: Entity) => Device.ofEntity(x) != null
		);
		var devices = deviceEntities.map(x => Device.ofEntity(x) );
		return devices;
	}

	devicesDrives(ship: Ship): Device[]
	{
		if (this._devicesDrives == null)
		{
			var devices = this.devices(ship);

			var categoryShipDrive = BuildableCategory.Instances().ShipDrive;

			this._devicesDrives = devices.filter
			(
				(x: Device) => x.defn().categories.indexOf(categoryShipDrive) >= 0
			);
		}

		return this._devicesDrives;
	}

	devicesStarlaneDrives(ship: Ship): Device[]
	{
		if (this._devicesStarlaneDrives == null)
		{
			var devices = this.devices(ship);

			var categories = BuildableCategory.Instances();

			this._devicesStarlaneDrives = devices.filter
			(
				(x: Device) => x.defn().categories.indexOf(categories.ShipStarlaneDrive) >= 0
			);
		}

		return this._devicesStarlaneDrives;
	}

	devicesUsable(ship: Ship): Device[]
	{
		if (this._devicesUsable == null)
		{
			var devices = this.devices(ship);

			this._devicesUsable = devices.filter
			(
				(x: Device) => x.defn().isActive
			);
		}

		return this._devicesUsable;
	}

	_energyPerMove: number
	energyPerMove(ship: Ship): number
	{
		if (this._energyPerMove == null)
		{
			var devicesDrives = this.devicesDrives(ship);
			var energyPerMoveSoFar = 0;
			devicesDrives.forEach(x => energyPerMoveSoFar += x.defn().energyPerUse);
			this._energyPerMove = energyPerMoveSoFar;
		}
		return this._energyPerMove;
	}

	energyPerMoveClear(): void
	{
		this._energyPerMove = 0;
	}

	energyPerRound(): number
	{
		return this._energyPerRound;
	}

	energyPerRoundAdd(energyToAdd: number): void
	{
		this._energyPerRound += energyToAdd;
	}

	energyPerRoundClear(): void
	{
		this._energyPerRound = 0;
	}

	energyRemainingThisRound(): number
	{
		return this._energyRemainingThisRound;
	}

	energyRemainingThisRoundAdd(energyToAdd: number): void
	{
		this._energyRemainingThisRound += energyToAdd;
	}

	energyRemainingThisRoundClear(): void
	{
		this._energyRemainingThisRound = 0;
	}

	energyRemainingThisRoundReset(): void
	{
		this._energyRemainingThisRound = this.energyPerRound();
	}

	energyRemainingThisRoundSubtract(energyToSubtract: number): void
	{
		this._energyRemainingThisRound -= energyToSubtract;
	}

	energyRemainsThisRound(energyToCheck: number): boolean
	{
		return (this._energyRemainingThisRound >= energyToCheck);
	}

	// Clonable.

	clone(): DeviceUser
	{
		throw new Error("Not yet implemented.");
	}

	overwriteWith(other: DeviceUser): DeviceUser
	{
		throw new Error("Not yet implemented.");
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable.

	equals(other: DeviceUser): boolean
	{
		return false; // todo
	}
}
