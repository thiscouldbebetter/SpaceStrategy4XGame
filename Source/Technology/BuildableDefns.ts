

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

		var terrains = MapTerrain.Instances(mapCellSizeInPixels);

		var terrainNamesOrbital = [ terrains.Orbit.name ];
		var terrainNamesShip = [ terrains.Ship.name ];
		var terrainNamesSurface = terrains._Surface.map(x => x.name);
		var terrainNamesSurfaceUsable =
			terrainNamesSurface.filter(x => x != terrains.SurfaceUnusable.name);

		var colors = Color.Instances();

		var visualBuild = (labelText: string, color: Color) =>
		{
			return new VisualGroup
			([
				new VisualRectangle
				(
					mapCellSizeInPixels, color, null, null
				),
				VisualText.fromTextHeightAndColor
				(
					labelText, fontHeight, colors.White
				)
			]);
		};

		var facilityOrbital = (name: string, visual: VisualBase, industryToBuildAmount: number) =>
			new BuildableDefn
			(
				name,
				false, // isItem
				terrainNamesOrbital,
				mapCellSizeInPixels,
				visual,
				industryToBuildAmount,
				null, // resourcesProducedPerTurn
				null // entityModifyOnBuild
			);

		var facilitySurfaceUsable = (name: string, visual: VisualBase, industryToBuildAmount: number, resourcesProducedPerTurn: Resource[]) =>
			new BuildableDefn
			(
				name,
				false, // isItem
				terrainNamesSurfaceUsable,
				mapCellSizeInPixels,
				visual,
				industryToBuildAmount,
				resourcesProducedPerTurn,
				null // entityModifyOnBuild
			);

		var facilitySurfaceAnywhere = (name: string, visual: VisualBase, industryToBuildAmount: number) =>
			new BuildableDefn
			(
				name,
				false, // isItem
				terrainNamesSurface,
				mapCellSizeInPixels,
				visual,
				industryToBuildAmount,
				null, // resourcesProducedPerTurn,
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
				null, // resourcesProducedPerTurn,
				null // entityModifyOnBuild
			);

		var shipComponent = (name: string, visual: VisualBase, industryToBuildAmount: number) =>
			new BuildableDefn
			(
				name,
				true, // isItem
				terrainNamesShip,
				mapCellSizeInPixels,
				visual,
				industryToBuildAmount,
				null, // resourcesProducedPerTurn
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
			true, // isItem // Is it, though?
			terrainNamesOrbital,
			mapCellSizeInPixels,
			visualBuild("Hull", colors.Blue),
			240,
			[], // resourcesPerTurn
			null // entityModifyOnBuild
		);

		this.ShipHullLarge = new BuildableDefn
		(
			"Ship Hull, Large",
			true, // isItem // Is it, though?
			terrainNamesOrbital,
			mapCellSizeInPixels,
			visualBuild("Hull", colors.Green),
			120,
			[], // resourcesPerTurn
			null // entityModifyOnBuild
		);

		this.ShipHullMedium = new BuildableDefn
		(
			"Ship Hull, Medium",
			true, // isItem // Is it, though?
			terrainNamesOrbital,
			mapCellSizeInPixels,
			visualBuild("Hull", colors.Red),
			60,
			[], // resourcesPerTurn
			null // entityModifyOnBuild
		);

		this.ShipHullSmall = new BuildableDefn
		(
			"Ship Hull, Small",
			true, // isItem // Is it, though?
			terrainNamesOrbital,
			mapCellSizeInPixels,
			visualBuild("Hull", colors.Gray),
			30,
			[], // resourcesPerTurn
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
			terrainNamesOrbital,
			mapCellSizeInPixels,
			new VisualGroup
			([
				VisualRectangle.fromSizeAndColorFill
				(
					mapCellSizeInPixels, Color.byName("Orange")
				)
			]),
			100,
			[], // resourcesPerTurn
			// entityModifyOnBuild
			(entity: Entity) =>
				entity.propertyAdd(new Shipyard() )
		);

		this.SurfaceCloak = facilitySurfaceUsable
		(
			"Surface Cloak",
			visualBuild("Cloak", colors.Gray),
			120,
			null // resourcesPerTurn
		);

		this.SurfaceColonyHub = facilitySurfaceUsable
		(
			"Colony Hub",
			visualBuild("H", colors.Gray),
			30,
			[ new Resource("Industry", 1), new Resource("Prosperity", 1) ] // resourcesPerTurn
		);

		this.SurfaceFactory = facilitySurfaceUsable
		(
			"Factory",
			visualBuild("F", colors.Red),
			30,
			[ new Resource("Industry", 1) ] // resourcesPerTurn
		);

		this.SurfaceFactoryAdvanced = facilitySurfaceUsable
		(
			"Factory, Advanced",
			visualBuild("F", colors.Pink),
			60,
			[ new Resource("Industry", 2) ] // resourcesPerTurn
		);

		this.SurfaceFactoryMultiplier = facilitySurfaceUsable
		(
			"Factory Multiplier",
			visualBuild("FM", colors.Pink),
			120,
			null // resourcesPerTurn
		);

		this.SurfaceLaboratory = facilitySurfaceUsable
		(
			"Laboratory",
			visualBuild("L", colors.Blue),
			30,
			[ new Resource("Research", 1) ] // resourcesPerTurn
		);

		this.SurfaceLaboratoryAdvanced = facilitySurfaceUsable
		(
			"Laboratory, Advanced",
			visualBuild("L", colors.BlueLight),
			30,
			[ new Resource("Research", 2) ] // resourcesPerTurn
		);

		this.SurfaceLaboratoryMultiplier = facilitySurfaceUsable
		(
			"Laboratory Multiplier",
			visualBuild("LM", colors.Pink),
			120,
			null // resourcesPerTurn
		);

		this.SurfacePlantation = facilitySurfaceUsable
		(
			"Plantation",
			visualBuild("P", colors.Green),
			30,
			[ new Resource("Prosperity", 1) ] // resourcesPerTurn
		);

		this.SurfacePlantationAdvanced = facilitySurfaceUsable
		(
			"Plantation, Advanced",
			visualBuild("P", colors.GreenLight),
			30,
			[ new Resource("Prosperity", 2) ] // resourcesPerTurn
		);

		this.SurfaceShield = facilitySurfaceUsable
		(
			"Surface Shield",
			visualBuild("S", colors.Red),
			30,
			null // resourcesPerTurn
		);

		this.SurfaceShieldAdvanced = facilitySurfaceUsable
		(
			"Surface Shield, Advanced",
			visualBuild("S", colors.Blue),
			60,
			null // resourcesPerTurn
		);

		this.SurfaceTransportTubes = facilitySurfaceAnywhere
		(
			"Transport Tubes",
			visualBuild("T", colors.Red),
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

