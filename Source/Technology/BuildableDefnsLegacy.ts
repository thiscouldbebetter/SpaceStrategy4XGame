
class BuildableDefnsLegacy
{
	static _instance: BuildableDefnsLegacy;
	static Instance(mapCellSizeInPixels: Coords): BuildableDefnsLegacy
	{
		if (BuildableDefnsLegacy._instance == null)
		{
			BuildableDefnsLegacy._instance = new BuildableDefnsLegacy(mapCellSizeInPixels);	
		}
		return BuildableDefnsLegacy._instance;
	}
	
	OrbitalCloaker: BuildableDefn;
	OrbitalDocks: BuildableDefn;
	OrbitalShield1OrbitalShield: BuildableDefn;
	OrbitalShield2OrbitalMegaShield: BuildableDefn;
	OrbitalShipyard: BuildableDefn;
	OrbitalWeapon1OrbitalMissileBase: BuildableDefn;
	OrbitalWeapon2ShortRangeOrbitalWhopper: BuildableDefn;
	OrbitalWeapon3LongRangeOrbitalWhopper: BuildableDefn;
	PlanetwideFocusAlienHospitality: BuildableDefn;
	PlanetwideFocusEndlessParty: BuildableDefn;
	PlanetwideFocusScientistTakeover: BuildableDefn;
	PlanetwideLushGrowthBomb: BuildableDefn;
	ShipDrive1TonklinMotor: BuildableDefn;
	ShipDrive2IonBanger: BuildableDefn;
	ShipDrive3GravitonProjector: BuildableDefn;
	ShipDrive4InertiaNegator: BuildableDefn;
	ShipDrive5NanowaveSpaceBender: BuildableDefn;
	ShipGenerator1ProtonShaver
	ShipGenerator2SubatomicScoop: BuildableDefn;
	ShipGenerator3QuarkExpress: BuildableDefn;
	ShipGenerator4VanKreegHypersplicer: BuildableDefn;
	ShipGenerator5Nanotwirler: BuildableDefn;
	ShipHull1Small: BuildableDefn;
	ShipHull2Medium: BuildableDefn;
	ShipHull3Large: BuildableDefn;
	ShipHull4Enormous: BuildableDefn;
	ShipItemAccutron: BuildableDefn;
	ShipItemBackfirer: BuildableDefn;
	ShipItemBrunswikDissipator: BuildableDefn;
	ShipItemCannibalizer: BuildableDefn;
	ShipItemCloaker: BuildableDefn;
	ShipItemColonizer: BuildableDefn;
	ShipItemContainmentDevice: BuildableDefn;
	ShipItemDisarmer: BuildableDefn;
	ShipItemDisintegrator: BuildableDefn;
	ShipItemFleetDisperser: BuildableDefn;
	ShipItemGizmogrifier: BuildableDefn;
	ShipItemGravimetricCatapult: BuildableDefn;
	ShipItemGravimetricCondensor: BuildableDefn;
	ShipItemGravityDistorter: BuildableDefn;
	ShipItemGyroInductor: BuildableDefn;
	ShipItemHyperfuel: BuildableDefn;
	ShipItemHyperswapper: BuildableDefn;
	ShipItemIntellectScrambler: BuildableDefn;
	ShipItemInvasionModule: BuildableDefn;
	ShipItemInvulnerablizer: BuildableDefn;
	ShipItemLaneBlocker: BuildableDefn;
	ShipItemLaneDestabilizer: BuildableDefn;
	ShipItemLaneEndoscope: BuildableDefn;
	ShipItemLaneMagnetron: BuildableDefn;
	ShipItemMassCondensor: BuildableDefn;
	ShipItemMolecularTieDown: BuildableDefn;
	ShipItemMovingPartExploiter: BuildableDefn;
	ShipItemMyrmidonicCarbonizer: BuildableDefn;
	ShipItemPhaseBomb: BuildableDefn;
	ShipItemPlasmaCoupler: BuildableDefn;
	ShipItemPositronBouncer: BuildableDefn;
	ShipItemRecaller: BuildableDefn;
	ShipItemRemoteRepairFacility: BuildableDefn;
	ShipItemReplenisher: BuildableDefn;
	ShipItemSacrificialOrb: BuildableDefn;
	ShipItemSelfDestructotron: BuildableDefn;
	ShipItemShieldBlaster: BuildableDefn;
	ShipItemSmartBomb: BuildableDefn;
	ShipItemSpecialtyBlaster: BuildableDefn;
	ShipItemToroidalBlaster: BuildableDefn;
	ShipItemTractorBeam: BuildableDefn;
	ShipItemXRayMegaglasses: BuildableDefn;
	ShipSensor1TonklinFrequencyAnalyzer: BuildableDefn;
	ShipSensor2SubspacePhaseArray: BuildableDefn;
	ShipSensor3AuralCloudConstrictor: BuildableDefn;
	ShipSensor4HyperwaveTympanum: BuildableDefn;
	ShipSensor5MurgatroydsKnower: BuildableDefn;
	ShipSensor6NanowaveDecouplingNet: BuildableDefn;
	ShipShield1IonWrap: BuildableDefn;
	ShipShield2ConcussionShield: BuildableDefn;
	ShipShield3WaveScatterer: BuildableDefn;
	ShipShield4Deactotron: BuildableDefn;
	ShipShield5HyperwaveNullifier: BuildableDefn;
	ShipShield6Nanoshell: BuildableDefn;
	ShipStarlaneDrive1StarLaneDrive: BuildableDefn;
	ShipStarlaneDrive2StarLaneHyperdrive: BuildableDefn;
	ShipWeapon01MassBarrageGun: BuildableDefn;
	ShipWeapon02FourierMissiles: BuildableDefn;
	ShipWeapon03QuantumSingularityLauncher: BuildableDefn;
	ShipWeapon04MolecularDisassociator: BuildableDefn;
	ShipWeapon05ElectromagneticPulser: BuildableDefn;
	ShipWeapon06Plasmatron: BuildableDefn;
	ShipWeapon07Ueberlaser: BuildableDefn;
	ShipWeapon08FergnatzLens: BuildableDefn;
	ShipWeapon09HypersphereDriver: BuildableDefn;
	ShipWeapon10Nanomanipulator: BuildableDefn;
	SurfaceArtificialHypdroponifer: BuildableDefn;
	SurfaceAutomation: BuildableDefn;
	SurfaceCloaker: BuildableDefn;
	SurfaceCloningPlant: BuildableDefn;
	SurfaceEngineeringRetreat: BuildableDefn;
	SurfaceFertilizationPlant: BuildableDefn;
	SurfaceHabitat: BuildableDefn;
	SurfaceHyperpowerPlant: BuildableDefn;
	SurfaceIndustrialMegafacility: BuildableDefn;
	SurfaceInternet: BuildableDefn;
	SurfaceLogicFactory: BuildableDefn;
	SurfaceMetroplex: BuildableDefn;
	SurfaceObservationInstallation: BuildableDefn;
	SurfacePlanetaryTractorBeam: BuildableDefn;
	SurfaceResearchCampus: BuildableDefn;
	SurfaceShield1SurfaceShield: BuildableDefn;
	SurfaceShield2SurfaceMegaShield: BuildableDefn;
	SurfaceTerraforming: BuildableDefn;
	SurfaceXenoArchaeologicalDig: BuildableDefn;

