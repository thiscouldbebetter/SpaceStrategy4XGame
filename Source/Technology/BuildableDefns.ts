
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
				VisualText.fromTextImmediateHeightAndColor
				(
					labelText, fontHeight, colors.White
				)
			]);
		};

		var effects = BuildableEffect.Instances();
		var effectNone = effects.None;
		var effectTodo = effects.ThrowError;

		var facilityOrbital = (name: string, visual: VisualBase, industryToBuildAmount: number) =>
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
				null // entityModifyOnBuild
			);

		var facilitySurfaceUsable =
		(
			name: string, visual: VisualBase, industryToBuildAmount: number, effectPerRound: BuildableEffect
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
				null // entityModifyOnBuild
			);

		var facilitySurfaceAnywhere = (name: string, visual: VisualBase, industryToBuildAmount: number) =>
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
				null // entityModifyOnBuild
			);

		var planetwideFocus = (name: string, visual: VisualBase) =>
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
				null // entityModifyOnBuild
			);

		var shipComponent = (name: string, visual: VisualBase, industryToBuildAmount: number) =>
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
				null // entityModifyOnBuild
			);

		this.OrbitalCloak = facilityOrbital
		(
			"Orbital Cloak",
			visualBuild("C", colors.Gray),
			120
		);

		this.OrbitalDocks = facilityOrbital
		(
			"Orbital Docks",
			visualBuild("D", colors.Gray),
			120
		);

		this.OrbitalShield = facilityOrbital
		(
			"Orbital Shield",
			visualBuild("S", colors.Red),
			60
		);

		this.OrbitalShieldAdvanced = facilityOrbital
		(
			"Orbital Shield, Advanced",
			visualBuild("S", colors.Blue),
			120
		);

		this.OrbitalWeaponBasic = facilityOrbital
		(
			"Orbital Weapon, Basic",
			visualBuild("W", colors.Gray),
			60
		);

		this.OrbitalWeaponIntermediate = facilityOrbital
		(
			"Orbital Weapon, Intermediate",
			visualBuild("W", colors.Red),
			120
		);

		this.OrbitalWeaponAdvanced = facilityOrbital
		(
			"Orbital Weapon, Advanced",
			visualBuild("W", colors.Green),
			240
		);

		this.PlanetwideFocusDiplomacy = planetwideFocus
		(
			"Planetwide Diplomacy Focus",
			visualBuild("Focus", colors.Orange)
		);

		this.PlanetwideFocusResearch = planetwideFocus
		(
			"Planetwide Research Focus",
			visualBuild("Focus", colors.Blue)
		);

		this.ShipDriveBasic = shipComponent
		(
			"Ship Drive, Basic",
			visualBuild("Drive", colors.Gray),
			30
		);

		this.ShipDriveIntermediate = shipComponent
		(
			"Ship Drive, Intermediate",
			visualBuild("Drive", colors.Red),
			60
		);

		this.ShipDriveAdvanced = shipComponent
		(
			"Ship Drive, Advanced",
			visualBuild("Drive", colors.Green),
			120
		);

		this.ShipDriveSupreme = shipComponent
		(
			"Ship Drive, Supreme",
			visualBuild("Drive", colors.Red),
			240
		);

		this.ShipGeneratorBasic = shipComponent
		(
			"Ship Generator, Basic",
			visualBuild("Generator", colors.Gray),
			30
		);

		this.ShipGeneratorIntermediate = shipComponent
		(
			"Ship Generator, Intermediate",
			visualBuild("Generator", colors.Red),
			60
		);

		this.ShipGeneratorAdvanced = shipComponent
		(
			"Ship Generator, Advanced",
			visualBuild("Generator", colors.Green),
			120
		);

		this.ShipGeneratorSupreme = shipComponent
		(
			"Ship Generator, Supreme",
			visualBuild("Generator", colors.Blue),
			240
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
			null // entityModifyOnBuild
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
			null // entityModifyOnBuild
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
			null // entityModifyOnBuild
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
			null // entityModifyOnBuild
		);

		this.ShipItemCloak = shipComponent
		(
			"Cloak",
			visualBuild("Cloak", colors.Gray),
			100
		);

		this.ShipItemColonyBuilder = shipComponent
		(
			"Colony Builder",
			visualBuild("Col", colors.Gray),
			100
		);

		this.ShipItemDropShip = shipComponent
		(
			"Drop Ship",
			visualBuild("Drop Ship", colors.Gray),
			100
		);

		this.ShipSensorsBasic = shipComponent
		(
			"Ship Sensors, Basic",
			visualBuild("Sensors", colors.Gray),
			30
		);

		this.ShipSensorsIntermediate = shipComponent
		(
			"Ship Sensors, Intermediate",
			visualBuild("Sensors", colors.Red),
			60
		);

		this.ShipSensorsAdvanced = shipComponent
		(
			"Ship Sensors, Advanced",
			visualBuild("Sensors", colors.Green),
			120
		);

		this.ShipSensorsSupreme = shipComponent
		(
			"Ship Sensors, Supreme",
			visualBuild("Sensors", colors.Blue),
			240
		);

		this.ShipShieldBasic = shipComponent
		(
			"Ship Shield, Basic",
			visualBuild("Shield", colors.Gray),
			30
		);

		this.ShipShieldIntermediate = shipComponent
		(
			"Ship Shield, Intermediate",
			visualBuild("Shield", colors.Red),
			60
		);

		this.ShipShieldAdvanced = shipComponent
		(
			"Ship Shield, Advanced",
			visualBuild("Shield", colors.Green),
			120
		);

		this.ShipShieldSupreme = shipComponent
		(
			"Ship Shield, Supreme",
			visualBuild("Shield", colors.Blue),
			240
		);

		this.ShipWeaponBasic = shipComponent
		(
			"Ship Weapon, Basic",
			visualBuild("Weapon", colors.Gray),
			30
		);

		this.ShipWeaponIntermediate = shipComponent
		(
			"Ship Weapon, Intermediate",
			visualBuild("Weapon", colors.Red),
			60
		);

		this.ShipWeaponAdvanced = shipComponent
		(
			"Ship Weapon, Advanced",
			visualBuild("Weapon", colors.Green),
			120
		);

		this.ShipWeaponSupreme = shipComponent
		(
			"Ship Weapon, Supreme",
			visualBuild("Weapon", colors.Blue),
			240
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
			// entityModifyOnBuild
			(uwpe: UniverseWorldPlaceEntities) =>
				uwpe.entity.propertyAdd(new Shipyard() )
		);

		this.SurfaceCloak = facilitySurfaceUsable
		(
			"Surface Cloak",
			visualBuild("Cloak", colors.Gray),
			120,
			effectNone
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
			null // entityModifyOnBuild
		);

		this.SurfaceFactory = facilitySurfaceUsable
		(
			"Factory",
			visualBuild("Factory", colors.Red),
			30,
			effectTodo // [ new Resource("Industry", 1) ] // resourcesPerTurn
		);

		this.SurfaceFactoryAdvanced = facilitySurfaceUsable
		(
			"Factory, Advanced",
			visualBuild("Factory2", colors.Pink),
			60,
			effectTodo // [ new Resource("Industry", 2) ] // resourcesPerTurn
		);

		this.SurfaceFactoryMultiplier = facilitySurfaceUsable
		(
			"Factory Multiplier",
			visualBuild("FacX", colors.Pink),
			120,
			effectTodo // resourcesPerTurn
		);

		this.SurfaceLaboratory = facilitySurfaceUsable
		(
			"Laboratory",
			visualBuild("Lab", colors.Blue),
			30,
			effectNone // [ new Resource("Research", 1) ] // resourcesPerTurn
		);

		this.SurfaceLaboratoryAdvanced = facilitySurfaceUsable
		(
			"Laboratory, Advanced",
			visualBuild("L", colors.BlueLight),
			60,
			effectNone // [ new Resource("Research", 2) ] // resourcesPerTurn
		);

		this.SurfaceLaboratoryMultiplier = facilitySurfaceUsable
		(
			"Laboratory Multiplier",
			visualBuild("LM", colors.Pink),
			120,
			effectNone
		);

		this.SurfacePlantation = facilitySurfaceUsable
		(
			"Plantation",
			visualBuild("Plant", colors.Green),
			30,
			effectTodo // [ new Resource("Prosperity", 1) ] // resourcesPerTurn
		);

		this.SurfacePlantationAdvanced = facilitySurfaceUsable
		(
			"Plantation, Advanced",
			visualBuild("Plant2", colors.GreenLight),
			60,
			effectTodo // [ new Resource("Prosperity", 2) ] // resourcesPerTurn
		);

		this.SurfaceShield = facilitySurfaceUsable
		(
			"Surface Shield",
			visualBuild("Shield", colors.Red),
			30,
			null // resourcesPerTurn
		);

		this.SurfaceShieldAdvanced = facilitySurfaceUsable
		(
			"Surface Shield, Advanced",
			visualBuild("Shield2", colors.Blue),
			60,
			null // resourcesPerTurn
		);

		this.SurfaceTransportTubes = facilitySurfaceAnywhere
		(
			"Transport Tubes",
			visualBuild("Transp", colors.Red),
			15
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

			this.SurfacePlantation,
			this.SurfacePlantationAdvanced,

			this.SurfaceShield,
			this.SurfaceShieldAdvanced,

			this.SurfaceTransportTubes
		];
	}
}

