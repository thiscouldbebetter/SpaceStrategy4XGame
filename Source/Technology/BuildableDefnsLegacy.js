"use strict";
class BuildableDefnsLegacy {
    constructor(mapCellSizeInPixels) {
        var fontHeight = mapCellSizeInPixels.y / 2;
        var terrains = MapTerrain.Instances(mapCellSizeInPixels);
        var terrainNamesNone = new Array();
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
        var effects = BuildableEffect.Instances();
        var effectNone = effects.None;
        var effectTodo = effects.ThrowError;
        var effectResourcesAdd = (resourcesToAdd) => {
            var effect = new BuildableEffect("ResourcesAdd", 0, // order
            (uwpe) => {
                var planet = uwpe.entity;
                planet.resourcesPerTurnAdd(resourcesToAdd);
            });
            return effect;
        };
        var facilityOrbital = (name, visual, industryToBuildAmount) => new BuildableDefn(name, false, // isItem
        terrainNamesOrbital, mapCellSizeInPixels, visual, industryToBuildAmount, effectNone, null // entityModifyOnBuild
        );
        var facilitySurfaceUsable = (name, visual, industryToBuildAmount, effect) => new BuildableDefn(name, false, // isItem
        terrainNamesSurfaceUsable, mapCellSizeInPixels, visual, industryToBuildAmount, effect, null // entityModifyOnBuild
        );
        var facilitySurfaceAnywhere = (name, visual, industryToBuildAmount, effect) => new BuildableDefn(name, false, // isItem
        terrainNamesSurface, mapCellSizeInPixels, visual, industryToBuildAmount, effect, null // entityModifyOnBuild
        );
        var planetwideFocus = (name, visual) => new BuildableDefn(name, null, // isItem
        null, // terrainNames,
        mapCellSizeInPixels, visual, null, // industryToBuildAmount,
        effectTodo, null // entityModifyOnBuild
        );
        var shipComponent = (name, visual, industryToBuildAmount) => new BuildableDefn(name, true, // isItem
        terrainNamesShip, mapCellSizeInPixels, visual, industryToBuildAmount, effectTodo, null // entityModifyOnBuild
        );
        // Planet - Orbit.
        this.OrbitalCloaker = facilityOrbital("Orbital Cloak", visualBuild("C", colors.Gray), 40);
        this.OrbitalDocks = facilityOrbital("Orbital Docks", visualBuild("D", colors.Gray), 170);
        this.OrbitalShield1OrbitalShield = facilityOrbital("Orbital Shield", visualBuild("S", colors.Red), 60);
        this.OrbitalShield2OrbitalMegaShield = facilityOrbital("Orbital Mega Shield", visualBuild("S", colors.Blue), 120);
        this.OrbitalShipyard = facilityOrbital("Shipyard", visualBuild("Shipyard", colors.Blue), 120);
        this.OrbitalWeapon1OrbitalMissileBase = facilityOrbital("Orbital Missile Base", visualBuild("Missile Base", colors.Gray), 60);
        this.OrbitalWeapon2ShortRangeOrbitalWhopper = facilityOrbital("Short-Range Orbital Whopper", visualBuild("Short-Range Whopper", colors.Red), 90);
        this.OrbitalWeapon3LongRangeOrbitalWhopper = facilityOrbital("Long-Range Orbital Whopper", visualBuild("Long-Range Whopper", colors.Green), 180);
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
        terrainNamesNone, mapCellSizeInPixels, visualBuild("Hull", colors.Gray), 30, effectNone, // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.ShipHull2Medium = new BuildableDefn("Medium Ship Hull", true, // isItem // Is it, though?
        terrainNamesNone, mapCellSizeInPixels, visualBuild("Hull", colors.Red), 60, effectNone, // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.ShipHull3Large = new BuildableDefn("Large Ship Hull", true, // isItem // Is it, though?
        terrainNamesNone, mapCellSizeInPixels, visualBuild("Hull", colors.Green), 120, effectNone, // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.ShipHull4Enormous = new BuildableDefn("Enormous Ship Hull", true, // isItem // Is it, though?
        terrainNamesNone, mapCellSizeInPixels, visualBuild("Hull", colors.Blue), 240, effectNone, // resourcesPerTurn
        null // entityModifyOnBuild
        );
        // Items.
        var sc = (name, industry) => shipComponent(name, visualBuild(name, colors.Gray), industry);
        this.ShipItemAccutron = sc("Accutron", 60);
        this.ShipItemBackfirer = sc("Backfirer", 60);
        this.ShipItemBrunswikDissipator = sc("Brunswik Dissipator", 100);
        this.ShipItemCannibalizer = sc("Cannibalizer", 20);
        this.ShipItemCloaker = sc("Cloaker", 30);
        this.ShipItemColonizer = sc("Colonizer", 35);
        this.ShipItemContainmentDevice = sc("Containment Device", 15);
        this.ShipItemDisarmer = sc("Disarmer", 30);
        this.ShipItemDisintegrator = sc("Disintegrator", 150);
        this.ShipItemFleetDisperser = sc("Fleet Disperser", 30);
        this.ShipItemGizmogrifier = sc("Gizmogrifier", 30);
        this.ShipItemGravimetricCatapult = sc("Gravimetric Catapult", 16);
        this.ShipItemGravimetricCondensor = sc("Gravimetric Condensor", 30);
        this.ShipItemGravityDistorter = sc("Gravity Distorter", 20);
        this.ShipItemGyroInductor = sc("Gyro-Inductor", 20);
        this.ShipItemHyperfuel = sc("Hyperfuel", 20);
        this.ShipItemHyperswapper = sc("Hyperswapper", 20);
        this.ShipItemIntellectScrambler = sc("Intellect Scrambler", 20);
        this.ShipItemInvasionModule = sc("Invasion Module", 70);
        this.ShipItemInvulnerablizer = sc("Invulnerablizer", 60);
        this.ShipItemLaneBlocker = sc("Lane Blocker", 30);
        this.ShipItemLaneDestabilizer = sc("Lane Destabilizer", 40);
        this.ShipItemLaneEndoscope = sc("Lane Endoscope", 20);
        this.ShipItemLaneMagnetron = sc("Lane Magnetron", 50);
        this.ShipItemMassCondensor = sc("Mass Condensor", 50);
        this.ShipItemMolecularTieDown = sc("Molecular Tie Down", 20);
        this.ShipItemMovingPartExploiter = sc("Moving Part Exploiter", 60);
        this.ShipItemMyrmidonicCarbonizer = sc("Myrmidonic Carbonizer", 70);
        this.ShipItemPhaseBomb = sc("PhaseBomb", 40);
        this.ShipItemPlasmaCoupler = sc("Plasma Coupler", 20);
        this.ShipItemPositronBouncer = sc("Positron Bouncer", 10);
        this.ShipItemRecaller = sc("Recaller", 40);
        this.ShipItemRemoteRepairFacility = sc("Remote Repair Facility", 70);
        this.ShipItemReplenisher = sc("Replenisher", 60);
        this.ShipItemSacrificialOrb = sc("Sacrificial Orb", 20);
        this.ShipItemSelfDestructotron = sc("Self-Destructotron", 50);
        this.ShipItemShieldBlaster = sc("Shield Blaster", 30);
        this.ShipItemSmartBomb = sc("Smart Bomb", 30);
        this.ShipItemSpecialtyBlaster = sc("Specialty Blaster", 30);
        this.ShipItemToroidalBlaster = sc("Toroidal Blaster", 20);
        this.ShipItemTractorBeam = sc("Tractor Beam", 30);
        this.ShipItemXRayMegaglasses = sc("X-Ray Megaglasses", 100);
        // Sensors.
        this.ShipSensor1TonklinFrequencyAnalyzer = shipComponent("Tonklin Frequency Analyzer", visualBuild("Sensors1", colors.Gray), 20);
        this.ShipSensor2SubspacePhaseArray = shipComponent("Subspace Phase Array", visualBuild("Sensors2", colors.Gray), 40);
        this.ShipSensor3AuralCloudConstrictor = shipComponent("Aural Cloud Constrictor", visualBuild("Sensors3", colors.Gray), 60);
        this.ShipSensor4HyperwaveTympanum = shipComponent("Hyperwave Tympanum", visualBuild("Sensors4", colors.Gray), 80);
        this.ShipSensor5MurgatroydsKnower = shipComponent("Murgatroyd's Knower", visualBuild("Sensors5", colors.Gray), 100);
        this.ShipSensor6NanowaveDecouplingNet = shipComponent("Nanowave Decoupling Net", visualBuild("Sensors6", colors.Gray), 200);
        // Shields.
        this.ShipShield1IonWrap = shipComponent("Ion Wrap", visualBuild("Shield1", colors.Gray), 10);
        this.ShipShield2ConcussionShield = shipComponent("Concussion Shield", visualBuild("Shield2", colors.Gray), 30);
        this.ShipShield3WaveScatterer = shipComponent("Wave Scatterer", visualBuild("Shield3", colors.Gray), 50);
        this.ShipShield4Deactotron = shipComponent("Deactotron", visualBuild("Shield4", colors.Gray), 50);
        this.ShipShield5HyperwaveNullifier = shipComponent("Hyperwave Nullifier", visualBuild("Shield5", colors.Gray), 100);
        this.ShipShield6Nanoshell = shipComponent("Nanoshell", visualBuild("Shield6", colors.Gray), 200);
        // Starlane Drives.
        this.ShipStarlaneDrive1StarLaneDrive = shipComponent("Star Lane Drive", visualBuild("StarDrive", colors.Gray), 30);
        this.ShipStarlaneDrive2StarLaneHyperdrive = shipComponent("Star Lane Hyperdrive", visualBuild("StarDrive2", colors.Gray), 30);
        // Weapons.
        this.ShipWeapon01MassBarrageGun = shipComponent("Mass Barrage Gun", visualBuild("Weapon", colors.Gray), 10);
        this.ShipWeapon02FourierMissiles = shipComponent("Fourier Missiles", visualBuild("Weapon", colors.Gray), 20);
        this.ShipWeapon03QuantumSingularityLauncher = shipComponent("Quantum Singularity Launcher", visualBuild("Weapon", colors.Gray), 30);
        this.ShipWeapon04MolecularDisassociator = shipComponent("Molecular Disassociator", visualBuild("Weapon", colors.Gray), 40);
        this.ShipWeapon05ElectromagneticPulser = shipComponent("Electromagnetic Pulser", visualBuild("Weapon", colors.Gray), 50);
        this.ShipWeapon06Plasmatron = shipComponent("Plasmatron", visualBuild("Weapon", colors.Gray), 50);
        this.ShipWeapon07Ueberlaser = shipComponent("Ueberlaser", visualBuild("Weapon", colors.Gray), 70);
        this.ShipWeapon08FergnatzLens = shipComponent("Fergnatz Lens", visualBuild("Weapon", colors.Gray), 50);
        this.ShipWeapon09HypersphereDriver = shipComponent("Hypersphere Driver", visualBuild("Weapon", colors.Gray), 100);
        this.ShipWeapon10Nanomanipulator = shipComponent("Nanomanipulator", visualBuild("Weapon", colors.Gray), 100);
        // Surface.
        this.SurfaceArtificialHypdroponifer = facilitySurfaceUsable("Artificial Hydroponifier", visualBuild("Artificial Hydroponifier", colors.Gray), 100, null);
        this.SurfaceAutomation = facilitySurfaceUsable("Automation", visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceCloaker = facilitySurfaceUsable("Surface Cloak", visualBuild("Cloak", colors.Gray), 120, null);
        this.SurfaceCloningPlant = facilitySurfaceUsable("Cloning Plant", visualBuild("Cloning Plant", colors.Gray), 250, null);
        this.SurfaceEngineeringRetreat = facilitySurfaceUsable("Engineering Retreat", visualBuild("Engineering Retreat", colors.Gray), 80, null);
        this.SurfaceFertilizationPlant = facilitySurfaceUsable("Fertilization Plant", visualBuild("Fertilization Plant", colors.Gray), 200, null);
        this.SurfaceHabitat = facilitySurfaceUsable("Habitat", visualBuild("Habitat", colors.Gray), 160, null);
        this.SurfaceHyperpowerPlant = facilitySurfaceUsable("Hyperpower Plant", visualBuild("Hyperpower Plant", colors.Gray), 200, null);
        this.SurfaceIndustrialMegafacility = facilitySurfaceUsable("Industrial Megafacility", visualBuild("Industrial Megafacility", colors.Gray), 110, null);
        this.SurfaceInternet = facilitySurfaceUsable("Internet", visualBuild("Internet", colors.Gray), 250, null);
        this.SurfaceLogicFactory = facilitySurfaceUsable("Logic Factory", visualBuild("Logic Factory", colors.Gray), 80, null);
        this.SurfaceMetroplex = facilitySurfaceUsable("Metroplex", visualBuild("Metroplex", colors.Gray), 200, null);
        this.SurfaceObservationInstallation = facilitySurfaceUsable("Observation Installation", visualBuild("Observation Installation", colors.Gray), 40, null);
        this.SurfacePlanetaryTractorBeam = facilitySurfaceUsable("Tractor Beam", visualBuild("Tractor Beam", colors.Gray), 50, null);
        this.SurfaceResearchCampus = facilitySurfaceUsable("Research Campus", visualBuild("Research Campus", colors.Gray), 160, null);
        this.SurfaceShield1SurfaceShield = facilitySurfaceUsable("Surface Shield", visualBuild("Surface Shield", colors.Gray), 100, null);
        this.SurfaceShield2SurfaceMegaShield = facilitySurfaceUsable("Surface Mega-Shield", visualBuild("Surface Mega-Shield", colors.Gray), 180, null);
        this.SurfaceTerraforming = facilitySurfaceUsable("Terraforming", visualBuild("Terraforming", colors.Gray), 50, null);
        this.SurfaceXenoArchaeologicalDig = facilitySurfaceUsable("Xeno Archaeological Dig", visualBuild("Xeno Archaeological Dig", colors.Gray), 50, null);
        // Default tech.
        this.SurfaceAgriplot = facilitySurfaceUsable("Agriplot", visualBuild("Agriplot", colors.GreenDark), 30, effectResourcesAdd([new Resource("Prosperity", 1)]));
        this.SurfaceColonyHub = facilitySurfaceUsable("Colony Hub", visualBuild("Hub", colors.Gray), 30, effectResourcesAdd([new Resource("Industry", 1), new Resource("Prosperity", 1)]));
        this.SurfaceFactory = facilitySurfaceUsable("Factory", visualBuild("Factory", colors.Red), 30, effectResourcesAdd([new Resource("Industry", 1)]));
        this.SurfaceLaboratory = facilitySurfaceUsable("Laboratory", visualBuild("Laboratory", colors.Blue), 50, effectResourcesAdd([new Resource("Research", 1)]));
        this.SurfaceTransportTubes = facilitySurfaceAnywhere("Transport Tubes", visualBuild("Transport", colors.GrayDark), 10, effectNone);
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
