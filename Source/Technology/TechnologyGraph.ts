
class TechnologyGraph
{
	name: string;
	technologies: Technology[];

	technologiesByName: Map<string,Technology>;

	constructor(name: string, technologies: Technology[])
	{
		this.name = name;
		this.technologies = technologies;
		this.technologiesByName =
			ArrayHelper.addLookupsByName(this.technologies);
	}

	static demo(mapCellSizeInPixels: Coords, bds: BuildableDefnsBasic): TechnologyGraph
	{
		var t = (n: string, r: number, p: string[], buildableDefnsAllowed: BuildableDefn[]) =>
			new Technology(n, r, p, buildableDefnsAllowed.map(x => x.name));

		var returnValue = new TechnologyGraph
		(
			"All Technologies",
			// technologies
			[
				t
				(
					"Default",
					0, // research
					[], // prerequisites
					[
						bds.SurfaceFactory,
						bds.SurfaceLaboratory,
						bds.SurfaceOutpost,
						bds.SurfacePlantation,
						bds.SurfaceTransportTubes
					]
				),

				t("Biology, Basic", 					50, [ "Default" ], 													[ bds.ShipItemColonyBuilder ] ),
				t("Drives, Basic", 						50, [ "Default" ], 													[ bds.ShipDriveBasic ] ),
				t("Generators, Basic", 					50, [ "Default" ], 													[ bds.ShipGeneratorBasic ] ),
				t("Sensors, Basic", 					50, [ "Default" ], 													[ bds.ShipSensorsBasic ] ),
				t("Shields, Basic", 					50, [ "Default" ], 													[ bds.ShipShieldBasic ] ),
				t("Space Structures, Basic",			50, [ "Default" ], 													[ bds.Shipyard, bds.ShipHullSmall ] ),
				t("Weapons, Basic", 					50, [ "Default" ], 													[ bds.ShipWeaponBasic ] ),

				t("Biology, Intermediate", 				400, [ "Biology, Basic" ], 											[ bds.SurfacePlantationAdvanced ] ),
				t("Drives, Intermediate", 				400, [ "Drives, Basic" ], 											[ bds.ShipDriveIntermediate ] ),
				t("Generators, Intermediate", 			400, [ "Space Structures, Basic", "Generators, Basic" ],			[ bds.ShipGeneratorIntermediate ] ),
				t("Industry, Intermediate", 			400, [ "Generators, Basic" ], 										[ bds.SurfaceFactoryAdvanced ] ),
				t("Research, Intermediate", 			400, [ "Biology, Basic" ],											[ bds.SurfaceLaboratoryAdvanced ] ),
				t("Sensors, Intermediate", 				400, [ "Sensors, Basic" ], 											[ bds.ShipSensorsIntermediate ] ),
				t("Shields, Intermediate", 				400, [ "Space Structures, Basic", "Shields, Basic" ],	 			[ bds.OrbitalShield, bds.ShipShieldIntermediate, bds.SurfaceShield ] ),
				t("Space Structures, Intermediate", 	400, [ "Space Structures, Basic" ], 								[ bds.OrbitalDocks, bds.ShipHullMedium ] ),
				t("Weapons, Intermediate", 				400, [ "Space Structures, Basic", "Weapons, Basic" ], 				[ bds.ShipItemDropShip, bds.OrbitalWeaponBasic, bds.ShipWeaponIntermediate ] ),
				// t("Weapons, Nonlethal", 				400, [ "Space Structures, Basic", "Weapons, Basic" ], 				[ bds.OrbitalDisrupter, bds.ShipDisrupter ] ),

				t("Diplomatics, Advanced",				3200, [ "Biology, Intermediate" ], 									[ bds.PlanetwideFocusDiplomacy ] ),
				t("Drives, Advanced",					3200, [ "Drives, Intermediate" ], 									[ bds.ShipDriveAdvanced ] ),
				t("Generators, Advanced",				3200, [ "Generators, Intermediate", "Industry, Intermediate" ],		[ bds.ShipGeneratorAdvanced ] ),
				t("Research, Advanced",					3200, [ "Research, Intermediate" ],									[ bds.SurfaceLaboratoryMultiplier ] ),
				t("Sensors, Advanced",					3200, [ "Sensors, Intermediate" ], 									[ bds.ShipSensorsAdvanced ] ),
				t("Shields, Advanced",					3200, [ "Shields, Intermediate" ], 									[ bds.ShipShieldAdvanced ] ),
				t("Shields, Cloaking",					3200, [ "Shields, Intermediate" ], 									[ bds.OrbitalCloak, bds.ShipItemCloak, bds.SurfaceCloak ] ),
				t("Space Structures, Advanced",			3200, [ "Space Structures, Intermediate" ], 						[ bds.ShipHullMedium ] ),
				t("Weapons, Advanced",					3200, [ "Weapons, Intermediate", "Weapons, Nonlethal" ], 			[ bds.ShipWeaponAdvanced ] ),

				t("Drives, Supreme",					12800, [ "Drives, Advanced" ],										[ bds.ShipDriveSupreme ] ),
				t("Generators, Supreme",				12800, [ "Generators, Advanced" ],									[ bds.ShipGeneratorSupreme ] ),
				t("Research, Supreme",					12800, [ "Generators, Advanced" ],									[ bds.PlanetwideFocusResearch ] ),
				t("Sensors, Supreme",					12800, [ "Sensors, Advanced" ],										[ bds.ShipSensorsSupreme ] ),
				t("Shields, Supreme",					12800, [ "Shields, Advanced" ],										[ bds.ShipShieldSupreme ] ),
				t("Space Structures, Supreme", 			12800, [ "Space Structures, Advanced" ],							[ bds.ShipHullMedium ] ),
				t("Weapons, Supreme",					12800, [ "Weapons, Advanced" ], 									[ bds.ShipWeaponSupreme ] ),
			]
		);

		return returnValue;
	}

