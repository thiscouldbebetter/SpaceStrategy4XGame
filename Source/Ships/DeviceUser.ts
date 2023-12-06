
class DeviceUser implements EntityProperty<DeviceUser>
{
	_deviceSelected: Device;
	_devicesDrives: Device[];
	_devicesUsable: Device[];

	constructor()
	{
		// todo
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

			this._devicesDrives = devices.filter
			(
				(x: Device) => x.defn().categoryNames.indexOf("Drive") >= 0
			);
		}

		return this._devicesDrives;
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
