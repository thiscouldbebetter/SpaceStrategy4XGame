
class BuildableDefnsBasic
{
	OrbitalCloak: BuildableDefn;
	OrbitalDocks: BuildableDefn;
	OrbitalShield: BuildableDefn;
	OrbitalShieldAdvanced: BuildableDefn;
	OrbitalWeaponBasic: BuildableDefn;
	OrbitalWeaponIntermediate: BuildableDefn;
	OrbitalWeaponAdvanced: BuildableDefn;

	PlanetwideFocusDiplomacy: BuildableDefn;
	PlanetwideFocusResearch: BuildableDefn;

	ShipDriveBasic: BuildableDefn;
	ShipDriveIntermediate: BuildableDefn;
	ShipDriveAdvanced: BuildableDefn;
	ShipDriveSupreme: BuildableDefn;

	ShipGeneratorBasic: BuildableDefn;
	ShipGeneratorIntermediate: BuildableDefn;
	ShipGeneratorAdvanced: BuildableDefn;
	ShipGeneratorSupreme: BuildableDefn;

	ShipHullEnormous: BuildableDefn;
	ShipHullLarge: BuildableDefn;
	ShipHullMedium: BuildableDefn;
	ShipHullSmall: BuildableDefn;

	ShipItemCloak: BuildableDefn;
	ShipItemColonyBuilder: BuildableDefn;
	ShipItemDropShip: BuildableDefn;

	ShipSensorsBasic: BuildableDefn;
	ShipSensorsIntermediate: BuildableDefn;
	ShipSensorsAdvanced: BuildableDefn;
	ShipSensorsSupreme: BuildableDefn;

	ShipShieldBasic: BuildableDefn;
	ShipShieldIntermediate: BuildableDefn;
	ShipShieldAdvanced: BuildableDefn;
	ShipShieldSupreme: BuildableDefn;

	ShipWeaponBasic: BuildableDefn;
	ShipWeaponIntermediate: BuildableDefn;
	ShipWeaponAdvanced: BuildableDefn;
	ShipWeaponSupreme: BuildableDefn;

	Shipyard: BuildableDefn;

	SurfaceCloak: BuildableDefn;
	SurfaceColonyHub: BuildableDefn;
	SurfaceFactory: BuildableDefn;
	SurfaceFactoryAdvanced: BuildableDefn;
	SurfaceFactoryMultiplier: BuildableDefn;
	SurfaceLaboratory: BuildableDefn;
	SurfaceLaboratoryAdvanced: BuildableDefn;
	SurfaceLaboratoryMultiplier: BuildableDefn;
	SurfaceOutpost: BuildableDefn;
	SurfacePlantation: BuildableDefn;
	SurfacePlantationAdvanced: BuildableDefn;
	SurfaceShield: BuildableDefn;
	SurfaceShieldAdvanced: BuildableDefn;
	SurfaceTransportTubes: BuildableDefn;

	_All: BuildableDefn[];

