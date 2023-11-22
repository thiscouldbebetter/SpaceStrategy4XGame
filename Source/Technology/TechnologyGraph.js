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
        var returnValue = new TechnologyGraph("All Technologies", 
        // technologies
        [
            t("Orbital Structures", [], 50, [bds.OrbitalShipyard, bds.OrbitalShield1OrbitalShield]),
            t("Interplanetary Exploration", ["Orbital Structures"], 50, [bds.ShipHull1Small, bds.ShipHull2Medium, bds.ShipGenerator1ProtonShaver]),
            t("Tonklin Diary", [], 50, [bds.ShipDrive1TonklinMotor, bds.ShipSensor1TonklinFrequencyAnalyzer]),
            t("Xenobiology", [], 90, [bds.SurfaceXenoArchaeologicalDig]),
            t("Environmental Encapsulation", ["Xenobiology"], 50, [bds.SurfaceColonyHub, bds.ShipShield1IonWrap, bds.ShipItemColonizer]),
            t("Spectral Analysis", ["Tonklin Diary"], 120, [bds.ShipWeapon02FourierMissiles]),
            t("Superconductivity", ["Tonklin Diary"], 100, [bds.SurfaceShield1SurfaceShield, bds.ShipWeapon01MassBarrageGun]),
            t("Spacetime Surfing", ["Tonklin Diary", "Interplantary Exploration"], 90, [bds.ShipStarlaneDrive1StarLaneDrive]),
            t("Advanced Chemistry", ["Environmental Encapsulation"], 100, [bds.SurfaceArtificialHypdroponifer, bds.ShipDrive2IonBanger]),
            t("Advanced Interferometry", ["Spectral Analysis"], 90, [bds.ShipSensor2SubspacePhaseArray, bds.ShipItemInvasionModule]),
            t("Cloaking", ["Advanced Interferometry"], 1800, [bds.SurfaceCloaker, bds.OrbitalCloaker, bds.ShipItemCloaker]),
            t("Power Conversion", ["Spacetime Surfing"], 100, [bds.OrbitalWeapon1OrbitalMissileBase, bds.ShipGenerator2SubatomicScoop]),
            t("Gravity Control", ["Spacetime Surfing"], 560, [bds.ShipWeapon03QuantumSingularityLauncher]),
            t("Hyperlogic", ["Advanced Interferometry", "Xenobiology"], 1120, [bds.SurfaceResearchCampus, bds.ShipItemIntellectScrambler, bds.ShipItemXRayMegaglasses]),
            t("Momentum Deconservation", ["Spacetime Surfing"], 280, [bds.ShipShield2ConcussionShield]),
            t("Diplomatics", ["Hyperlogic"], 2000, [bds.SurfaceObservationInstallation, bds.PlanetwideFocusAlienHospitality]),
            t("Molecular Explosives", ["Spectral Analysis", "Power Conversion"], 720, [bds.ShipItemPhaseBomb, bds.ShipItemMassCondensor]),
            t("Strong Force Weakening", ["Power Conversion"], 980, [bds.ShipWeapon04MolecularDisassociator]),
            t("Level Logic", ["Hyperlogic"], 3300, [bds.PlanetwideFocusScientistTakeover]),
            t("Light Bending", ["Gravity Control"], 2560, [bds.ShipShield3WaveScatterer, bds.ShipItemReplenisher]),
            t("Gravimetrics", ["Gravity Control"], 1320, [bds.OrbitalDocks, bds.ShipItemMolecularTieDown]),
            t("EM Field Coupling", ["Light Bending"], 4200, [bds.ShipWeapon05ElectromagneticPulser, bds.ShipSensor3AuralCloudConstrictor]),
            t("Mass Phasing", ["Gravimetrics"], 2200, [bds.ShipItemGravimetricCatapult]),
            t("Thought Analysis", ["Level Logic"], 7700, [bds.SurfaceEngineeringRetreat]),
            t("Advanced Fun Techniques", ["Diplomatics"], 5580, [bds.SurfaceLogicFactory, bds.PlanetwideFocusEndlessParty]),
            t("Positron Guidance", ["Molecular Explosives"], 2400, [bds.SurfaceIndustrialMegafacility, bds.ShipItemPositronBouncer]),
            t("Subatomics", ["Positron Guidance"], 3300, [bds.SurfaceHyperpowerPlant, bds.ShipGenerator3QuarkExpress]),
            t("Advanced Exploration", ["Mass Phasing, Hyperlogic"], 4140, [bds.ShipStarlaneDrive2StarLaneHyperdrive, bds.ShipHull3Large]),
            t("Gravimetric Combustion", ["Gravimetrics", "Positron Guidance"], 2600, [bds.ShipDrive3GravitonProjector, bds.ShipItemToroidalBlaster]),
            t("Plasmatics", ["Subatomics"], 5700, [bds.ShipWeapon06Plasmatron, bds.ShipItemPlasmaCoupler]),
            t("Planetary Replenishment", ["Gravimetric Combustion", "Environmental Encapsulation"], 2560, [bds.SurfaceHabitat, bds.SurfaceTerraforming]),
            t("Momentum Reflection", ["Subatomics, Momentum Deconservation"], 4420, [bds.ShipItemGravityDistorter]),
            t("Large Scale Construction", ["Gravimetric Combustion", "Advanced Exploration"], 4200, [bds.SurfaceMetroplex, bds.ShipHull4Enormous]),
            t("Hyperradiation", ["Momentum Reflection", "EM Field Coupling"], 5040, [bds.ShipSensor4HyperwaveTympanum, bds.ShipGenerator4VanKreegHypersplicer]),
            t("Superstring Compression", ["Plasmatics"], 3640, [bds.ShipItemHyperfuel]),
            t("Muratroyd Hypothesis", ["Superstring Compression", "Level Logic"], 5940, [bds.OrbitalWeapon2ShortRangeOrbitalWhopper, bds.ShipSensor5MurgatroydsKnower, bds.ShipItemGyroInductor]),
            t("Energy Redirection", ["Hyperradiation"], 4400, [bds.ShipShield4Deactotron, bds.ShipItemRecaller, bds.ShipItemSacrificialOrb]),
            t("Stasis Field Science", ["Hyperradiation"], 3600, [bds.ShipItemTractorBeam, bds.ShipItemBrunswikDissipator, bds.SurfacePlanetaryTractorBeam]),
            t("Matter Duplication", ["Superstring Compression", "Momentum Reflection"], 5040, [bds.SurfaceCloningPlant, bds.ShipItemDisarmer]),
            t("Scientific Sorcery", ["Mergatroyd Hypothesis"], 5400, [bds.ShipItemSmartBomb, bds.ShipItemContainmentDevice]),
            t("Starlane Anatomy", ["Energy Redirection", "Plasmatics"], 3450, [bds.ShipItemLaneBlocker, bds.ShipItemLaneDestabilizer]),
            t("Coherent Photonics", ["Energy Redirection"], 7000, [bds.ShipWeapon07Ueberlaser, bds.ShipItemCannibalizer]),
            t("Microbotics", ["Matter Duplication"], 9020, [bds.SurfaceAutomation]),
            t("Energy Focusing", ["Coherent Photonics", "Muratroyd Hypothesis"], 5220, [bds.ShipItemMyrmidonicCarbonizer, bds.ShipItemAccutron]),
            t("Inertial Control", ["Starlane Anatomy", "Matter Duplication"], 10080, [bds.ShipDrive4InertiaNegator]),
            t("Advanced Planetary Armaments", ["Coherent Photonics", "Large Scale Construction"], 12240, [bds.SurfaceShield2SurfaceMegaShield, bds.OrbitalWeapon3LongRangeOrbitalWhopper]),
            t("Fergnatz's Last Theorem", ["Scientific Sorcery"], 10880, [bds.ShipWeapon08FergnatzLens, bds.ShipItemGizmogrifier]),
            t("Hypergeometry", ["Fergnatz's Last Theorem"], 12920, [bds.ShipWeapon09HypersphereDriver, bds.ShipItemHyperswapper]),
            t("Repulsion Beam Tech", ["Energy Focusing"], 7040, [bds.ShipItemFleetDisperser]),
            t("Hyperwave Technology", ["Energy Focusing", "Hyperradiation"], 7260, [bds.OrbitalShield2OrbitalMegaShield, bds.ShipShield5HyperwaveNullifier]),
            t("Megagraph Theory", ["Fergnatz's Last Theorem"], 11760, [bds.SurfaceInternet]),
            t("Nanoenergons", ["Fergnatz's Last Theorem", "Hyperwave Technology"], 12580, [bds.ShipSensor6NanowaveDecouplingNet, bds.ShipGenerator5Nanotwirler]),
            t("Ecosphere Phase Control", ["Hypergeometry", "Planetary Replenishment"], 9240, [bds.SurfaceFertilizationPlant]),
            t("Teleinfiltration", ["Hyperwave Technology", "Thought Analysis"], 8580, [bds.ShipItemShieldBlaster, bds.ShipItemSpecialtyBlaster]),
            t("Hyperwave Emission Control", ["Hyperwave Technology"], 9460, [bds.ShipItemBackfirer]),
            t("Hyperdrive Technology", ["Starlane Anatomy", "Teleinfiltration"], 8800, [bds.ShipItemLaneMagnetron]),
            t("Action At A Distance", ["Teleinfiltration", "Megagraph Theory"], 12960, [bds.ShipItemMovingPartExploiter]),
            t("Doom Mechanization", ["Teleinfiltration", "Hyperwave Emission Control"], 37600, [bds.ShipItemDisintegrator, bds.ShipItemSelfDestructotron]),
            t("Nanofocusing", ["Nanoenergons"], 22080, [bds.ShipWeapon10Nanomanipulator]),
            t("Snooping", ["Thought Analysis", "Hyperwave Emmision Control"], 11520, [bds.ShipItemLaneEndoscope]),
            t("Self Modifying Structures", ["Nanofocusing", "Microbotics"], 12000, [bds.ShipItemRemoteRepairFacility]),
            t("Nanopropulsion", ["Nanoenergons", "Hyperdrive Technology"], 17600, [bds.ShipDrive5NanowaveSpaceBender]),
            t("Nanodeflection", ["Nanofocusing", "Inertia Control"], 21600, [bds.ShipShield6Nanoshell]),
            t("Accel Energy Replenishment", ["Megagraph Theory", "Nanopropulsion"], 12480, [bds.PlanetwideLushGrowthBomb]),
            t("Gravity Flow Control", ["Nanopropulsion"], 12720, [bds.ShipItemGravimetricCondensor]),
            t("Illusory Machinations", ["Accel. Energy Replenishment", "Nanofocusing"], 33000, [bds.ShipItemInvulnerablizer])
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
