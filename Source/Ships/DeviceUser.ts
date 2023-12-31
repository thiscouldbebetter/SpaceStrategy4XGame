
class DeviceUser implements EntityProperty<DeviceUser>
{
	_deviceSelected: Device;
	_devices: Device[];
	_devicesDrives: Device[];
	_devicesGenerators: Device[];
	_devicesSensors: Device[];
	_devicesShields: Device[];
	_devicesStarlaneDrives: Device[];
	_devicesUsable: Device[];

	_distanceMaxPerMove: number;
	_energyPerMove: number;
	_energyPerRound: number;
	_energyRemainingThisRound: number;
	_sensorRange: number;
	_shielding: number;
	_speedThroughLink: number;

	constructor(devices: Device[])
	{
		this._devices = devices;
	}

	static fromEntities(entities: Entity[]): DeviceUser
	{
		var devices = entities.map
		(
			x => Device.ofEntity(x)
		).filter
		(
			x => (x != null)
		);

		var deviceUser = new DeviceUser(devices);

		return deviceUser;
	}

	static ofEntity(entity: Entity): DeviceUser
	{
		return entity.propertyByName(DeviceUser.name) as DeviceUser;
	}

	reset(): void
	{
		this.distanceMaxPerMoveReset();
		this.energyPerMoveReset();
		this.energyPerRoundReset();
		this.speedThroughLinkReset();
		this.sensorRangeReset();
		this.shieldingReset();
	}

	// Devices.

	deviceAdd(deviceToAdd: Device): void
	{
		this._devices.push(deviceToAdd);
	}