	SurfaceAgriplot: BuildableDefn;
	SurfaceColonyHub: BuildableDefn;
	SurfaceFactory: BuildableDefn;
	SurfaceLaboratory: BuildableDefn;
	SurfaceTransportTubes: BuildableDefn;

	_All: BuildableDefn[];

	private constructor(mapCellSizeInPixels: Coords)
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

		var effectResourcesAdd = (resourcesToAdd: Resource[]) =>
		{
			var effect = new BuildableEffect
			(
				"ResourcesAdd",
				0, // order
				(uwpe: UniverseWorldPlaceEntities) =>
				{
					var planet = (uwpe.place as PlanetAsPlace).planet;
					planet.resourcesPerTurnAdd(resourcesToAdd);
				}
			);
			return effect;
		}

		var facilityOrbital = (name: string, visual: VisualBase, industryToBuildAmount: number) =>
			new BuildableDefn
			(
				name,
				false, // isItem
				canBeBuiltInOrbit,
				mapCellSizeInPixels,
				visual,
				industryToBuildAmount,
				effectNone,
				null, // effectsAvailableToUse
				null, // categories
				null // entityModifyOnBuild
			);

		var facilitySurfaceUsable = (name: string, visual: VisualBase, industryToBuildAmount: number, effect: BuildableEffect) =>
			new BuildableDefn
			(
				name,
				false, // isItem
				canBeBuiltOnSurfaceUsable,
				mapCellSizeInPixels,
				visual,
				industryToBuildAmount,
				effect,
				null, // effectsAvailableToUse
				null, // categories
				null // entityModifyOnBuild
			);

		var facilitySurfaceAnywhere = (name: string, visual: VisualBase, industryToBuildAmount: number, effect: BuildableEffect) =>
			new BuildableDefn
			(
				name,
				false, // isItem
				canBeBuiltOnSurfaceAnywhere,
				mapCellSizeInPixels,
				visual,
				industryToBuildAmount,
				effect,
				null, // effectsAvailableToUse
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
				effectTodo,
				null, // effectsAvailableToUse
				null, // categories
				null // entityModifyOnBuild
			);