	static legacy(mapCellSizeInPixels: Coords, bds: BuildableDefnsLegacy): TechnologyGraph
	{
		// Technologies from the game _Ascendancy_.

		var t = (n: string, p: string[], r: number, a: BuildableDefn[]) =>
			new Technology(n, r, p, a.map(x => x.name) ); // Note different orders.

		var x = new TechnologyNamesLegacy();

		var returnValue = new TechnologyGraph
		(
			"All Technologies",
			// technologies
			[
t("Basic Technology", 				[], 														0, 			[ bds.SurfaceAgriplot, bds.SurfaceFactory, bds.SurfaceLaboratory, bds.SurfaceOutpost, bds.SurfaceTransportTubes] ),
t(x.OrbitalStructures,				[],															50,			[ bds.OrbitalShipyard, bds.OrbitalShield1OrbitalShield ] ),
t(x.InterplanetaryExploration,		[ x.OrbitalStructures ],									50,			[ bds.ShipHull1Small, bds.ShipHull2Medium, bds.ShipGenerator1ProtonShaver ] ),
t(x.TonklinDiary,					[],															50,			[ bds.ShipDrive1TonklinMotor, bds.ShipSensor1TonklinFrequencyAnalyzer ] ),
t(x.Xenobiology,					[],															90,			[ bds.SurfaceXenoArchaeologicalDig ] ),
t(x.EnvironmentalEncapsulation,		[ x.Xenobiology ],											50,			[ bds.ShipShield1IonWrap, bds.ShipItemColonizer ] ), // bds.SurfaceColonyHub
t(x.SpectralAnalysis,				[ x.TonklinDiary ],											120,		[ bds.ShipWeapon02FourierMissiles ] ),
t(x.Superconductivity,				[ x.TonklinDiary ],											100,		[ bds.SurfaceShield1SurfaceShield, bds.ShipWeapon01MassBarrageGun ] ),
t(x.SpacetimeSurfing,				[ x.TonklinDiary, x.InterplanetaryExploration ],			90,			[ bds.ShipStarlaneDrive1StarLaneDrive ] ),
t(x.AdvancedChemistry,				[ x.EnvironmentalEncapsulation ],							100,		[ bds.SurfaceArtificialHydroponifier, bds.ShipDrive2IonBanger ] ),
t(x.AdvancedInterferometry,			[ x.SpectralAnalysis ],										90,			[ bds.ShipSensor2SubspacePhaseArray, bds.ShipItemInvasionModule ] ),
t(x.Cloaking,						[ x.AdvancedInterferometry ],								1800,		[ bds.SurfaceCloaker, bds.OrbitalCloaker, bds.ShipItemCloaker ] ),
t(x.PowerConversion,				[ x.SpacetimeSurfing ],										100,		[ bds.OrbitalWeapon1OrbitalMissileBase, bds.ShipGenerator2SubatomicScoop ] ),
t(x.GravityControl,					[ x.SpacetimeSurfing ],										560,		[ bds.ShipWeapon03QuantumSingularityLauncher ] ),
t(x.Hyperlogic,						[ x.AdvancedInterferometry, x.Xenobiology ],				1120,		[ bds.SurfaceResearchCampus, bds.ShipItemIntellectScrambler, bds.ShipItemXRayMegaglasses ] ),
t(x.MomentumDeconservation,			[ x.SpacetimeSurfing ],										280,		[ bds.ShipShield2ConcussionShield ] ),
t(x.Diplomatics,					[ x.Hyperlogic ],											2000,		[ bds.SurfaceObservationInstallation, bds.PlanetwideFocusAlienHospitality ] ),
t(x.MolecularExplosives,			[ x.SpectralAnalysis, x.PowerConversion ],					720,		[ bds.ShipItemPhaseBomb, bds.ShipItemMassCondensor ] ),
t(x.StrongForceWeakening,			[ x.PowerConversion ],										980,		[ bds.ShipWeapon04MolecularDisassociator ] ),
t(x.LevelLogic,						[ x.Hyperlogic ],											3300,		[ bds.PlanetwideFocusScientistTakeover ] ),
t(x.LightBending,					[ x.GravityControl ],										2560,		[ bds.ShipShield3WaveScatterer, bds.ShipItemReplenisher ] ),
t(x.Gravimetrics,					[ x.GravityControl ],										1320,		[ bds.OrbitalDocks, bds.ShipItemMolecularTieDown ] ),
t(x.EMFieldCoupling,				[ x.LightBending ],											4200,		[ bds.ShipWeapon05ElectromagneticPulser, bds.ShipSensor3AuralCloudConstrictor ] ),
t(x.MassPhasing,					[ x.Gravimetrics ],											2200,		[ bds.ShipItemGravimetricCatapult ] ),
t(x.ThoughtAnalysis,				[ x.LevelLogic ],											7700,		[ bds.SurfaceEngineeringRetreat ] ),
t(x.AdvancedFunTechniques,			[ x.Diplomatics ],											5580,		[ bds.SurfaceLogicFactory, bds.PlanetwideFocusEndlessParty ] ),
t(x.PositronGuidance,				[ x.MolecularExplosives ],									2400,		[ bds.SurfaceIndustrialMegafacility, bds.ShipItemPositronBouncer ] ),
t(x.Subatomics,						[ x.PositronGuidance ],										3300,		[ bds.SurfaceHyperpowerPlant, bds.ShipGenerator3QuarkExpress ] ),
t(x.AdvancedExploration,			[ x.MassPhasing, x.Hyperlogic ],							4140,		[ bds.ShipStarlaneDrive2StarLaneHyperdrive, bds.ShipHull3Large ] ),
t(x.GravimetricCombustion,			[ x.Gravimetrics, x.PositronGuidance ],						2600,		[ bds.ShipDrive3GravitonProjector, bds.ShipItemToroidalBlaster ] ),
t(x.Plasmatics,						[ x.Subatomics ],											5700,		[ bds.ShipWeapon06Plasmatron, bds.ShipItemPlasmaCoupler ] ),
t(x.PlanetaryReplenishment,			[ x.GravimetricCombustion, x.EnvironmentalEncapsulation ],	2560,		[ bds.SurfaceHabitat, bds.SurfaceTerraforming ] ),
t(x.MomentumReflection,				[ x.Subatomics, x.MomentumDeconservation ],					4420,		[ bds.ShipItemGravityDistorter ] ),
t(x.LargeScaleConstruction,			[ x.GravimetricCombustion, x.AdvancedExploration ],			4200,		[ bds.SurfaceMetroplex, bds.ShipHull4Enormous ] ),
t(x.Hyperradiation,					[ x.MomentumReflection, x.EMFieldCoupling ],				5040,		[ bds.ShipSensor4HyperwaveTympanum, bds.ShipGenerator4VanKreegHypersplicer ] ),
t(x.SuperstringCompression,			[ x.Plasmatics ],											3640,		[ bds.ShipItemHyperfuel ] ),
t(x.MurgatroydHypothesis,			[ x.SuperstringCompression, x.LevelLogic ],					5940,		[ bds.OrbitalWeapon2ShortRangeOrbitalWhopper, bds.ShipSensor5MurgatroydsKnower, bds.ShipItemGyroInductor ] ),
t(x.EnergyRedirection,				[ x.Hyperradiation ],										4400,		[ bds.ShipShield4Deactotron, bds.ShipItemRecaller, bds.ShipItemSacrificialOrb ] ),
t(x.StasisFieldScience,				[ x.Hyperradiation ],										3600,		[ bds.ShipItemTractorBeam, bds.ShipItemBrunswikDissipator, bds.SurfacePlanetaryTractorBeam ] ),
t(x.MatterDuplication,				[ x.SuperstringCompression, x.MomentumReflection ],			5040,		[ bds.SurfaceCloningPlant, bds.ShipItemDisarmer ] ),
t(x.ScientificSorcery,				[ x.MurgatroydHypothesis ],									5400,		[ bds.ShipItemSmartBomb, bds.ShipItemContainmentDevice ] ),
t(x.StarlaneAnatomy,				[ x.EnergyRedirection, x.Plasmatics ],						3450,		[ bds.ShipItemLaneBlocker, bds.ShipItemLaneDestabilizer ] ),
t(x.CoherentPhotonics,				[ x.EnergyRedirection ],									7000,		[ bds.ShipWeapon07Ueberlaser, bds.ShipItemCannibalizer ] ),
t(x.Microbotics,					[ x.MatterDuplication ],									9020,		[ bds.SurfaceAutomation ] ),
t(x.EnergyFocusing,					[ x.CoherentPhotonics, x.MurgatroydHypothesis ],			5220,		[ bds.ShipItemMyrmidonicCarbonizer, bds.ShipItemAccutron ] ),
t(x.InertialControl,				[ x.StarlaneAnatomy, x.MatterDuplication ],					10080,		[ bds.ShipDrive4InertiaNegator ] ),
t(x.AdvancedPlanetaryArmaments,		[ x.CoherentPhotonics, x.LargeScaleConstruction ],			12240,		[ bds.SurfaceShield2SurfaceMegaShield, bds.OrbitalWeapon3LongRangeOrbitalWhopper ] ),
t(x.FergnatzsLastTheorem,			[ x.ScientificSorcery ],									10880,		[ bds.ShipWeapon08FergnatzLens, bds.ShipItemGizmogrifier ] ),
t(x.Hypergeometry,					[ x.FergnatzsLastTheorem ],									12920,		[ bds.ShipWeapon09HypersphereDriver, bds.ShipItemHyperswapper ] ),
t(x.RepulsionBeamTech,				[ x.EnergyFocusing ],										7040,		[ bds.ShipItemFleetDisperser ] ),
t(x.HyperwaveTechnology,			[ x.EnergyFocusing, x.Hyperradiation ],						7260,		[ bds.OrbitalShield2OrbitalMegaShield, bds.ShipShield5HyperwaveNullifier ] ),
t(x.MegagraphTheory,				[ x.FergnatzsLastTheorem ],									11760,		[ bds.SurfaceInternet ] ),
t(x.Nanoenergons,					[ x.FergnatzsLastTheorem, x.HyperwaveTechnology ],			12580,		[ bds.ShipSensor6NanowaveDecouplingNet, bds.ShipGenerator5Nanotwirler ] ),
t(x.EcospherePhaseControl,			[ x.Hypergeometry, x.PlanetaryReplenishment ],				9240,		[ bds.SurfaceFertilizationPlant ] ),
t(x.Teleinfiltration,				[ x.HyperwaveTechnology, x.ThoughtAnalysis ],				8580,		[ bds.ShipItemShieldBlaster, bds.ShipItemSpecialtyBlaster ] ),
t(x.HyperwaveEmissionControl,		[ x.HyperwaveTechnology ],									9460,		[ bds.ShipItemBackfirer ] ),
t(x.HyperdriveTechnology,			[ x.StarlaneAnatomy, x.Teleinfiltration ],					8800,		[ bds.ShipItemLaneMagnetron ] ),
t(x.ActionAtADistance,				[ x.Teleinfiltration, x.MegagraphTheory ],					12960,		[ bds.ShipItemMovingPartExploiter ] ),
t(x.DoomMechanization,				[ x.Teleinfiltration, x.HyperwaveEmissionControl ],			37600,		[ bds.ShipItemDisintegrator, bds.ShipItemSelfDestructotron ] ),
t(x.Nanofocusing,					[ x.Nanoenergons ],											22080,		[ bds.ShipWeapon10Nanomanipulator ] ),
t(x.Snooping,						[ x.ThoughtAnalysis, x.HyperwaveEmissionControl ],			11520,		[ bds.ShipItemLaneEndoscope ] ),
t(x.SelfModifyingStructures,		[ x.Nanofocusing, x.Microbotics ],							12000,		[ bds.ShipItemRemoteRepairFacility ] ),
t(x.Nanopropulsion,					[ x.Nanoenergons, x.HyperdriveTechnology ],					17600,		[ bds.ShipDrive5NanowaveSpaceBender ] ),
t(x.Nanodeflection,					[ x.Nanofocusing, x.InertialControl ],						21600,		[ bds.ShipShield6Nanoshell ] ),
t(x.AccelEnergyReplenishment,		[ x.MegagraphTheory, x.Nanopropulsion ],					12480,		[ bds.PlanetwideLushGrowthBomb ] ),
t(x.GravityFlowControl,				[ x.Nanopropulsion ],										12720,		[ bds.ShipItemGravimetricCondensor ] ),
t(x.IllusoryMachinations,			[ x.AccelEnergyReplenishment, x.Nanofocusing ],				33000,		[ bds.ShipItemInvulnerablizer ] )
			]
		);

		return returnValue;

	}