	constructor(mapCellSizeInPixels: Coords)
	{
		var fontHeight = mapCellSizeInPixels.y / 2;

		var canBeBuiltNever = (m: MapLayout, p: Coords) => false;

		var terrains = MapTerrain.Instances(mapCellSizeInPixels);

		var terrainNamesOrbital = [ terrains.Orbit.name ];
		var canBeBuiltInOrbit =
			(m: MapLayout, p: Coords) =>
				terrainNamesOrbital.indexOf(m.terrainAtPosInCells(p).name) >= 0;

		var terrainNamesSurface = terrains._Surface.map(x => x.name);
		var canBeBuiltOnSurfaceAnywhere =
			(m: MapLayout, p: Coords) =>
				terrainNamesSurface.indexOf(m.terrainAtPosInCells(p).name) >= 0;

		var terrainNamesSurfaceUsable =
			terrainNamesSurface.filter(x => x != terrains.SurfaceUnusable.name);
		var canBeBuiltOnSurfaceUsable =
			(m: MapLayout, p: Coords) =>
				terrainNamesSurfaceUsable.indexOf(m.terrainAtPosInCells(p).name) >= 0;

		var colors = Color.Instances();

		var visualBuild = (labelText: string, color: Color) =>
		{
			return new VisualGroup
			([
				new VisualRectangle
				(
					mapCellSizeInPixels, color, null, null
				),
				VisualText.fromTextImmediateFontAndColor
				(
					labelText,
					FontNameAndHeight.fromHeightInPixels(fontHeight),
					colors.White
				)
			]);
		};

		var effects = BuildableEffect.Instances();
		var effectNone = effects.None;
		var effectTodo = effects.ThrowError;

		var facilityOrbital =
		(
			name: string,
			visual: VisualBase,
			industryToBuildAmount: number,
			description: string
		) =>
			new BuildableDefn
			(
				name,
				false, // isItem
				canBeBuiltInOrbit,
				mapCellSizeInPixels,
				visual,
				industryToBuildAmount,
				effectTodo, // effectPerRound
				null, // // effectsAvailableToUse
				null, // categories
				null, // entityProperties
				null, // entityModifyOnBuild
				description
			);

		var facilitySurfaceUsable =
		(
			name: string,
			visual: VisualBase,
			industryToBuildAmount: number,
			effectPerRound: BuildableEffect,
			description: string
		) =>
			new BuildableDefn
			(
				name,
				false, // isItem
				canBeBuiltOnSurfaceUsable,
				mapCellSizeInPixels,
				visual,
				industryToBuildAmount,
				effectPerRound,
				null, // effectsAvailableToUse
				null, // categories
				null, // entityProperties
				null, // entityModifyOnBuild
				description
			);

		var facilitySurfaceAnywhere =
		(
			name: string,
			visual: VisualBase,
			industryToBuildAmount: number,
			description: string
		) =>
			new BuildableDefn
			(
				name,
				false, // isItem
				canBeBuiltOnSurfaceAnywhere,
				mapCellSizeInPixels,
				visual,
				industryToBuildAmount,
				effectTodo,
				null, // // effectsAvailableToUse
				null, // categories
				null, // entityProperties
				null, // entityModifyOnBuild
				description
			);

		var planetwideFocus =
		(
			name: string,
			visual: VisualBase,
			description: string
		) =>
			new BuildableDefn
			(
				name,
				null, // isItem
				null, // terrainNames,
				mapCellSizeInPixels,
				visual,
				null, // industryToBuildAmount,
				effectTodo, // effectPerRound
				null, // // effectsAvailableToUse
				null, // categories
				null, // entityProperties
				null, // entityModifyOnBuild
				description
			);

		var shipComponent =
		(
			name: string,
			visual: VisualBase,
			industryToBuildAmount: number,
			deviceDefn: DeviceDefn,
			description: string
		) =>
			new BuildableDefn
			(
				name,
				true, // isItem
				canBeBuiltNever,
				mapCellSizeInPixels,
				visual,
				industryToBuildAmount,
				effectTodo, // effectPerRound
				null, // // effectsAvailableToUse
				null, // categories
				null, // entityProperties
				// entityModifyOnBuild
				(uwpe: UniverseWorldPlaceEntities) =>
				{
					if (deviceDefn != null)
					{
						var device = new Device2(deviceDefn);
						uwpe.entity.propertyAdd(device);
					}
				},
				description
			);

		this.OrbitalCloak = facilityOrbital
		(
			"Orbital Cloak",
			visualBuild("C", colors.Gray),
			120,
			"Hides orbital structures from sensors."
		);

		this.OrbitalDocks = facilityOrbital
		(
			"Orbital Docks",
			visualBuild("D", colors.Gray),
			120,
			"Allows ships to be repaired and refitted."
		);

		this.OrbitalShield = facilityOrbital
		(
			"Orbital Shield",
			visualBuild("S", colors.Red),
			60,
			"Protects orbital structures and excludes others' ships from orbit."
		);

		this.OrbitalShieldAdvanced = facilityOrbital
		(
			"Orbital Shield, Advanced",
			visualBuild("S", colors.Blue),
			120,
			"A stronger version of the orbital shield."
		);

		this.OrbitalWeaponBasic = facilityOrbital
		(
			"Orbital Weapon, Basic",
			visualBuild("W", colors.Gray),
			60,
			"Allows planet to attack ships in the starystem."
		);

		this.OrbitalWeaponIntermediate = facilityOrbital
		(
			"Orbital Weapon, Intermediate",
			visualBuild("W", colors.Red),
			120,
			"A more powerful orbital weapon."
		);

		this.OrbitalWeaponAdvanced = facilityOrbital
		(
			"Orbital Weapon, Advanced",
			visualBuild("W", colors.Green),
			240,
			"An even more powerful orbital weapon."
		);

		this.PlanetwideFocusDiplomacy = planetwideFocus
		(
			"Planetwide Diplomacy Focus",
			visualBuild("Focus", colors.Orange),
			"Planet's industry is directed toward improving diplomatic relations."
		);

		this.PlanetwideFocusResearch = planetwideFocus
		(
			"Planetwide Research Focus",
			visualBuild("Focus", colors.Blue),
			"Planet's industry is redirected to research."
		);

		this.ShipDriveBasic = shipComponent
		(
			"Ship Drive, Basic",
			visualBuild("Drive", colors.Gray),
			30,
			null, // deviceDefn
			"Consumes power to allow a ship to move."
		);

		this.ShipDriveIntermediate = shipComponent
		(
			"Ship Drive, Intermediate",
			visualBuild("Drive", colors.Red),
			60,
			null, // deviceDefn
			"A more powerful ship drive."
		);

		this.ShipDriveAdvanced = shipComponent
		(
			"Ship Drive, Advanced",
			visualBuild("Drive", colors.Green),
			120,
			null, // deviceDefn
			"A still more powerful ship drive."
		);

		this.ShipDriveSupreme = shipComponent
		(
			"Ship Drive, Supreme",
			visualBuild("Drive", colors.Red),
			240,
			null, // deviceDefn
			"The most powerful ship drive."
		);

		this.ShipGeneratorBasic = shipComponent
		(
			"Ship Generator, Basic",
			visualBuild("Generator", colors.Gray),
			30,
			null, // deviceDefn
			"Generates energy to power other components."
		);

		this.ShipGeneratorIntermediate = shipComponent
		(
			"Ship Generator, Intermediate",
			visualBuild("Generator", colors.Red),
			60,
			null, // deviceDefn
			"A more powerful ship generator."
		);

		this.ShipGeneratorAdvanced = shipComponent
		(
			"Ship Generator, Advanced",
			visualBuild("Generator", colors.Green),
			120,
			null, // deviceDefn
			"A still more powerful ship generator."
		);

		this.ShipGeneratorSupreme = shipComponent
		(
			"Ship Generator, Supreme",
			visualBuild("Generator", colors.Blue),
			240,
			null, // deviceDefn
			"The most powerful ship generator."
		);

		this.ShipHullEnormous = new BuildableDefn
		(
			"Ship Hull, Enormous",
			false, // isItem
			canBeBuiltNever,
			mapCellSizeInPixels,
			visualBuild("Hull", colors.Blue),
			240,
			null, // effectPerRound
			null, // effectsAvailableToUse
			null, // categories
			null, // entityProperties
			null, // entityModifyOnBuild
			"The largest ship hull."
		);

		this.ShipHullLarge = new BuildableDefn
		(
			"Ship Hull, Large",
			false, // isItem
			canBeBuiltNever,
			mapCellSizeInPixels,
			visualBuild("Hull", colors.Green),
			120,
			null, // effect
			null, // effectsAvailableToUse
			null, // categories
			null, // entityProperties
			null, // entityModifyOnBuild
			"A still larger ship hull."
		);

		this.ShipHullMedium = new BuildableDefn
		(
			"Ship Hull, Medium",
			false, // isItem
			canBeBuiltNever,
			mapCellSizeInPixels,
			visualBuild("Hull", colors.Red),
			60,
			null, // effect
			null, // effectsAvailableToUse
			null, // categories
			null, // entityProperties
			null, // entityModifyOnBuild
			"A larger ship hull."
		);

		this.ShipHullSmall = new BuildableDefn
		(
			"Ship Hull, Small",
			false, // isItem
			canBeBuiltNever,
			mapCellSizeInPixels,
			visualBuild("Hull", colors.Gray),
			30,
			null, // effectPerRound
			null, // effectsAvailableToUse
			null, // categories
			null, // entityProperties
			null, // entityModifyOnBuild
			"A small ship hull."
		);

		this.ShipItemCloak = shipComponent
		(
			"Cloak",
			visualBuild("Cloak", colors.Gray),
			100,
			null, // deviceDefn
			"Conceals ship components from sensors."
		);

		this.ShipItemColonyBuilder = shipComponent
		(
			"Colony Builder",
			visualBuild("Col", colors.Gray),
			100,
			null, // deviceDefn
			"Creates a new colony on an uninhabited planet."
		);

		this.ShipItemDropShip = shipComponent
		(
			"Drop Ship",
			visualBuild("Drop Ship", colors.Gray),
			100,
			null, // deviceDefn
			"Allows invasion and takeover of hostile colonies."
		);

		this.ShipSensorsBasic = shipComponent
		(
			"Ship Sensors, Basic",
			visualBuild("Sensors", colors.Gray),
			30,
			null, // deviceDefn
			"A short-range ship sensor."
		);

		this.ShipSensorsIntermediate = shipComponent
		(
			"Ship Sensors, Intermediate",
			visualBuild("Sensors", colors.Red),
			60,
			null, // deviceDefn
			"A ship sensor with longer range."
		);

		this.ShipSensorsAdvanced = shipComponent
		(
			"Ship Sensors, Advanced",
			visualBuild("Sensors", colors.Green),
			120,
			null, // deviceDefn
			"A ship sensor with still longer range."
		);

		this.ShipSensorsSupreme = shipComponent
		(
			"Ship Sensors, Supreme",
			visualBuild("Sensors", colors.Blue),
			240,
			null, // deviceDefn
			"The ship sensor with the longest range."
		);

		this.ShipShieldBasic = shipComponent
		(
			"Ship Shield, Basic",
			visualBuild("Shield", colors.Gray),
			30,
			null, // deviceDefn
			"When active, consumes power to protect the host ship from attack."
		);

		this.ShipShieldIntermediate = shipComponent
		(
			"Ship Shield, Intermediate",
			visualBuild("Shield", colors.Red),
			60,
			null, // deviceDefn
			"A stronger ship shield."
		);

		this.ShipShieldAdvanced = shipComponent
		(
			"Ship Shield, Advanced",
			visualBuild("Shield", colors.Green),
			120,
			null, // deviceDefn
			"A still stronger ship shield."
		);

		this.ShipShieldSupreme = shipComponent
		(
			"Ship Shield, Supreme",
			visualBuild("Shield", colors.Blue),
			240,
			null, // deviceDefn
			"The strongest ship shield."
		);

		this.ShipWeaponBasic = shipComponent
		(
			"Ship Weapon, Basic",
			visualBuild("Weapon", colors.Gray),
			30,
			null, // deviceDefn
			"Allows a ship to attack other ships and orbital structures."
		);

		this.ShipWeaponIntermediate = shipComponent
		(
			"Ship Weapon, Intermediate",
			visualBuild("Weapon", colors.Red),
			60,
			null, // deviceDefn
			"A more powerful ship weapon."
		);

		this.ShipWeaponAdvanced = shipComponent
		(
			"Ship Weapon, Advanced",
			visualBuild("Weapon", colors.Green),
			120,
			null, // deviceDefn
			"A still more powerful ship weapon."
		);

		this.ShipWeaponSupreme = shipComponent
		(
			"Ship Weapon, Supreme",
			visualBuild("Weapon", colors.Blue),
			240,
			null, // deviceDefn
			"The most powerful ship weapon."
		);

		this.Shipyard = new BuildableDefn
		(
			"Shipyard",
			false, // isItem
			canBeBuiltInOrbit,
			mapCellSizeInPixels,
			new VisualGroup
			([
				VisualRectangle.fromSizeAndColorFill
				(
					mapCellSizeInPixels, Color.byName("Orange")
				)
			]),
			100,
			effectNone,
			null, // effectsAvailableToUse
			null, // categories
			null, // entityProperties
			null, // entityModifyOnBuild
			"Allows new ships to be built."
		);

		this.SurfaceCloak = facilitySurfaceUsable
		(
			"Surface Cloak",
			visualBuild("Cloak", colors.Gray),
			120,
			effectNone,
			"Conceals surface structures from sensors."
		);

		this.SurfaceColonyHub = new BuildableDefn
		(
			"Colony Hub",
			false, // isItem
			canBeBuiltInOrbit,
			mapCellSizeInPixels,
			visualBuild("Hub", colors.Gray),
			30,
			effectTodo,
			null, // effectsAvailableToUse
			null, // categories
			null, // entityProperties
			null, // entityModifyOnBuild
			"Provides basic resources for a planetary colony."
		);

		this.SurfaceFactory = facilitySurfaceUsable
		(
			"Factory",
			visualBuild("Factory", colors.Red),
			30,
			effectTodo, // [ new Resource("Industry", 1) ] // resourcesPerTurn
			"Increases the host planet's industrial output."
		);

		this.SurfaceFactoryAdvanced = facilitySurfaceUsable
		(
			"Factory, Advanced",
			visualBuild("Factory2", colors.Pink),
			60,
			effectTodo, // [ new Resource("Industry", 2) ] // resourcesPerTurn
			"A more productive factory."
		);

		this.SurfaceFactoryMultiplier = facilitySurfaceUsable
		(
			"Factory Multiplier",
			visualBuild("FacX", colors.Pink),
			120,
			effectTodo, // resourcesPerTurn
			"Doubles the effect of all industry-producing structures."
		);

		this.SurfaceLaboratory = facilitySurfaceUsable
		(
			"Laboratory",
			visualBuild("Lab", colors.Blue),
			30,
			effectNone, // [ new Resource("Research", 1) ] // resourcesPerTurn
			"Increase the host planet's research output."
		);

		this.SurfaceLaboratoryAdvanced = facilitySurfaceUsable
		(
			"Laboratory, Advanced",
			visualBuild("L", colors.BlueLight),
			60,
			effectNone, // [ new Resource("Research", 2) ] // resourcesPerTurn
			"A more productive laboratory."
		);

		this.SurfaceLaboratoryMultiplier = facilitySurfaceUsable
		(
			"Laboratory Multiplier",
			visualBuild("LM", colors.Pink),
			120,
			effectNone,
			"Doubles the effect of all research-producing structures."
		);

		this.SurfaceOutpost = facilitySurfaceUsable
		(
			"Outpost",
			visualBuild("Outpost", colors.Pink),
			120,
			effectTodo,
			"Adds 1 to max population."
		);

		this.SurfacePlantation = facilitySurfaceUsable
		(
			"Plantation",
			visualBuild("Plant", colors.Green),
			30,
			effectTodo, // [ new Resource("Prosperity", 1) ] // resourcesPerTurn
			"Produces prosperity to speed population growth."
		);

		this.SurfacePlantationAdvanced = facilitySurfaceUsable
		(
			"Plantation, Advanced",
			visualBuild("Plant2", colors.GreenLight),
			60,
			effectTodo, // [ new Resource("Prosperity", 2) ] // resourcesPerTurn
			"A more productive plantation."
		);

		this.SurfaceShield = facilitySurfaceUsable
		(
			"Surface Shield",
			visualBuild("Shield", colors.Red),
			30,
			null, // resourcesPerTurn
			"Protects planet from enemy invasion and conquest."
		);

		this.SurfaceShieldAdvanced = facilitySurfaceUsable
		(
			"Surface Shield, Advanced",
			visualBuild("Shield2", colors.Blue),
			60,
			null, // resourcesPerTurn
			"A more powerful surface shield."
		);

		this.SurfaceTransportTubes = facilitySurfaceAnywhere
		(
			"Transport Tubes",
			visualBuild("Transp", colors.Red),
			15,
			"Allows traversal of otherwise unusable terrain."
		);

		this._All =
		[
			this.OrbitalCloak,
			this.OrbitalDocks,
			this.OrbitalShield,
			this.OrbitalShieldAdvanced,
			this.OrbitalWeaponBasic,
			this.OrbitalWeaponIntermediate,
			this.OrbitalWeaponAdvanced,

			this.PlanetwideFocusDiplomacy,
			this.PlanetwideFocusResearch,

			this.ShipDriveBasic,
			this.ShipDriveIntermediate,
			this.ShipDriveAdvanced,
			this.ShipDriveSupreme,

			this.ShipGeneratorBasic,
			this.ShipGeneratorIntermediate,
			this.ShipGeneratorAdvanced,
			this.ShipGeneratorSupreme,

			this.ShipHullEnormous,
			this.ShipHullLarge,
			this.ShipHullMedium,
			this.ShipHullSmall,

			this.ShipItemColonyBuilder,

			this.ShipSensorsBasic,
			this.ShipSensorsIntermediate,
			this.ShipSensorsAdvanced,
			this.ShipSensorsSupreme,

			this.ShipShieldBasic,
			this.ShipShieldIntermediate,
			this.ShipShieldAdvanced,
			this.ShipShieldSupreme,

			this.ShipWeaponBasic,
			this.ShipWeaponIntermediate,
			this.ShipWeaponAdvanced,
			this.ShipWeaponSupreme,

			this.Shipyard,

			this.SurfaceColonyHub,

			this.SurfaceFactory,
			this.SurfaceFactoryAdvanced,

			this.SurfaceLaboratory,
			this.SurfaceLaboratoryAdvanced,

			this.SurfaceOutpost,

			this.SurfacePlantation,
			this.SurfacePlantationAdvanced,

			this.SurfaceShield,
			this.SurfaceShieldAdvanced,

			this.SurfaceTransportTubes
		];
	}
}

