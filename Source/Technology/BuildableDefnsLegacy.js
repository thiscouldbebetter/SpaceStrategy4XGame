"use strict";
class BuildableDefnsLegacy {
    constructor(mapCellSizeInPixels) {
        var fontHeight = mapCellSizeInPixels.y / 2;
        var terrains = MapTerrain.Instances(mapCellSizeInPixels);
        var terrainNamesOrbital = [terrains.Orbit.name];
        var terrainNamesShip = [terrains.Ship.name];
        var terrainNamesSurface = terrains._Surface.map(x => x.name);
        var terrainNamesSurfaceUsable = terrainNamesSurface.filter(x => x != terrains.SurfaceUnusable.name);
        var colors = Color.Instances();
        var visualBuild = (labelText, color) => {
            return new VisualGroup([
                new VisualRectangle(mapCellSizeInPixels, color, null, null),
                VisualText.fromTextHeightAndColor(labelText, fontHeight, colors.White)
            ]);
        };
        var facilityOrbital = (name, visual, industryToBuildAmount) => new BuildableDefn(name, false, // isItem
        terrainNamesOrbital, mapCellSizeInPixels, visual, industryToBuildAmount, null, // resourcesProducedPerTurn
        null // entityModifyOnBuild
        );
        var facilitySurfaceUsable = (name, visual, industryToBuildAmount, resourcesProducedPerTurn) => new BuildableDefn(name, false, // isItem
        terrainNamesSurfaceUsable, mapCellSizeInPixels, visual, industryToBuildAmount, resourcesProducedPerTurn, null // entityModifyOnBuild
        );
        var facilitySurfaceAnywhere = (name, visual, industryToBuildAmount) => new BuildableDefn(name, false, // isItem
        terrainNamesSurface, mapCellSizeInPixels, visual, industryToBuildAmount, null, // resourcesProducedPerTurn,
        null // entityModifyOnBuild
        );
        var planetwideFocus = (name, visual) => new BuildableDefn(name, null, // isItem
        null, // terrainNames,
        mapCellSizeInPixels, visual, null, // industryToBuildAmount,
        null, // resourcesProducedPerTurn,
        null // entityModifyOnBuild
        );
        var shipComponent = (name, visual, industryToBuildAmount) => new BuildableDefn(name, true, // isItem
        terrainNamesShip, mapCellSizeInPixels, visual, industryToBuildAmount, null, // resourcesProducedPerTurn
        null // entityModifyOnBuild
        );
        // Planet - Orbit.
        this.OrbitalCloaker = facilityOrbital("Orbital Cloak", visualBuild("C", colors.Gray), 40);
        this.OrbitalDocks = facilityOrbital("Orbital Docks", visualBuild("D", colors.Gray), 170);
        this.OrbitalShield1OrbitalShield = facilityOrbital("Orbital Shield", visualBuild("S", colors.Red), 60);
        this.OrbitalShield2OrbitalMegaShield = facilityOrbital("Orbital Mega Shield", visualBuild("S", colors.Blue), 120);
        this.OrbitalShipyard = facilityOrbital("Shipyard", visualBuild("Y", colors.Blue), 120);
        this.OrbitalWeapon1MissileBase = facilityOrbital("Orbital Missile Base", visualBuild("W", colors.Gray), 60);
        this.OrbitalWeapon2ShortRangeOrbitalWhopper = facilityOrbital("Short-Range Orbital Whopper", visualBuild("W", colors.Red), 90);
        this.OrbitalWeapon3LongRangeOrbitalWhopper = facilityOrbital("Long-Range Orbital Whopper", visualBuild("W", colors.Green), 180);
        // Planetwide.
        this.PlanetwideFocusAlienHospitality = planetwideFocus("Alien Hospitality", visualBuild("Focus", colors.Orange));
        this.PlanetwideFocusEndlessParty = planetwideFocus("Endless Party", visualBuild("Focus", colors.Green));
        this.PlanetwideFocusScientistTakeover = planetwideFocus("Scientist Takeover", visualBuild("Focus", colors.Blue));
        this.PlanetwideLushGrowthBomb = planetwideFocus("Lush Growth Bomb", visualBuild("Focus", colors.Violet) // todo - 200
        );
        // Ships.
        // Drives.
        this.ShipDrive1TonklinMotor = shipComponent("Tonklin Motor", visualBuild("Drive", colors.Gray), 10);
        this.ShipDrive2IonBanger = shipComponent("Ion Banger", visualBuild("Drive", colors.Red), 30);
        this.ShipDrive3GravitonProjector = shipComponent("Graviton Projector", visualBuild("Drive", colors.Green), 40);
        this.ShipDrive4InertiaNegator = shipComponent("Inertia Negator", visualBuild("Drive", colors.Red), 20);
        this.ShipDrive5NanowaveSpaceBender = shipComponent("Inertia Negator", visualBuild("Drive", colors.Red), 80);
        // Generators.
        this.ShipGenerator1ProtonShaver = shipComponent("Proton Shaver", visualBuild("Generator", colors.Gray), 20);
        this.ShipGenerator2SubatomicScoop = shipComponent("Ship Generator, Intermediate", visualBuild("Generator", colors.Red), 35);
        this.ShipGenerator3QuarkExpress = shipComponent("Quark Express", visualBuild("Generator", colors.Green), 60);
        this.ShipGenerator4VanKreegHypersplicer = shipComponent("Van Kreeg Hypersplicer", visualBuild("Generator", colors.Blue), 80);
        this.ShipGenerator5Nanotwirler = shipComponent("Nanotwirler", visualBuild("Generator", colors.Violet), 100);
        // Hulls.
        this.ShipHull1Small = new BuildableDefn("Small Ship Hull", true, // isItem // Is it, though?
        terrainNamesOrbital, mapCellSizeInPixels, visualBuild("Hull", colors.Gray), 30, [], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.ShipHull2Medium = new BuildableDefn("Medium Ship Hull", true, // isItem // Is it, though?
        terrainNamesOrbital, mapCellSizeInPixels, visualBuild("Hull", colors.Red), 60, [], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.ShipHull3Large = new BuildableDefn("Large Ship Hull", true, // isItem // Is it, though?
        terrainNamesOrbital, mapCellSizeInPixels, visualBuild("Hull", colors.Green), 120, [], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.ShipHull4Enormous = new BuildableDefn("Enormous Ship Hull", true, // isItem // Is it, though?
        terrainNamesOrbital, mapCellSizeInPixels, visualBuild("Hull", colors.Blue), 240, [], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        // Items.
        var sc = (name, industry) => shipComponent(name, visualBuild(name, colors.Gray), industry);
        this.ShipItemAccutron = sc("Accutron", 60);
        this.ShipItemBackfirer = sc("Backfirer", 99999);
        this.ShipItemBrunswikDissipator = sc("Brunswik Dissipator", 99999);
        this.ShipItemCannibalizer = sc("Cannibalizer", 99999);
        this.ShipItemCloaker = sc("Cloaker", 99999);
        this.ShipItemColonizer = sc("Colonizer", 99999);
        this.ShipItemContainmentDevice = sc("ContainmentDevice", 99999);
        this.ShipItemDisarmer = sc("Disarmer", 99999);
        this.ShipItemDisintegrator = sc("Disintegrator", 99999);
        this.ShipItemFleetDisperser = sc("FleetDisperser", 99999);
        this.ShipItemGizmogrifier = sc("Gizmogrifier", 99999);
        this.ShipItemGravimetricCatapult = sc("GravimetricCatapult", 99999);
        this.ShipItemGravimetricCondensor = sc("GravimetricCondensor", 99999);
        this.ShipItemGravityDistorter = sc("GravityDistorter", 99999);
        this.ShipItemGyroInductor = sc("GyroInductor", 99999);
        this.ShipItemHyperfuel = sc("Hyperfuel", 99999);
        this.ShipItemHyperswapper = sc("Hyperswapper", 99999);
        this.ShipItemIntellectScrambler = sc("IntellectScrambler", 99999);
        this.ShipItemInvasionModule = sc("InvasionModule", 99999);
        this.ShipItemInvulnerablizer = sc("Invulnerablizer", 99999);
        this.ShipItemLaneBlocker = sc("LaneBlocker", 99999);
        this.ShipItemLaneDestabilizer = sc("LaneDestabilizer", 99999);
        this.ShipItemLaneEndoscope = sc("LaneEndoscope", 99999);
        this.ShipItemLaneMagnetron = sc("LaneMagnetron", 99999);
        this.ShipItemMassCondensor = sc("MassCondensor", 99999);
        this.ShipItemMolecularTieDown = sc("MolecularTieDown", 99999);
        this.ShipItemMovingPartExploiter = sc("MovingPartExploiter", 99999);
        this.ShipItemMyrmidonicCarbonizer = sc("MyrmidonicCarbonizer", 99999);
        this.ShipItemPhaseBomb = sc("PhaseBomb", 99999);
        this.ShipItemPlasmaCoupler = sc("PlasmaCoupler", 99999);
        this.ShipItemPositronBouncer = sc("PositronBouncer", 99999);
        this.ShipItemRecaller = sc("Recaller", 99999);
        this.ShipItemRemoteRepairFacility = sc("RemoteRepairFacility", 99999);
        this.ShipItemReplenisher = sc("Replenisher", 99999);
        this.ShipItemSacrificialOrb = sc("SacrificialOrb", 99999);
        this.ShipItemSelfDestructotron = sc("SelfDestructotron", 99999);
        this.ShipItemShieldBlaster = sc("ShieldBlaster", 99999);
        this.ShipItemSmartBomb = sc("SmartBomb", 99999);
        this.ShipItemSpecialtyBlaster = sc("SpecialtyBlaster", 99999);
        this.ShipItemToroidalBlaster = sc("ToroidalBlaster", 99999);
        this.ShipItemTractorBeam = sc("TractorBeam", 99999);
        this.ShipItemXRayMegaglasses = sc("XRayMegaglasses", 99999);
        // Sensors.
        this.ShipSensor1TonklinFrequencyAnalyzer = shipComponent("Tonklin Frequency Analyzer", visualBuild("Sensors", colors.Gray), 30);
        this.ShipSensor2SubspacePhaseArray = shipComponent("Subspace Phase Array", visualBuild("Sensors", colors.Gray), 30);
        this.ShipSensor3AuralCloudConstrictor = shipComponent("Aural Cloud Constrictor", visualBuild("Sensors", colors.Gray), 30);
        this.ShipSensor4HyperwaveTympanum = shipComponent("Hyperwave Tympanum", visualBuild("Sensors", colors.Gray), 30);
        this.ShipSensor5MurgatroydsKnower = shipComponent("Murgatroyd's Knower", visualBuild("Sensors", colors.Gray), 30);
        this.ShipSensor6NanowaveDecouplingNet = shipComponent("Nanowave Decoupling Net", visualBuild("Sensors", colors.Gray), 30);
        // Shields.
        this.ShipShield1IonWrap = shipComponent("Ion Wrap", visualBuild("Shield", colors.Gray), 30);
        this.ShipShield2ConcussionShield = shipComponent("Concussion Shield", visualBuild("Shield", colors.Gray), 30);
        this.ShipShield3WaveScatterer = shipComponent("Wave Scatterer", visualBuild("Shield", colors.Gray), 30);
        this.ShipShield4Deactotron = shipComponent("Deactotron", visualBuild("Shield", colors.Gray), 30);
        this.ShipShield5HyperwaveNullifier = shipComponent("Hyperwave Nullifier", visualBuild("Shield", colors.Gray), 30);
        this.ShipShield6Nanoshell = shipComponent("Nanoshell", visualBuild("Shield", colors.Gray), 30);
        // Starlane Drives.
        this.ShipStarlaneDrive1StarLaneDrive = shipComponent("Star Lane Drive", visualBuild("StarDrive", colors.Gray), 30);
        this.ShipStarlaneDrive2StarLaneHyperdrive = shipComponent("Star Lane Hyperdrive", visualBuild("StarDrive", colors.Gray), 30);
        // Weapons.
        this.ShipWeapon01MassBarrageGun = shipComponent("MassBarrageGun", visualBuild("Weapon", colors.Gray), 30);
        this.ShipWeapon02FourierMissiles = shipComponent("FourierMissiles", visualBuild("Weapon", colors.Gray), 30);
        this.ShipWeapon03QuantumSingularityLauncher = shipComponent("QuantumSingularityLauncher", visualBuild("Weapon", colors.Gray), 30);
        this.ShipWeapon04MolecularDisassociator = shipComponent("MolecularDisassociator", visualBuild("Weapon", colors.Gray), 30);
        this.ShipWeapon05ElectromagneticPulser = shipComponent("ElectromagneticPulser", visualBuild("Weapon", colors.Gray), 30);
        this.ShipWeapon06Plasmatron = shipComponent("Plasmatron", visualBuild("Weapon", colors.Gray), 30);
        this.ShipWeapon07Ueberlaser = shipComponent("Ueberlaser", visualBuild("Weapon", colors.Gray), 30);
        this.ShipWeapon08FergnatzLens = shipComponent("FergnatzLens", visualBuild("Weapon", colors.Gray), 30);
        this.ShipWeapon09HypersphereDriver = shipComponent("HypersphereDriver", visualBuild("Weapon", colors.Gray), 30);
        this.ShipWeapon10Nanomanipulator = shipComponent("Nanomanipulator", visualBuild("Weapon", colors.Gray), 30);
        // Surface.
        this.SurfaceArtificialHypdroponifer = facilitySurfaceUsable("Artificial Hydroponifier", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceAutomation = facilitySurfaceUsable("Automation", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceCloaker = facilitySurfaceUsable("Surface Cloak", visualBuild("Cloak", colors.Gray), 120, null);
        this.SurfaceCloningPlant = facilitySurfaceUsable("Cloning Plant", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceEngineeringRetreat = facilitySurfaceUsable("EngineeringRetreat", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceFertilizationPlant = facilitySurfaceUsable("FertilizationPlant", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceHabitat = facilitySurfaceUsable("Habitat", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceHyperpowerPlant = facilitySurfaceUsable("HyperpowerPlant", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceIndustrialMegafacility = facilitySurfaceUsable("IndustrialMegafacility", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceInternet = facilitySurfaceUsable("Internet", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceLogicFactory = facilitySurfaceUsable("LogicFactory", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceMetroplex = facilitySurfaceUsable("Metroplex", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceObservationInstallation = facilitySurfaceUsable("ObservationInstallation", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfacePlanetaryTractorBeam = facilitySurfaceUsable("PlanetaryTractorBeam", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceResearchCampus = facilitySurfaceUsable("ResearchCampus", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceShield1SurfaceShield = facilitySurfaceUsable("Shield1SurfaceShield", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceShield2SurfaceMegaShield = facilitySurfaceUsable("Shield2SurfaceMegaShield", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceTerraforming = facilitySurfaceUsable("Terraforming", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceXenoArchaeologicalDig = facilitySurfaceUsable("XenoArchaeologicalDig", visualBuild("todo", colors.Gray), 9999, null);
        // Default tech.
        this.SurfaceAgriplot = facilitySurfaceUsable("Agriplot", visualBuild("P", colors.Green), 30, [new Resource("Prosperity", 1)] // resourcesPerTurn
        );
        this.SurfaceColonyHub = facilitySurfaceUsable("Colony Hub", visualBuild("H", colors.Gray), 30, [new Resource("Industry", 1), new Resource("Prosperity", 1)] // resourcesPerTurn
        );
        this.SurfaceFactory = facilitySurfaceUsable("Factory", visualBuild("F", colors.Red), 30, [new Resource("Industry", 1)] // resourcesPerTurn
        );
        this.SurfaceLaboratory = facilitySurfaceUsable("Laboratory", visualBuild("L", colors.Blue), 30, [new Resource("Research", 1)] // resourcesPerTurn
        );
        this.SurfaceTransportTubes = facilitySurfaceAnywhere("Transport Tubes", visualBuild("T", colors.Red), 15);
        this._All =
            [
                this.OrbitalCloaker,
                this.OrbitalDocks,
                this.OrbitalShield1OrbitalShield,
                this.OrbitalShield2OrbitalMegaShield,
                this.OrbitalShipyard,
                this.OrbitalWeapon1MissileBase,
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