	technologiesFree(): Technology[]
	{
		var returnValues = this.technologies.filter
		(
			x =>
				x.namesOfPrerequisiteTechnologies.length == 0
				&& x.researchToLearn == 0 
		);
		return returnValues;
	}

	technologyByName(technologyName: string)
	{
		return this.technologiesByName.get(technologyName);
	}
}

class TechnologyNamesLegacy
{
	OrbitalStructures: string;
	InterplanetaryExploration: string;
	TonklinDiary: string;
	Xenobiology: string;
	EnvironmentalEncapsulation: string;
	SpectralAnalysis: string;
	Superconductivity: string;
	SpacetimeSurfing: string;
	AdvancedChemistry: string;
	AdvancedInterferometry: string;
	Cloaking: string;
	PowerConversion: string;
	GravityControl: string;
	Hyperlogic: string;
	MomentumDeconservation: string;
	Diplomatics: string;
	MolecularExplosives: string;
	StrongForceWeakening: string;
	LevelLogic: string;
	LightBending: string;
	Gravimetrics: string;
	EMFieldCoupling: string;
	MassPhasing: string;
	ThoughtAnalysis: string;
	AdvancedFunTechniques: string;
	PositronGuidance: string;
	Subatomics: string;
	AdvancedExploration: string;
	GravimetricCombustion: string;
	Plasmatics: string;
	PlanetaryReplenishment: string;
	MomentumReflection: string;
	LargeScaleConstruction: string;
	Hyperradiation: string;
	SuperstringCompression: string;
	MurgatroydHypothesis: string;
	EnergyRedirection: string;
	StasisFieldScience: string;
	MatterDuplication: string;
	ScientificSorcery: string;
	StarlaneAnatomy: string;
	CoherentPhotonics: string;
	Microbotics: string;
	EnergyFocusing: string;
	InertialControl: string;
	AdvancedPlanetaryArmaments: string;
	FergnatzsLastTheorem: string;
	Hypergeometry: string;
	RepulsionBeamTech: string;
	HyperwaveTechnology: string;
	MegagraphTheory: string;
	Nanoenergons: string;
	EcospherePhaseControl: string;
	Teleinfiltration: string;
	HyperwaveEmissionControl: string;
	HyperdriveTechnology: string;
	ActionAtADistance: string;
	DoomMechanization: string;
	Nanofocusing: string;
	Snooping: string;
	SelfModifyingStructures: string;
	Nanopropulsion: string;
	Nanodeflection: string;
	AccelEnergyReplenishment: string;
	GravityFlowControl: string;
	IllusoryMachinations: string;