	deviceRemove(deviceToRemove: Device): void
	{
		this._devices.splice(this._devices.indexOf(deviceToRemove), 1);
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

	devices(): Device[]
	{
		return this._devices;
	}

	devicesDrives(): Device[]
	{
		if (this._devicesDrives == null)
		{
			var devices = this.devices();

			var categoryShipDrive = BuildableCategory.Instances().ShipDrive;

			this._devicesDrives = devices.filter
			(
				(x: Device) => x.defn().categories.indexOf(categoryShipDrive) >= 0
			);
		}

		return this._devicesDrives;
	}

	devicesGenerators(): Device[]
	{
		if (this._devicesGenerators == null)
		{
			var devices = this.devices();

			var categoryShipGenerators =
				BuildableCategory.Instances().ShipGenerator;

			this._devicesGenerators = devices.filter
			(
				(x: Device) => x.defn().categories.indexOf(categoryShipGenerators) >= 0
			);
		}

		return this._devicesGenerators;
	}

	devicesSensors(): Device[]
	{
		if (this._devicesSensors == null)
		{
			var devices = this.devices();

			var categoryShipSensor = BuildableCategory.Instances().ShipSensor;

			this._devicesSensors = devices.filter
			(
				(x: Device) => x.defn().categories.indexOf(categoryShipSensor) >= 0
			);
		}

		return this._devicesSensors;
	}

	devicesShields(): Device[]
	{
		if (this._devicesShields == null)
		{
			var devices = this.devices();

			var categoryShipShield = BuildableCategory.Instances().ShipShield;

			this._devicesShields = devices.filter
			(
				(x: Device) => x.defn().categories.indexOf(categoryShipShield) >= 0
			);
		}

		return this._devicesShields;
	}

	devicesStarlaneDrives(): Device[]
	{
		if (this._devicesStarlaneDrives == null)
		{
			var devices = this.devices();

			var categories = BuildableCategory.Instances();

			this._devicesStarlaneDrives = devices.filter
			(
				(x: Device) => x.defn().categories.indexOf(categories.ShipStarlaneDrive) >= 0
			);
		}

		return this._devicesStarlaneDrives;
	}

	devicesUsable(): Device[]
	{
		if (this._devicesUsable == null)
		{
			var devices = this.devices();

			this._devicesUsable = devices.filter
			(
				(x: Device) => x.defn().isActive
			);
		}

		return this._devicesUsable;
	}

	distanceMaxPerMove(uwpe: UniverseWorldPlaceEntities): number
	{
		if (this._distanceMaxPerMove == null)
		{
			this._distanceMaxPerMove = 0;
			var devicesDrives = this.devicesDrives();

			var energyPerMoveBefore = this._energyPerMove;
			var energyPerRoundBefore = this._energyPerRound;

			devicesDrives.forEach(x => x.updateForRound(uwpe) );

			this._energyPerMove = energyPerMoveBefore;
			this._energyPerRound = energyPerRoundBefore;
		}
		return this._distanceMaxPerMove;
	}

	distanceMaxPerMoveAdd(distanceToAdd: number): void
	{
		this._distanceMaxPerMove += distanceToAdd;
	}

	distanceMaxPerMoveReset(): void
	{
		this._distanceMaxPerMove = null;
	}

	energyPerMove(): number
	{
		if (this._energyPerMove == null)
		{
			var devicesDrives = this.devicesDrives();
			var energyPerMoveSoFar = 0;
			var distanceMaxPerMoveBefore = this._distanceMaxPerMove;
			devicesDrives.forEach(x => energyPerMoveSoFar += x.defn().energyPerUse);
			this._distanceMaxPerMove = distanceMaxPerMoveBefore;
			this._energyPerMove = energyPerMoveSoFar;
		}
		return this._energyPerMove;
	}

	energyPerMoveAdd(energyToAdd: number): void
	{
		this._energyPerMove += energyToAdd;
	}

	energyPerMoveReset(): void
	{
		this._energyPerMove = null;
	}

	energyPerRound(uwpe: UniverseWorldPlaceEntities): number
	{
		if (this._energyPerRound == null)
		{
			this._energyPerRound = 0;

			var devicesGenerators = this.devicesGenerators();

			var distanceMaxPerMoveBefore = this._distanceMaxPerMove;

			devicesGenerators.forEach(x => x.updateForRound(uwpe) );

			this._distanceMaxPerMove = distanceMaxPerMoveBefore;
		}
		return this._energyPerRound;
	}

	energyPerRoundAdd(energyToAdd: number): void
	{
		this._energyPerRound += energyToAdd;
	}

	energyPerRoundReset(): void
	{
		this._energyPerRound = null;
	}

	energyRemainingOverMax(uwpe: UniverseWorldPlaceEntities): string
	{
		var energyRemaining = this.energyRemainingThisRound(uwpe);
		var energyPerRound = this.energyPerRound(uwpe);
		var energyRemainingOverMax = energyRemaining + "/" + energyPerRound;
		return energyRemainingOverMax;
	}

	energyRemainingThisRound(uwpe: UniverseWorldPlaceEntities): number
	{
		if (this._energyRemainingThisRound == null)
		{
			this.energyRemainingThisRoundReset(uwpe);
		}
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

	energyRemainingThisRoundIsEnoughToMove(uwpe: UniverseWorldPlaceEntities): boolean
	{
		var energyRemainingThisRound = this.energyRemainingThisRound(uwpe);
		var energyPerMove = this.energyPerMove();
		var isEnough =
			(energyRemainingThisRound >= energyPerMove);
		return isEnough;
	}

	energyRemainingThisRoundReset(uwpe: UniverseWorldPlaceEntities): void
	{
		this._energyRemainingThisRound = this.energyPerRound(uwpe);
	}

	energyRemainingThisRoundSubtract(energyToSubtract: number): void
	{
		this._energyRemainingThisRound -= energyToSubtract;
	}

	energyRemainsThisRoundAny(): boolean
	{
		return (this._energyRemainingThisRound > 0);
	}

	energyRemainsThisRound(energyToCheck: number): boolean
	{
		return (this._energyRemainingThisRound >= energyToCheck);
	}

	sensorRange(ship: Ship): number
	{
		if (this._sensorRange == null)
		{
			this._sensorRange = 0;
			var devicesSensors = this.devicesSensors();
			var uwpe = UniverseWorldPlaceEntities.create().entitySet(ship);
			devicesSensors.forEach(x => x.updateForRound(uwpe) );
		}
		return this._sensorRange;
	}

	sensorRangeAdd(rangeToAdd: number): void
	{
		this._sensorRange += rangeToAdd;
	}

	sensorRangeReset(): void
	{
		this._sensorRange = null;
	}

	shielding(ship: Ship): number
	{
		if (this._shielding == null)
		{
			this._shielding = 0;
			var devicesShields = this.devicesShields();
			var uwpe = UniverseWorldPlaceEntities.create().entitySet(ship);
			devicesShields.forEach(x => x.updateForRound(uwpe) );
		}

		return this._shielding;
	}

	shieldingAdd(shieldingToAdd: number): void
	{
		this._shielding += shieldingToAdd;
	}

	shieldingReset(): void
	{
		this._shielding = null;
	}

	speedThroughLink(ship: Ship): number
	{
		if (this._speedThroughLink == null)
		{
			this._speedThroughLink = 0;

			var starlaneDrivesAsDevices = this.devicesStarlaneDrives();

			var uwpe = UniverseWorldPlaceEntities.create().entitySet(ship);

			for (var i = 0; i < starlaneDrivesAsDevices.length; i++)
			{
				var starlaneDrive = starlaneDrivesAsDevices[i];
				starlaneDrive.updateForRound(uwpe);
			}

			var shipFaction = ship.factionable().faction();
			var shipFactionDefn = shipFaction.defn();

			this._speedThroughLink
				*= shipFactionDefn.starlaneTravelSpeedMultiplier;
		}

		return this._speedThroughLink;
	}

	speedThroughLinkAdd(speedToAdd: number): void
	{
		this._speedThroughLink += speedToAdd;
	}

	speedThroughLinkReset(): void
	{
		this._speedThroughLink = null;
	}

	updateForRound(uwpe: UniverseWorldPlaceEntities): void
	{
		this.reset();

		var devices = this.devices();

		for (var i = 0; i < devices.length; i++)
		{
			var device = devices[i];
			uwpe.entity2Set(device.toEntity() );
			device.updateForRound(uwpe);
		}

		this.energyRemainingThisRoundReset(uwpe);
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

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.energyRemainingThisRound(uwpe); // Do the calculations, but ignore the result for now.
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable.

	equals(other: DeviceUser): boolean
	{
		return false; // todo
	}
}
