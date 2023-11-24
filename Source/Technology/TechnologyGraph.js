"use strict";
class TechnologyGraph {
    constructor(name, technologies) {
        this.name = name;
        this.technologies = technologies;
        this.technologiesByName =
            ArrayHelper.addLookupsByName(this.technologies);
    }
    static demo(mapCellSizeInPixels) {
        var t = (n, r, p, buildableDefnsAllowed) => new Technology(n, r, p, buildableDefnsAllowed.map(x => x.name));
        var bds = new BuildableDefnsBasic(mapCellSizeInPixels);
        var returnValue = new TechnologyGraph("All Technologies", 
        // technologies
        [
            t("Default", 0, // research
            [], // prerequisites
            [
                bds.SurfaceFactory,
                bds.SurfaceLaboratory,
                bds.SurfacePlantation,
                bds.SurfaceTransportTubes
            ]),
            t("Biology, Basic", 50, ["Default"], [bds.ShipItemColonyBuilder]),
            t("Drives, Basic", 50, ["Default"], [bds.ShipDriveBasic]),
            t("Generators, Basic", 50, ["Default"], [bds.ShipGeneratorBasic]),
            t("Sensors, Basic", 50, ["Default"], [bds.ShipSensorsBasic]),
            t("Shields, Basic", 50, ["Default"], [bds.ShipShieldBasic]),
            t("Space Structures, Basic", 50, ["Default"], [bds.Shipyard, bds.ShipHullSmall]),
            t("Weapons, Basic", 50, ["Default"], [bds.ShipWeaponBasic]),
            t("Biology, Intermediate", 400, ["Biology, Basic"], [bds.SurfacePlantationAdvanced]),
            t("Drives, Intermediate", 400, ["Drives, Basic"], [bds.ShipDriveIntermediate]),
            t("Generators, Intermediate", 400, ["Space Structures, Basic", "Generators, Basic"], [bds.ShipGeneratorIntermediate]),
            t("Industry, Intermediate", 400, ["Generators, Basic"], [bds.SurfaceFactoryAdvanced]),
            t("Research, Intermediate", 400, ["Biology, Basic"], [bds.SurfaceLaboratoryAdvanced]),
            t("Sensors, Intermediate", 400, ["Sensors, Basic"], [bds.ShipSensorsIntermediate]),
            t("Shields, Intermediate", 400, ["Space Structures, Basic", "Shields, Basic"], [bds.OrbitalShield, bds.ShipShieldIntermediate, bds.SurfaceShield]),
            t("Space Structures, Intermediate", 400, ["Space Structures, Basic"], [bds.OrbitalDocks, bds.ShipHullMedium]),
            t("Weapons, Intermediate", 400, ["Space Structures, Basic", "Weapons, Basic"], [bds.ShipItemDropShip, bds.OrbitalWeaponBasic, bds.ShipWeaponIntermediate]),
            // t("Weapons, Nonlethal", 				400, [ "Space Structures, Basic", "Weapons, Basic" ], 				[ bds.OrbitalDisrupter, bds.ShipDisrupter ] ),
            t("Diplomatics, Advanced", 3200, ["Biology, Intermediate"], [bds.PlanetwideFocusDiplomacy]),
            t("Drives, Advanced", 3200, ["Drives, Intermediate"], [bds.ShipDriveAdvanced]),
            t("Generators, Advanced", 3200, ["Generators, Intermediate", "Industry, Intermediate"], [bds.ShipGeneratorAdvanced]),
            t("Research, Advanced", 3200, ["Research, Intermediate"], [bds.SurfaceLaboratoryMultiplier]),
            t("Sensors, Advanced", 3200, ["Sensors, Intermediate"], [bds.ShipSensorsAdvanced]),
            t("Shields, Advanced", 3200, ["Shields, Intermediate"], [bds.ShipShieldAdvanced]),
            t("Shields, Cloaking", 3200, ["Shields, Intermediate"], [bds.OrbitalCloak, bds.ShipItemCloak, bds.SurfaceCloak]),
            t("Space Structures, Advanced", 3200, ["Space Structures, Intermediate"], [bds.ShipHullMedium]),
            t("Weapons, Advanced", 3200, ["Weapons, Intermediate", "Weapons, Nonlethal"], [bds.ShipWeaponAdvanced]),
            t("Drives, Supreme", 12800, ["Drives, Advanced"], [bds.ShipDriveSupreme]),
            t("Generators, Supreme", 12800, ["Generators, Advanced"], [bds.ShipGeneratorSupreme]),
            t("Research, Supreme", 12800, ["Generators, Advanced"], [bds.PlanetwideFocusResearch]),
            t("Sensors, Supreme", 12800, ["Sensors, Advanced"], [bds.ShipSensorsSupreme]),
            t("Shields, Supreme", 12800, ["Shields, Advanced"], [bds.ShipShieldSupreme]),
            t("Space Structures, Supreme", 12800, ["Space Structures, Advanced"], [bds.ShipHullMedium]),
            t("Weapons, Supreme", 12800, ["Weapons, Advanced"], [bds.ShipWeaponSupreme]),
        ]);
        return returnValue;
    }
    static legacy(mapCellSizeInPixels) {
        // Technologies from the game _Ascendancy_.
        var t = (n, p, r, a) => new Technology(n, r, p, a.map(x => x.name)); // Note different orders.
        var bds = new BuildableDefnsLegacy(mapCellSizeInPixels);
        var OrbitalStructures = "Orbital Structures";
        var InterplanetaryExploration = "Interplanetary Exploration";
        var TonklinDiary = "Tonklin Diary";
        var Xenobiology = "Xenobiology";
        var EnvironmentalEncapsulation = "Environmental Encapsulation";
        var SpectralAnalysis = "Spectral Analysis";
        var Superconductivity = "Superconductivity";
        var SpacetimeSurfing = "Spacetime Surfing";
        var AdvancedChemistry = "Advanced Chemistry";
        var AdvancedInterferometry = "Advanced Interferometry";
        var Cloaking = "Cloaking";
        var PowerConversion = "Power Conversion";
        var GravityControl = "Gravity Control";
        var Hyperlogic = "Hyperlogic";
        var MomentumDeconservation = "Momentum Deconservation";
        var Diplomatics = "Diplomatics";
        var MolecularExplosives = "Molecular Explosives";
        var StrongForceWeakening = "Strong Force Weakening";
        var LevelLogic = "Level Logic";
        var LightBending = "Light Bending";
        var Gravimetrics = "Gravimetrics";
        var EMFieldCoupling = "EM Field Coupling";
        var MassPhasing = "Mass Phasing";
        var ThoughtAnalysis = "Thought Analysis";
        var AdvancedFunTechniques = "Advanced Fun Techniques";
        var PositronGuidance = "Positron Guidance";
        var Subatomics = "Subatomics";
        var AdvancedExploration = "Advanced Exploration";
        var GravimetricCombustion = "Gravimetric Combustion";
        var Plasmatics = "Plasmatics";
        var PlanetaryReplenishment = "Planetary Replenishment";
        var MomentumReflection = "Momentum Reflection";
        var LargeScaleConstruction = "Large Scale Construction";
        var Hyperradiation = "Hyperradiation";
        var SuperstringCompression = "Superstring Compression";
        var MuratroydHypothesis = "Muratroyd Hypothesis";
        var EnergyRedirection = "Energy Redirection";
        var StasisFieldScience = "Stasis Field Science";
        var MatterDuplication = "Matter Duplication";
        var ScientificSorcery = "Scientific Sorcery";
        var StarlaneAnatomy = "Starlane Anatomy";
        var CoherentPhotonics = "Coherent Photonics";
        var Microbotics = "Microbotics";
        var EnergyFocusing = "Energy Focusing";
        var InertialControl = "Inertial Control";
        var AdvancedPlanetaryArmaments = "Advanced Planetary Armaments";
        var FergnatzsLastTheorem = "Fergnatz's Last Theorem";
        var Hypergeometry = "Hypergeometry";
        var RepulsionBeamTech = "Repulsion Beam Tech";
        var HyperwaveTechnology = "Hyperwave Technology";
        var MegagraphTheory = "Megagraph Theory";
        var Nanoenergons = "Nanoenergons";
        var EcospherePhaseControl = "Ecosphere Phase Control";
        var Teleinfiltration = "Teleinfiltration";
        var HyperwaveEmissionControl = "Hyperwave Emission Control";
        var HyperdriveTechnology = "Hyperdrive Technology";
        var Action, tADistance = "Action at a Distance";
        var Doom, Mechanization = "Doom Mechanization";
        var Nanofocusing = "Nanofocusing";
        var Snooping = "Snooping";
        var SelfModifyingStructures = "Self Modifying Structures";
        var Nanopropulsion = "Nanopropulsion";
        var Nanodeflection = "Nanodeflection";
        var AccelEnergyReplenishment = "Accel Energy Replenishment";
        var GravityFlowControl = "Gravity Flow Control";
        var IllusoryMachinations = "Illusory Machinations";
        var returnValue = new TechnologyGraph("All Technologies", 
        // technologies
        [
            t(OrbitalStructures, [], 50, [bds.OrbitalShipyard, bds.OrbitalShield1OrbitalShield]),
            t(InterplanetaryExploration, [OrbitalStructures], 50, [bds.ShipHull1Small, bds.ShipHull2Medium, bds.ShipGenerator1ProtonShaver]),
            t(TonklinDiary, [], 50, [bds.ShipDrive1TonklinMotor, bds.ShipSensor1TonklinFrequencyAnalyzer]),
            t(Xenobiology, [], 90, [bds.SurfaceXenoArchaeologicalDig]),
            t(EnvironmentalEncapsulation, [Xenobiology], 50, [bds.SurfaceColonyHub, bds.ShipShield1IonWrap, bds.ShipItemColonizer]),
            t(SpectralAnalysis, [TonklinDiary], 120, [bds.ShipWeapon02FourierMissiles]),
            t(Superconductivity, [TonklinDiary], 100, [bds.SurfaceShield1SurfaceShield, bds.ShipWeapon01MassBarrageGun]),
            t(SpacetimeSurfing, [TonklinDiary, InterplantaryExploration], 90, [bds.ShipStarlaneDrive1StarLaneDrive]),
            t(AdvancedChemistry, [EnvironmentalEncapsulation], 100, [bds.SurfaceArtificialHypdroponifer, bds.ShipDrive2IonBanger]),
            t(AdvancedInterferometry, [SpectralAnalysis], 90, [bds.ShipSensor2SubspacePhaseArray, bds.ShipItemInvasionModule]),
            t(Cloaking, [AdvancedInterferometry], 1800, [bds.SurfaceCloaker, bds.OrbitalCloaker, bds.ShipItemCloaker]),
            t(PowerConversion, [SpacetimeSurfing], 100, [bds.OrbitalWeapon1OrbitalMissileBase, bds.ShipGenerator2SubatomicScoop]),
            t(GravityControl, [SpacetimeSurfing], 560, [bds.ShipWeapon03QuantumSingularityLauncher]),
            t(Hyperlogic, [AdvancedInterferometry, Xenobiology], 1120, [bds.SurfaceResearchCampus, bds.ShipItemIntellectScrambler, bds.ShipItemXRayMegaglasses]),
            t(MomentumDeconservation, [SpacetimeSurfing], 280, [bds.ShipShield2ConcussionShield]),
            t(Diplomatics, [Hyperlogic], 2000, [bds.SurfaceObservationInstallation, bds.PlanetwideFocusAlienHospitality]),
            t(MolecularExplosives, [SpectralAnalysis, PowerConversion], 720, [bds.ShipItemPhaseBomb, bds.ShipItemMassCondensor]),
            t(StrongForceWeakening, [PowerConversion], 980, [bds.ShipWeapon04MolecularDisassociator]),
            t(LevelLogic, [Hyperlogic], 3300, [bds.PlanetwideFocusScientistTakeover]),
            t(LightBending, [GravityControl], 2560, [bds.ShipShield3WaveScatterer, bds.ShipItemReplenisher]),
            t(Gravimetrics, [GravityControl], 1320, [bds.OrbitalDocks, bds.ShipItemMolecularTieDown]),
            t(EMFieldCoupling, [LightBending], 4200, [bds.ShipWeapon05ElectromagneticPulser, bds.ShipSensor3AuralCloudConstrictor]),
            t(MassPhasing, [Gravimetrics], 2200, [bds.ShipItemGravimetricCatapult]),
            t(ThoughtAnalysis, [LevelLogic], 7700, [bds.SurfaceEngineeringRetreat]),
            t(AdvancedFunTechniques, [Diplomatics], 5580, [bds.SurfaceLogicFactory, bds.PlanetwideFocusEndlessParty]),
            t(PositronGuidance, [MolecularExplosives], 2400, [bds.SurfaceIndustrialMegafacility, bds.ShipItemPositronBouncer]),
            t(Subatomics, [PositronGuidance], 3300, [bds.SurfaceHyperpowerPlant, bds.ShipGenerator3QuarkExpress]),
            t(AdvancedExploration, [MassPhasing, Hyperlogic], 4140, [bds.ShipStarlaneDrive2StarLaneHyperdrive, bds.ShipHull3Large]),
            t(GravimetricCombustion, [Gravimetrics, PositronGuidance], 2600, [bds.ShipDrive3GravitonProjector, bds.ShipItemToroidalBlaster]),
            t(Plasmatics, [Subatomics], 5700, [bds.ShipWeapon06Plasmatron, bds.ShipItemPlasmaCoupler]),
            t(PlanetaryReplenishment, [GravimetricCombustion, EnvironmentalEncapsulation], 2560, [bds.SurfaceHabitat, bds.SurfaceTerraforming]),
            t(MomentumReflection, [Subatomics, MomentumDeconservation], 4420, [bds.ShipItemGravityDistorter]),
            t(LargeScaleConstruction, [GravimetricCombustion, AdvancedExploration], 4200, [bds.SurfaceMetroplex, bds.ShipHull4Enormous]),
            t(Hyperradiation, [MomentumReflection, EMFieldCoupling], 5040, [bds.ShipSensor4HyperwaveTympanum, bds.ShipGenerator4VanKreegHypersplicer]),
            t(Superstring, Compression, [Plasmatics], 3640, [bds.ShipItemHyperfuel]),
            t(Muratroyd, Hypothesis, [SuperstringCompression, LevelLogic], 5940, [bds.OrbitalWeapon2ShortRangeOrbitalWhopper, bds.ShipSensor5MurgatroydsKnower, bds.ShipItemGyroInductor]),
            t(Energy, Redirection, [Hyperradiation], 4400, [bds.ShipShield4Deactotron, bds.ShipItemRecaller, bds.ShipItemSacrificialOrb]),
            t(Stasis, Field, Science, [Hyperradiation], 3600, [bds.ShipItemTractorBeam, bds.ShipItemBrunswikDissipator, bds.SurfacePlanetaryTractorBeam]),
            t(MatterDuplication, [SuperstringCompression, MomentumReflection], 5040, [bds.SurfaceCloningPlant, bds.ShipItemDisarmer]),
            t(ScientificSorcery, [MergatroydHypothesis], 5400, [bds.ShipItemSmartBomb, bds.ShipItemContainmentDevice]),
            t(StarlaneAnatomy, [EnergyRedirection, Plasmatics], 3450, [bds.ShipItemLaneBlocker, bds.ShipItemLaneDestabilizer]),
            t(CoherentPhotonics, [EnergyRedirection], 7000, [bds.ShipWeapon07Ueberlaser, bds.ShipItemCannibalizer]),
            t(Microbotics, [MatterDuplication], 9020, [bds.SurfaceAutomation]),
            t(EnergyFocusing, [CoherentPhotonics, MuratroydHypothesis], 5220, [bds.ShipItemMyrmidonicCarbonizer, bds.ShipItemAccutron]),
            t(InertialControl, [StarlaneAnatomy, MatterDuplication], 10080, [bds.ShipDrive4InertiaNegator]),
            t(AdvancedPlanetaryArmaments, [CoherentPhotonics, LargeScaleConstruction], 12240, [bds.SurfaceShield2SurfaceMegaShield, bds.OrbitalWeapon3LongRangeOrbitalWhopper]),
            t(FergnatzsLastTheorem, [ScientificSorcery], 10880, [bds.ShipWeapon08FergnatzLens, bds.ShipItemGizmogrifier]),
            t(Hypergeometry, [FergnatzsLastTheorem], 12920, [bds.ShipWeapon09HypersphereDriver, bds.ShipItemHyperswapper]),
            t(RepulsionBeamTech, [EnergyFocusing], 7040, [bds.ShipItemFleetDisperser]),
            t(HyperwaveTechnology, [EnergyFocusing, Hyperradiation], 7260, [bds.OrbitalShield2OrbitalMegaShield, bds.ShipShield5HyperwaveNullifier]),
            t(MegagraphTheory, [FergnatzsLastTheorem], 11760, [bds.SurfaceInternet]),
            t(Nanoenergons, [FergnatzsLastTheorem, HyperwaveTechnology], 12580, [bds.ShipSensor6NanowaveDecouplingNet, bds.ShipGenerator5Nanotwirler]),
            t(EcospherePhaseControl, [Hypergeometry, PlanetaryReplenishment], 9240, [bds.SurfaceFertilizationPlant]),
            t(Teleinfiltration, [HyperwaveTechnology, ThoughtAnalysis], 8580, [bds.ShipItemShieldBlaster, bds.ShipItemSpecialtyBlaster]),
            t(HyperwaveEmissionControl, [HyperwaveTechnology], 9460, [bds.ShipItemBackfirer]),
            t(HyperdriveTechnology, [StarlaneAnatomy, Teleinfiltration], 8800, [bds.ShipItemLaneMagnetron]),
            t(ActionAtADistance, [Teleinfiltration, MegagraphTheory], 12960, [bds.ShipItemMovingPartExploiter]),
            t(Doom, Mechanization, [Teleinfiltration, HyperwaveEmissionControl], 37600, [bds.ShipItemDisintegrator, bds.ShipItemSelfDestructotron]),
            t(Nanofocusing, [Nanoenergons], 22080, [bds.ShipWeapon10Nanomanipulator]),
            t(Snooping, [ThoughtAnalysis, HyperwaveEmmisionControl], 11520, [bds.ShipItemLaneEndoscope]),
            t(SelfModifyingStructures, [Nanofocusing, Microbotics], 12000, [bds.ShipItemRemoteRepairFacility]),
            t(Nanopropulsion, [Nanoenergons, HyperdriveTechnology], 17600, [bds.ShipDrive5NanowaveSpaceBender]),
            t(Nanodeflection, [Nanofocusing, InertiaControl], 21600, [bds.ShipShield6Nanoshell]),
            t(AccelEnergyReplenishment, [Megagraph, Theory, Nanopropulsion], 12480, [bds.PlanetwideLushGrowthBomb]),
            t(GravityFlowControl, [Nanopropulsion], 12720, [bds.ShipItemGravimetricCondensor]),
            t(IllusoryMachinations, [AccelEnergyReplenishment, Nanofocusing], 33000, [bds.ShipItemInvulnerablizer])
        ]);
        return returnValue;
    }
    technologiesFree() {
        var returnValues = this.technologies.filter(x => x.namesOfPrerequisiteTechnologies.length == 0
            && x.researchRequired == 0);
        return returnValues;
    }
    technologyByName(technologyName) {
        return this.technologiesByName.get(technologyName);
    }
}