	constructor()
	{
		this.OrbitalStructures 				= "Orbital Structures";
		this.InterplanetaryExploration 		= "Interplanetary Exploration";
		this.TonklinDiary 					= "Tonklin Diary";
		this.Xenobiology 					= "Xenobiology";
		this.EnvironmentalEncapsulation 	= "Environmental Encapsulation";
		this.SpectralAnalysis 				= "Spectral Analysis";
		this.Superconductivity 				= "Superconductivity";
		this.SpacetimeSurfing 				= "Spacetime Surfing";
		this.AdvancedChemistry 				= "Advanced Chemistry";
		this.AdvancedInterferometry 		= "Advanced Interferometry";
		this.Cloaking 						= "Cloaking";
		this.PowerConversion 				= "Power Conversion";
		this.GravityControl 				= "Gravity Control";
		this.Hyperlogic 					= "Hyperlogic";
		this.MomentumDeconservation 		= "Momentum Deconservation";
		this.Diplomatics 					= "Diplomatics";
		this.MolecularExplosives 			= "Molecular Explosives";
		this.StrongForceWeakening 			= "Strong Force Weakening";
		this.LevelLogic 					= "Level Logic";
		this.LightBending 					= "Light Bending";
		this.Gravimetrics 					= "Gravimetrics";
		this.EMFieldCoupling 				= "EM Field Coupling";
		this.MassPhasing 					= "Mass Phasing";
		this.ThoughtAnalysis 				= "Thought Analysis";
		this.AdvancedFunTechniques 			= "Advanced Fun Techniques";
		this.PositronGuidance 				= "Positron Guidance";
		this.Subatomics 					= "Subatomics";
		this.AdvancedExploration 			= "Advanced Exploration";
		this.GravimetricCombustion 			= "Gravimetric Combustion";
		this.Plasmatics 					= "Plasmatics";
		this.PlanetaryReplenishment 		= "Planetary Replenishment";
		this.MomentumReflection 			= "Momentum Reflection";
		this.LargeScaleConstruction 		= "Large Scale Construction";
		this.Hyperradiation 				= "Hyperradiation";
		this.SuperstringCompression 		= "Superstring Compression";
		this.MurgatroydHypothesis 			= "Murgatroyd Hypothesis";
		this.EnergyRedirection 				= "Energy Redirection";
		this.StasisFieldScience 			= "Stasis Field Science";
		this.MatterDuplication 				= "Matter Duplication";
		this.ScientificSorcery 				= "Scientific Sorcery";
		this.StarlaneAnatomy 				= "Starlane Anatomy";
		this.CoherentPhotonics 				= "Coherent Photonics";
		this.Microbotics 					= "Microbotics";
		this.EnergyFocusing 				= "Energy Focusing";
		this.InertialControl 				= "Inertial Control";
		this.AdvancedPlanetaryArmaments 	= "Advanced Planetary Armaments";
		this.FergnatzsLastTheorem 			= "Fergnatz's Last Theorem";
		this.Hypergeometry 					= "Hypergeometry";
		this.RepulsionBeamTech 				= "Repulsion Beam Tech";
		this.HyperwaveTechnology 			= "Hyperwave Technology";
		this.MegagraphTheory 				= "Megagraph Theory";
		this.Nanoenergons 					= "Nanoenergons";
		this.EcospherePhaseControl 			= "Ecosphere Phase Control";
		this.Teleinfiltration 				= "Teleinfiltration";
		this.HyperwaveEmissionControl 		= "Hyperwave Emission Control";
		this.HyperdriveTechnology 			= "Hyperdrive Technology";
		this.ActionAtADistance 				= "Action at a Distance";
		this.DoomMechanization 				= "Doom Mechanization";
		this.Nanofocusing 					= "Nanofocusing";
		this.Snooping 						= "Snooping";
		this.SelfModifyingStructures 		= "Self Modifying Structures";
		this.Nanopropulsion 				= "Nanopropulsion";
		this.Nanodeflection 				= "Nanodeflection";
		this.AccelEnergyReplenishment 		= "Accel Energy Replenishment";
		this.GravityFlowControl 			= "Gravity Flow Control";
		this.IllusoryMachinations 			= "Illusory Machinations";
	}
}