		var shipComponent =
		(
			name: string,
			visual: VisualBase,
			industryToBuildAmount: number,
			category: BuildableCategory,
			deviceDefn: DeviceDefn
		) =>
			new BuildableDefn
			(
				name,
				true, // isItem
				canBeBuiltNever,
				mapCellSizeInPixels,
				visual,
				industryToBuildAmount,
				effectTodo,
				null, // effectsAvailableToUse
				[ category ],
				// entityModifyOnBuild
				(uwpe: UniverseWorldPlaceEntities) =>
				{
					if (deviceDefn != null)
					{
						var device = new Device(deviceDefn);
						uwpe.entity.propertyAdd(device);
					}
				}
			);

		// Planet - Orbit.

		this.OrbitalCloaker = facilityOrbital
		(
			"Orbital Cloak",
			visualBuild("C", colors.Gray),
			40
		);

		this.OrbitalDocks = facilityOrbital
		(
			"Orbital Docks",
			visualBuild("D", colors.Gray),
			170
		);

		this.OrbitalShield1OrbitalShield = facilityOrbital
		(
			"Orbital Shield",
			visualBuild("S", colors.Red),
			60
		);

		this.OrbitalShield2OrbitalMegaShield = facilityOrbital
		(
			"Orbital Mega Shield",
			visualBuild("S", colors.Blue),
			120
		);

		var buildShip = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var universe = uwpe.universe;
			var displaySize = universe.display.sizeInPixels;

			var venueLayout = universe.venuePrev() as VenueLayout;
			var planet = venueLayout.modelParent as Planet;

			var dialogSize = universe.display.sizeInPixels.clone().half();

			var buildableEntityInProgress =
				planet.buildableEntityInProgress(universe);

			var cannotBuildAcknowledge =
				() => universe.venuePrevJumpTo();

