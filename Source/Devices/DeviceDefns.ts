
class DeviceDefns
{
	ColonyHub: DeviceDefn;
	ShipDriveBasic: DeviceDefn;
	ShipGeneratorBasic: DeviceDefn;
	ShipShieldBasic: DeviceDefn;
	ShipWeaponBasic: DeviceDefn;

	_All: DeviceDefn[];

	constructor()
	{
		var categories = BuildableCategory.Instances();

		this.ColonyHub = new DeviceDefn
		(
			"Colony Hub",
			false, // isActive
			false, // needsTarget
			[], // categoryNames
			(uwpe: UniverseWorldPlaceEntities) => // init
			{},
			(uwpe: UniverseWorldPlaceEntities) => // updateForRound
			{},
			1, // usesPerRound
			0, // energyPerUse
			(uwpe: UniverseWorldPlaceEntities) => // use
			{
				var ship = uwpe.entity as Ship;
				ship.planetColonize(uwpe.universe, uwpe.world as WorldExtended);
			}
		);

		this.ShipDriveBasic = new DeviceDefn
		(
			"Ship Drive, Basic",
			false, // isActive
			false, // needsTarget
			[ categories.ShipDrive ], // categories
			(uwpe: UniverseWorldPlaceEntities) => // init
			{},
			(uwpe: UniverseWorldPlaceEntities) => // updateForRound
			{
				// todo - var ship = uwpe.entity as Ship;
			},
			0, // usesPerRound
			1, // energyPerUse
			(uwpe: UniverseWorldPlaceEntities) => // use
			{
				// todo - var ship = uwpe.entity as Ship;
			}
		);

		this.ShipGeneratorBasic = new DeviceDefn
		(
			"Ship Generator, Basic",
			false, // isActive
			false, // needsTarget
			[ categories.ShipGenerator ], // categories
			(uwpe: UniverseWorldPlaceEntities) =>  // init
			{},
			(uwpe: UniverseWorldPlaceEntities) =>  // updateForRound
			{
				// todo - var ship = uwpe.entity as Ship;
			},
			0, // usesPerRound
			1, // energyPerUse
			(uwpe: UniverseWorldPlaceEntities) =>  // use
			{
				// Do nothing.
			}
		);

		this.ShipShieldBasic = new DeviceDefn
		(
			"Ship Shield, Basic",
			true, // isActive
			false, // needsTarget
			[ categories.ShipShield ], // categories
			(uwpe: UniverseWorldPlaceEntities) =>  // intialize
			{
				var device = Device.ofEntity(uwpe.entity2);
				device.isActive = false;
			},
			(uwpe: UniverseWorldPlaceEntities) =>  // updateForRound
			{
				// todo
			},
			0, // usesPerRound
			1, // energyPerUse
			(uwpe: UniverseWorldPlaceEntities) => // use
			{
				// todo
			}
		);

		this.ShipWeaponBasic = this.shipWeaponBasic();

		this._All =
		[
			this.ColonyHub,
			this.ShipDriveBasic,
			this.ShipGeneratorBasic,
			this.ShipShieldBasic,
			this.ShipWeaponBasic,
		];
	}

	private static _instance: DeviceDefns;
	static Instance(): DeviceDefns
	{
		if (DeviceDefns._instance == null)
		{
			DeviceDefns._instance = new DeviceDefns();
		}

		return DeviceDefns._instance;
	}

	shipWeaponBasic(): DeviceDefn
	{
		var categories = BuildableCategory.Instances();

		return new DeviceDefn
		(
			"Ship Weapon, Basic",
			true, // isActive
			true, // needsTarget
			[ categories.ShipWeapon ], // categories
			(uwpe: UniverseWorldPlaceEntities) =>  // initialize
			{
				// todo
			},
			(uwpe: UniverseWorldPlaceEntities) =>  // updateForRound
			{
				// todo
				//var device = Device.ofEntity(uwpe.entity2);
				//device.usesThisTurn = 3;
			},
			1, // usesPerRound
			1, // energyPerUse
			this.shipWeaponBasicUse
		);
	}

	shipWeaponBasicUse(uwpe: UniverseWorldPlaceEntities)
	{
		/*
		var ship = uwpe.entity as Ship;
		var device = Device.ofEntity(uwpe.entity2);

		if (device.usesThisTurn > 0)
		{
			var target = device.targetEntity; // todo
			if (target == null)
			{
				var venue = uwpe.universe.venueCurrent() as VenueStarsystem;
				venue.cursor.entityAndOrderNameSet(ship, "UseDevice");
			}
			else // if (target != null)
			{
				device.usesThisTurn--;
				var targetKillable = target.killable();
				targetKillable.integrity -= 1;
				if (targetKillable.integrity <= 0)
				{
					alert("todo - ship destroyed");
				}
			}
		}
		*/
	}
}