			if (buildableEntityInProgress != null)
			{
				universe.venueJumpTo
				(
					VenueMessage.fromTextAcknowledgeAndSize
					(
						"Already building something.",
						cannotBuildAcknowledge,
						dialogSize
					)
				);
			}
			else if (planet.populationIdle(universe) == 0)
			{
				universe.venueJumpTo
				(
					VenueMessage.fromTextAcknowledgeAndSize
					(
						"No free population yet.",
						cannotBuildAcknowledge,
						dialogSize
					)
				);
			}
			else if (planet.cellPositionsAvailableToOccupyInOrbit(universe).length == 0)
			{
				universe.venueJumpTo
				(
					VenueMessage.fromTextAcknowledgeAndSize
					(
						"No free cells in orbit.",
						cannotBuildAcknowledge,
						dialogSize
					)
				);
			}
			else
			{
				var shipBuilder = new ShipBuilder();
				universe.venueCurrentRemove();
				var shipBuilderAsControl =
					shipBuilder.toControl(universe, displaySize, universe.venueCurrent() );
				var shipBuilderAsVenue = shipBuilderAsControl.toVenue();
				universe.venueTransitionTo(shipBuilderAsVenue);
			}
		};

		var effectBuildShip = new BuildableEffect
		(
			"Build Ship",
			0, // orderToApplyIn
			(uwpe: UniverseWorldPlaceEntities) => buildShip(uwpe)
		);

		this.OrbitalShipyard = new BuildableDefn
		(
			"Shipyard",
			false, // isItem
			canBeBuiltInOrbit,
			mapCellSizeInPixels,
			visualBuild("Shipyard", colors.Blue),
			120, // industryToBuild
			effectNone, // effectPerRound
			[ effectBuildShip ], // effectsAvailableToUse
			null, // categories
			null // entityModifyOnBuild
		);

		this.OrbitalWeapon1OrbitalMissileBase = facilityOrbital
		(
			"Orbital Missile Base",
			visualBuild("Missile Base", colors.Gray),
			60
		);

		this.OrbitalWeapon2ShortRangeOrbitalWhopper = facilityOrbital
		(
			"Short-Range Orbital Whopper",
			visualBuild("Short-Range Whopper", colors.Red),
			90
		);

		this.OrbitalWeapon3LongRangeOrbitalWhopper = facilityOrbital
		(
			"Long-Range Orbital Whopper",
			visualBuild("Long-Range Whopper", colors.Green),
			180
		);

		// Planetwide.

		this.PlanetwideFocusAlienHospitality = planetwideFocus
		(
			"Alien Hospitality",
			visualBuild("Focus", colors.Orange)
		);

		this.PlanetwideFocusEndlessParty = planetwideFocus
		(
			"Endless Party",
			visualBuild("Focus", colors.Green)
		);

		this.PlanetwideFocusScientistTakeover = planetwideFocus
		(
			"Scientist Takeover",
			visualBuild("Focus", colors.Blue)
		);

		this.PlanetwideLushGrowthBomb = planetwideFocus
		(
			"Lush Growth Bomb",
			visualBuild("Focus", colors.Violet) // todo - 200
		);

		// Ships.

		var categories = BuildableCategory.Instances();

		// Drives.
		
		var categoryShipDrive = categories.ShipDrive;

		var deviceDefnDrive = new DeviceDefn
		(
			"Drive",
			false, // isActive
			false, // needsTarget
			[ "Drive" ], // categoryNames
			(uwpe: UniverseWorldPlaceEntities) => // init
			{},
			(uwpe: UniverseWorldPlaceEntities) => // updateForRound
			{
				var ship = uwpe.entity as Ship;
				var shipTurnTaker = ship.turnTaker();
				shipTurnTaker.distancePerMove += 50;
				shipTurnTaker.energyPerMove += 1;
			},
			(uwpe: UniverseWorldPlaceEntities) => // use
			{
				var ship = uwpe.entity as Ship;
				var shipTurnTaker = ship.turnTaker();
				shipTurnTaker.energyForMoveDeduct();
			}
		);
		
		this.ShipDrive1TonklinMotor = shipComponent
		(
			"Tonklin Motor",
			visualBuild("Drive", colors.Gray),
			10,
			categoryShipDrive,
			deviceDefnDrive
		);

		this.ShipDrive2IonBanger = shipComponent
		(
			"Ion Banger",
			visualBuild("Drive", colors.Red),
			30,
			categoryShipDrive,
			null // deviceDefn
		);

		this.ShipDrive3GravitonProjector = shipComponent
		(
			"Graviton Projector",
			visualBuild("Drive", colors.Green),
			40,
			categoryShipDrive,
			null // deviceDefn
		);

		this.ShipDrive4InertiaNegator = shipComponent
		(
			"Inertia Negator",
			visualBuild("Drive", colors.Red),
			20,
			categoryShipDrive,
			null // deviceDefn
		);

		this.ShipDrive5NanowaveSpaceBender = shipComponent
		(
			"Inertia Negator",
			visualBuild("Drive", colors.Red),
			80,
			categoryShipDrive,
			null // deviceDefn
		);

		// Generators.

		var categoryShipGenerator = categories.ShipGenerator;

		this.ShipGenerator1ProtonShaver = shipComponent
		(
			"Proton Shaver",
			visualBuild("Generator", colors.Gray),
			20,
			categoryShipGenerator,
			null // deviceDefn
		);

		this.ShipGenerator2SubatomicScoop = shipComponent
		(
			"Subatomic Scoop",
			visualBuild("Generator", colors.Red),
			35,
			categoryShipGenerator,
			null // deviceDefn
		);

		this.ShipGenerator3QuarkExpress = shipComponent
		(
			"Quark Express",
			visualBuild("Generator", colors.Green),
			60,
			categoryShipGenerator,
			null // deviceDefn
		);

		this.ShipGenerator4VanKreegHypersplicer = shipComponent
		(
			"Van Kreeg Hypersplicer",
			visualBuild("Generator", colors.Blue),
			80,
			categoryShipGenerator,
			null // deviceDefn
		);

		this.ShipGenerator5Nanotwirler = shipComponent
		(
			"Nanotwirler",
			visualBuild("Generator", colors.Violet),
			100,
			categoryShipGenerator,
			null // deviceDefn
		);

		// Hulls.

		this.ShipHull1Small = new BuildableDefn
		(
			"Small Ship Hull",
			false, // isItem
			canBeBuiltNever,
			mapCellSizeInPixels,
			visualBuild("Hull", colors.Gray),
			30,
			effectNone,
			null, // effectsAvailableToUse
			null, // categories
			null // entityModifyOnBuild
		);

		this.ShipHull2Medium = new BuildableDefn
		(
			"Medium Ship Hull",
			false, // isItem
			canBeBuiltNever,
			mapCellSizeInPixels,
			visualBuild("Hull", colors.Red),
			60,
			effectNone,
			null, // effectsAvailableToUse
			null, // categories
			null // entityModifyOnBuild
		);

		this.ShipHull3Large = new BuildableDefn
		(
			"Large Ship Hull",
			false, // isItem
			canBeBuiltNever,
			mapCellSizeInPixels,
			visualBuild("Hull", colors.Green),
			120,
			effectNone,
			null, // effectsAvailableToUse
			null, // categories
			null // entityModifyOnBuild
		);

		this.ShipHull4Enormous = new BuildableDefn
		(
			"Enormous Ship Hull",
			false, // isItem
			canBeBuiltNever,
			mapCellSizeInPixels,
			visualBuild("Hull", colors.Blue),
			240,
			effectNone,
			null, // effectsAvailableToUse
			null, // categories
			null // entityModifyOnBuild
		);

		// Items.

		var sc = (name: string, industry: number) =>
			shipComponent(name, visualBuild(name, colors.Gray), industry, categories.ShipItem, null);

		this.ShipItemAccutron 				= sc("Accutron", 				60);
		this.ShipItemBackfirer 				= sc("Backfirer", 				60);
		this.ShipItemBrunswikDissipator 	= sc("Brunswik Dissipator", 	100);
		this.ShipItemCannibalizer 			= sc("Cannibalizer", 			20);
		this.ShipItemCloaker 				= sc("Cloaker", 				30);
		this.ShipItemColonizer 				= sc("Colonizer", 				35);
		this.ShipItemContainmentDevice 		= sc("Containment Device", 		15);
		this.ShipItemDisarmer 				= sc("Disarmer", 				30);
		this.ShipItemDisintegrator 			= sc("Disintegrator", 			150);
		this.ShipItemFleetDisperser 		= sc("Fleet Disperser", 		30);
		this.ShipItemGizmogrifier 			= sc("Gizmogrifier", 			30);
		this.ShipItemGravimetricCatapult 	= sc("Gravimetric Catapult", 	16);
		this.ShipItemGravimetricCondensor 	= sc("Gravimetric Condensor",	30);
		this.ShipItemGravityDistorter 		= sc("Gravity Distorter", 		20);
		this.ShipItemGyroInductor 			= sc("Gyro-Inductor", 			20);
		this.ShipItemHyperfuel 				= sc("Hyperfuel", 				20);
		this.ShipItemHyperswapper 			= sc("Hyperswapper", 			20);
		this.ShipItemIntellectScrambler 	= sc("Intellect Scrambler", 	20);
		this.ShipItemInvasionModule 		= sc("Invasion Module", 		70);
		this.ShipItemInvulnerablizer 		= sc("Invulnerablizer", 		60);
		this.ShipItemLaneBlocker 			= sc("Lane Blocker", 			30);
		this.ShipItemLaneDestabilizer 		= sc("Lane Destabilizer", 		40);
		this.ShipItemLaneEndoscope 			= sc("Lane Endoscope", 			20);
		this.ShipItemLaneMagnetron 			= sc("Lane Magnetron", 			50);
		this.ShipItemMassCondensor 			= sc("Mass Condensor", 			50);
		this.ShipItemMolecularTieDown 		= sc("Molecular Tie Down", 		20);
		this.ShipItemMovingPartExploiter 	= sc("Moving Part Exploiter", 	60);
		this.ShipItemMyrmidonicCarbonizer 	= sc("Myrmidonic Carbonizer", 	70);
		this.ShipItemPhaseBomb 				= sc("PhaseBomb", 				40);
		this.ShipItemPlasmaCoupler 			= sc("Plasma Coupler", 			20);
		this.ShipItemPositronBouncer 		= sc("Positron Bouncer", 		10);
		this.ShipItemRecaller 				= sc("Recaller", 				40);
		this.ShipItemRemoteRepairFacility 	= sc("Remote Repair Facility", 	70);
		this.ShipItemReplenisher 			= sc("Replenisher", 			60);
		this.ShipItemSacrificialOrb 		= sc("Sacrificial Orb", 		20);
		this.ShipItemSelfDestructotron 		= sc("Self-Destructotron", 		50);
		this.ShipItemShieldBlaster 			= sc("Shield Blaster", 			30);
		this.ShipItemSmartBomb 				= sc("Smart Bomb", 				30);
		this.ShipItemSpecialtyBlaster 		= sc("Specialty Blaster", 		30);
		this.ShipItemToroidalBlaster 		= sc("Toroidal Blaster", 		20);
		this.ShipItemTractorBeam 			= sc("Tractor Beam", 			30);
		this.ShipItemXRayMegaglasses 		= sc("X-Ray Megaglasses", 		100);

		// Sensors.

		var categoryShipSensor = categories.ShipSensor;

		this.ShipSensor1TonklinFrequencyAnalyzer 		= shipComponent("Tonklin Frequency Analyzer", 	visualBuild("Sensors1", colors.Gray), 20, categoryShipSensor, null);
		this.ShipSensor2SubspacePhaseArray 				= shipComponent("Subspace Phase Array", 		visualBuild("Sensors2", colors.Gray), 40, categoryShipSensor, null);
		this.ShipSensor3AuralCloudConstrictor 			= shipComponent("Aural Cloud Constrictor", 		visualBuild("Sensors3", colors.Gray), 60, categoryShipSensor, null);
		this.ShipSensor4HyperwaveTympanum 				= shipComponent("Hyperwave Tympanum", 			visualBuild("Sensors4", colors.Gray), 80, categoryShipSensor, null);
		this.ShipSensor5MurgatroydsKnower 				= shipComponent("Murgatroyd's Knower", 			visualBuild("Sensors5", colors.Gray), 100, categoryShipSensor, null);
		this.ShipSensor6NanowaveDecouplingNet 			= shipComponent("Nanowave Decoupling Net", 		visualBuild("Sensors6", colors.Gray), 200, categoryShipSensor, null);

		// Shields.

		var categoryShipShield = categories.ShipShield;

		this.ShipShield1IonWrap 						= shipComponent("Ion Wrap", 					visualBuild("Shield1", colors.Gray), 10, categoryShipShield, null);
		this.ShipShield2ConcussionShield 				= shipComponent("Concussion Shield", 			visualBuild("Shield2", colors.Gray), 30, categoryShipShield, null);
		this.ShipShield3WaveScatterer 					= shipComponent("Wave Scatterer", 				visualBuild("Shield3", colors.Gray), 50, categoryShipShield, null);
		this.ShipShield4Deactotron 						= shipComponent("Deactotron", 					visualBuild("Shield4", colors.Gray), 50, categoryShipShield, null);
		this.ShipShield5HyperwaveNullifier 				= shipComponent("Hyperwave Nullifier", 			visualBuild("Shield5", colors.Gray), 100, categoryShipShield, null);
		this.ShipShield6Nanoshell 						= shipComponent("Nanoshell", 					visualBuild("Shield6", colors.Gray), 200, categoryShipShield, null);

		// Starlane Drives.
		
		var categoryShipStarlaneDrive = categories.ShipStarlaneDrive;

		this.ShipStarlaneDrive1StarLaneDrive 			= shipComponent("Star Lane Drive", 				visualBuild("StarDrive", colors.Gray), 30, categoryShipStarlaneDrive, null);
		this.ShipStarlaneDrive2StarLaneHyperdrive 		= shipComponent("Star Lane Hyperdrive", 		visualBuild("StarDrive2", colors.Gray), 30, categoryShipStarlaneDrive, null);

		// Weapons.

		var categoryShipWeapon = categories.ShipWeapon;

		this.ShipWeapon01MassBarrageGun 				= shipComponent("Mass Barrage Gun", 				visualBuild("Weapon", colors.Gray), 10, categoryShipWeapon, null);
		this.ShipWeapon02FourierMissiles 				= shipComponent("Fourier Missiles", 				visualBuild("Weapon", colors.Gray), 20, categoryShipWeapon, null);
		this.ShipWeapon03QuantumSingularityLauncher 	= shipComponent("Quantum Singularity Launcher", 	visualBuild("Weapon", colors.Gray), 30, categoryShipWeapon, null);
		this.ShipWeapon04MolecularDisassociator 		= shipComponent("Molecular Disassociator", 			visualBuild("Weapon", colors.Gray), 40, categoryShipWeapon, null);
		this.ShipWeapon05ElectromagneticPulser 			= shipComponent("Electromagnetic Pulser", 			visualBuild("Weapon", colors.Gray), 50, categoryShipWeapon, null);
		this.ShipWeapon06Plasmatron 					= shipComponent("Plasmatron", 						visualBuild("Weapon", colors.Gray), 50, categoryShipWeapon, null);
		this.ShipWeapon07Ueberlaser 					= shipComponent("Ueberlaser", 						visualBuild("Weapon", colors.Gray), 70, categoryShipWeapon, null);
		this.ShipWeapon08FergnatzLens 					= shipComponent("Fergnatz Lens", 					visualBuild("Weapon", colors.Gray), 50, categoryShipWeapon, null);
		this.ShipWeapon09HypersphereDriver 				= shipComponent("Hypersphere Driver", 				visualBuild("Weapon", colors.Gray), 100, categoryShipWeapon, null);
		this.ShipWeapon10Nanomanipulator 				= shipComponent("Nanomanipulator", 					visualBuild("Weapon", colors.Gray), 100, categoryShipWeapon, null);

		// Surface.

		this.SurfaceArtificialHypdroponifer 	= facilitySurfaceUsable("Artificial Hydroponifier", visualBuild("Artificial Hydroponifier", colors.Gray), 	100, null);
		this.SurfaceAutomation 					= facilitySurfaceUsable("Automation", 				visualBuild("todo", colors.Gray), 						9999, null);
		this.SurfaceCloaker 					= facilitySurfaceUsable("Surface Cloak", 			visualBuild("Cloak", colors.Gray), 						120, null);
		this.SurfaceCloningPlant 				= facilitySurfaceUsable("Cloning Plant", 			visualBuild("Cloning Plant", colors.Gray), 				250, null);
		this.SurfaceEngineeringRetreat 			= facilitySurfaceUsable("Engineering Retreat", 		visualBuild("Engineering Retreat", colors.Gray), 		80, null);
		this.SurfaceFertilizationPlant 			= facilitySurfaceUsable("Fertilization Plant", 		visualBuild("Fertilization Plant", colors.Gray), 		200, null);
		this.SurfaceHabitat 					= facilitySurfaceUsable("Habitat", 					visualBuild("Habitat", colors.Gray), 					160, null);
		this.SurfaceHyperpowerPlant 			= facilitySurfaceUsable("Hyperpower Plant", 		visualBuild("Hyperpower Plant", colors.Gray), 			200, null);
		this.SurfaceIndustrialMegafacility 		= facilitySurfaceUsable("Industrial Megafacility", 	visualBuild("Industrial Megafacility", colors.Gray), 	110, null);
		this.SurfaceInternet 					= facilitySurfaceUsable("Internet", 				visualBuild("Internet", colors.Gray), 					250, null);
		this.SurfaceLogicFactory 				= facilitySurfaceUsable("Logic Factory", 			visualBuild("Logic Factory", colors.Gray), 				80, null);
		this.SurfaceMetroplex 					= facilitySurfaceUsable("Metroplex", 				visualBuild("Metroplex", colors.Gray), 					200, null);
		this.SurfaceObservationInstallation 	= facilitySurfaceUsable("Observation Installation", visualBuild("Observation Installation", colors.Gray), 	40, null);
		this.SurfacePlanetaryTractorBeam 		= facilitySurfaceUsable("Tractor Beam", 			visualBuild("Tractor Beam", colors.Gray), 				50, null);
		this.SurfaceResearchCampus 				= facilitySurfaceUsable("Research Campus", 			visualBuild("Research Campus", colors.Gray), 			160, null);
		this.SurfaceShield1SurfaceShield 		= facilitySurfaceUsable("Surface Shield", 			visualBuild("Surface Shield", colors.Gray), 			100, null);
		this.SurfaceShield2SurfaceMegaShield 	= facilitySurfaceUsable("Surface Mega-Shield",		visualBuild("Surface Mega-Shield", colors.Gray), 		180, null);
		this.SurfaceTerraforming 				= facilitySurfaceUsable("Terraforming", 			visualBuild("Terraforming", colors.Gray), 				50, null);

		this.SurfaceXenoArchaeologicalDig = new BuildableDefn
		(
			"Xeno Archaeological Dig",
			false, // isItem
			(m: MapLayout, p: Coords) =>
			{
				//var cellAtPos = m.cellAtPosInCells(p);
				return false; // todo - Build only on ruins.
			},
			mapCellSizeInPixels,
			visualBuild("Xeno Archaeological Dig", colors.Gray),
			50,
			effectNone,
			null, // effectsAvailableToUse
			null, // categories
			null // entityModifyOnBuild
		);


		// Default tech.

		this.SurfaceAgriplot = facilitySurfaceUsable
		(
			"Agriplot",
			visualBuild("Agriplot", colors.GreenDark),
			30,
			effectResourcesAdd( [ new Resource("Prosperity", 1) ] )
		);

		this.SurfaceColonyHub = new BuildableDefn
		(
			"Colony Hub",
			false, // isItem
			canBeBuiltNever,
			mapCellSizeInPixels,
			visualBuild("Hub", colors.Gray),
			30,
			effectResourcesAdd( [ new Resource("Industry", 1), new Resource("Prosperity", 1) ] ),
			null, // effectsAvailableToUse
			null, // categories
			null // entityModifyOnBuild
		);

		this.SurfaceFactory = facilitySurfaceUsable
		(
			"Factory",
			visualBuild("Factory", colors.Red),
			30,
			effectResourcesAdd( [ new Resource("Industry", 1) ] )
		);

		this.SurfaceLaboratory = facilitySurfaceUsable
		(
			"Laboratory",
			visualBuild("Laboratory", colors.Blue),
			50,
			effectResourcesAdd( [ new Resource("Research", 1) ] )
		);

		this.SurfaceTransportTubes = facilitySurfaceAnywhere
		(
			"Transport Tubes",
			visualBuild("Transport", colors.GrayDark),
			10,
			effectNone
		);

		this._All =
		[
			this.OrbitalCloaker,
			this.OrbitalDocks,
			this.OrbitalShield1OrbitalShield,
			this.OrbitalShield2OrbitalMegaShield,
			this.OrbitalShipyard,
			this.OrbitalWeapon1OrbitalMissileBase,
			this.OrbitalWeapon2ShortRangeOrbitalWhopper,
			this.OrbitalWeapon3LongRangeOrbitalWhopper,
			this.PlanetwideFocusAlienHospitality,
			this.PlanetwideFocusEndlessParty,
			this.PlanetwideFocusScientistTakeover,
			this.PlanetwideLushGrowthBomb,
			this.ShipDrive1TonklinMotor,
			this.ShipDrive2IonBanger,
			this.ShipDrive3GravitonProjector,
			this.ShipDrive4InertiaNegator,
			this.ShipDrive5NanowaveSpaceBender,
			this.ShipGenerator1ProtonShaver,
			this.ShipGenerator2SubatomicScoop,
			this.ShipGenerator3QuarkExpress,
			this.ShipGenerator4VanKreegHypersplicer,
			this.ShipGenerator5Nanotwirler,
			this.ShipHull1Small,
			this.ShipHull2Medium,
			this.ShipHull3Large,
			this.ShipHull4Enormous,
			this.ShipItemAccutron,
			this.ShipItemBackfirer,
			this.ShipItemBrunswikDissipator,
			this.ShipItemCannibalizer,
			this.ShipItemCloaker,
			this.ShipItemColonizer,
			this.ShipItemContainmentDevice,
			this.ShipItemDisarmer,
			this.ShipItemDisintegrator,
			this.ShipItemFleetDisperser,
			this.ShipItemGizmogrifier,
			this.ShipItemGravimetricCatapult,
			this.ShipItemGravimetricCondensor,
			this.ShipItemGravityDistorter,
			this.ShipItemGyroInductor,
			this.ShipItemHyperfuel,
			this.ShipItemHyperswapper,
			this.ShipItemIntellectScrambler,
			this.ShipItemInvasionModule,
			this.ShipItemInvulnerablizer,
			this.ShipItemLaneBlocker,
			this.ShipItemLaneDestabilizer,
			this.ShipItemLaneEndoscope,
			this.ShipItemLaneMagnetron,
			this.ShipItemMassCondensor,
			this.ShipItemMolecularTieDown,
			this.ShipItemMovingPartExploiter,
			this.ShipItemMyrmidonicCarbonizer,
			this.ShipItemPhaseBomb,
			this.ShipItemPlasmaCoupler,
			this.ShipItemPositronBouncer,
			this.ShipItemRecaller,
			this.ShipItemRemoteRepairFacility,
			this.ShipItemReplenisher,
			this.ShipItemSacrificialOrb,
			this.ShipItemSelfDestructotron,
			this.ShipItemShieldBlaster,
			this.ShipItemSmartBomb,
			this.ShipItemSpecialtyBlaster,
			this.ShipItemToroidalBlaster,
			this.ShipItemTractorBeam,
			this.ShipItemXRayMegaglasses,
			this.ShipSensor1TonklinFrequencyAnalyzer,
			this.ShipSensor2SubspacePhaseArray,
			this.ShipSensor3AuralCloudConstrictor,
			this.ShipSensor4HyperwaveTympanum,
			this.ShipSensor5MurgatroydsKnower,
			this.ShipSensor6NanowaveDecouplingNet,
			this.ShipShield1IonWrap,
			this.ShipShield2ConcussionShield,
			this.ShipShield3WaveScatterer,
			this.ShipShield4Deactotron,
			this.ShipShield5HyperwaveNullifier,
			this.ShipShield6Nanoshell,
			this.ShipStarlaneDrive1StarLaneDrive,
			this.ShipStarlaneDrive2StarLaneHyperdrive,
			this.ShipWeapon01MassBarrageGun,
			this.ShipWeapon02FourierMissiles,
			this.ShipWeapon03QuantumSingularityLauncher,
			this.ShipWeapon04MolecularDisassociator,
			this.ShipWeapon05ElectromagneticPulser,
			this.ShipWeapon06Plasmatron,
			this.ShipWeapon07Ueberlaser,
			this.ShipWeapon08FergnatzLens,
			this.ShipWeapon09HypersphereDriver,
			this.ShipWeapon10Nanomanipulator,
			this.SurfaceArtificialHypdroponifer,
			this.SurfaceAutomation,
			this.SurfaceCloaker,
			this.SurfaceCloningPlant,
			this.SurfaceEngineeringRetreat,
			this.SurfaceFertilizationPlant,
			this.SurfaceHabitat,
			this.SurfaceHyperpowerPlant,
			this.SurfaceIndustrialMegafacility,
			this.SurfaceInternet,
			this.SurfaceLogicFactory,
			this.SurfaceMetroplex,
			this.SurfaceObservationInstallation,
			this.SurfacePlanetaryTractorBeam,
			this.SurfaceResearchCampus,
			this.SurfaceShield1SurfaceShield,
			this.SurfaceShield2SurfaceMegaShield,
			this.SurfaceTerraforming,
			this.SurfaceXenoArchaeologicalDig,

			this.SurfaceAgriplot,
			this.SurfaceColonyHub,
			this.SurfaceFactory,
			this.SurfaceLaboratory,
			this.SurfaceTransportTubes

		];
	}
}

