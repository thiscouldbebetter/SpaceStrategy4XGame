"use strict";
class BuildableDefnsLegacy {
    constructor(mapCellSizeInPixels) {
        var fontHeight = mapCellSizeInPixels.y / 3;
        var canBeBuiltNever = (m, p) => false;
        var terrains = MapTerrain.Instances(mapCellSizeInPixels);
        var terrainNamesOrbital = [terrains.Orbit.name];
        var canBeBuiltInOrbit = (m, p) => terrainNamesOrbital.indexOf(m.terrainAtPosInCells(p).name) >= 0;
        var terrainNamesSurface = terrains._Surface.map(x => x.name);
        var canBeBuiltOnSurfaceAnywhere = (m, p) => terrainNamesSurface.indexOf(m.terrainAtPosInCells(p).name) >= 0;
        var terrainNamesSurfaceUsable = terrainNamesSurface.filter(x => x != terrains.SurfaceUnusable.name);
        var canBeBuiltOnSurfaceUsable = (m, p) => terrainNamesSurfaceUsable.indexOf(m.terrainAtPosInCells(p).name) >= 0;
        var colors = Color.Instances();
        var visualBuild = (labelText, color) => {
            return new VisualGroup([
                new VisualRectangle(mapCellSizeInPixels, color, null, null),
                VisualText.fromTextImmediateFontAndColor(labelText, FontNameAndHeight.fromHeightInPixels(fontHeight), colors.White)
            ]);
        };
        var effects = BuildableEffect.Instances();
        var effectNone = effects.None;
        var effectTodo = effects.ThrowError;
        var effectResourcesAdd = (resourcesToAdd) => {
            var effect = new BuildableEffect("ResourcesAdd", 0, // order
            (uwpe) => {
                var planet = uwpe.place.planet;
                planet.resourcesPerTurnAdd(resourcesToAdd);
            });
            return effect;
        };
        var facilityOrbital = (name, visual, industryToBuildAmount) => new BuildableDefn(name, false, // isItem
        canBeBuiltInOrbit, mapCellSizeInPixels, visual, industryToBuildAmount, effectNone, null, // effectsAvailableToUse
        null, // categories
        null, // entityProperties
        null // entityModifyOnBuild
        );
        var facilitySurfaceUsable = (name, visual, industryToBuildAmount, effect) => new BuildableDefn(name, false, // isItem
        canBeBuiltOnSurfaceUsable, mapCellSizeInPixels, visual, industryToBuildAmount, effect, null, // effectsAvailableToUse
        null, // categories
        null, // entityProperties
        null // entityModifyOnBuild
        );
        var facilitySurfaceAnywhere = (name, visual, industryToBuildAmount, effect) => new BuildableDefn(name, false, // isItem
        canBeBuiltOnSurfaceAnywhere, mapCellSizeInPixels, visual, industryToBuildAmount, effect, null, // effectsAvailableToUse
        null, // categories
        null, // entityProperties
        null // entityModifyOnBuild
        );
        var planetwideFocus = (name, visual) => new BuildableDefn(name, null, // isItem
        null, // terrainNames,
        mapCellSizeInPixels, visual, null, // industryToBuildAmount,
        effectTodo, null, // effectsAvailableToUse
        null, // categories
        null, // entityProperties
        null // entityModifyOnBuild
        );
        var shipComponent = (name, visual, industryToBuildAmount, category, deviceDefn) => new BuildableDefn(name, true, // isItem
        canBeBuiltNever, mapCellSizeInPixels, visual, industryToBuildAmount, effectTodo, null, // effectsAvailableToUse
        [category], (uwpe) => deviceDefn == null
            ? []
            : [new Device(deviceDefn)], 
        // entityModifyOnBuild
        null);
        var names = BuildableDefnsLegacyNames.Instance;
        // Planet - Orbit.
        this.OrbitalCloaker = facilityOrbital(names.OrbitalCloaker, visualBuild("C", colors.Gray), 40);
        this.OrbitalDocks = facilityOrbital(names.OrbitalDocks, visualBuild("D", colors.Gray), 170);
        this.OrbitalShield1OrbitalShield = facilityOrbital(names.OrbitalShield1OrbitalShield, visualBuild("S", colors.Red), 60);
        this.OrbitalShield2OrbitalMegaShield = facilityOrbital(names.OrbitalShield2OrbitalMegaShield, visualBuild("S", colors.Blue), 120);
        var buildShip = (uwpe) => {
            var universe = uwpe.universe;
            var displaySize = universe.display.sizeInPixels;
            var venueLayout = universe.venuePrev();
            var planet = venueLayout.modelParent;
            var dialogSize = universe.display.sizeInPixels.clone().half();
            var buildableEntityInProgress = planet.buildableEntityInProgress(universe);
            var cannotBuildAcknowledge = () => universe.venuePrevJumpTo();
            if (buildableEntityInProgress != null) {
                universe.venueJumpTo(VenueMessage.fromTextAcknowledgeAndSize("Already building something.", cannotBuildAcknowledge, dialogSize));
            }
            else if (planet.populationIdle(universe) == 0) {
                universe.venueJumpTo(VenueMessage.fromTextAcknowledgeAndSize("No free population yet.", cannotBuildAcknowledge, dialogSize));
            }
            else if (planet.cellPositionsAvailableToOccupyInOrbit(universe).length == 0) {
                universe.venueJumpTo(VenueMessage.fromTextAcknowledgeAndSize("No free cells in orbit.", cannotBuildAcknowledge, dialogSize));
            }
            else {
                var shipBuilder = new ShipBuilder();
                universe.venueCurrentRemove();
                var shipBuilderAsControl = shipBuilder.toControl(universe, displaySize, universe.venueCurrent());
                var shipBuilderAsVenue = shipBuilderAsControl.toVenue();
                universe.venueTransitionTo(shipBuilderAsVenue);
            }
        };
        var effectBuildShip = new BuildableEffect("Build Ship", 0, // orderToApplyIn
        (uwpe) => buildShip(uwpe));
        this.OrbitalShipyard = new BuildableDefn(names.OrbitalShipyard, false, // isItem
        canBeBuiltInOrbit, mapCellSizeInPixels, visualBuild(names.OrbitalShipyard, colors.Blue), 120, // industryToBuild
        effectNone, // effectPerRound
        [effectBuildShip], // effectsAvailableToUse
        null, // categories
        null, // entityProperties
        null // entityModifyOnBuild
        );
        this.OrbitalWeapon1OrbitalMissileBase = facilityOrbital(names.OrbitalWeapon1OrbitalMissileBase, visualBuild(names.OrbitalWeapon1OrbitalMissileBase, colors.Gray), 60);
        this.OrbitalWeapon2ShortRangeOrbitalWhopper = facilityOrbital(names.OrbitalWeapon2ShortRangeOrbitalWhopper, visualBuild(names.OrbitalWeapon2ShortRangeOrbitalWhopper, colors.Red), 90);
        this.OrbitalWeapon3LongRangeOrbitalWhopper = facilityOrbital(names.OrbitalWeapon3LongRangeOrbitalWhopper, visualBuild("Long-Range Whopper", colors.Green), 180);
        // Planetwide.
        this.PlanetwideFocusAlienHospitality = planetwideFocus(names.PlanetwideFocusAlienHospitality, visualBuild(names.PlanetwideFocusAlienHospitality, colors.Orange));
        this.PlanetwideFocusEndlessParty = planetwideFocus(names.PlanetwideFocusEndlessParty, visualBuild(names.PlanetwideFocusEndlessParty, colors.Green));
        this.PlanetwideFocusScientistTakeover = planetwideFocus(names.PlanetwideFocusScientistTakeover, visualBuild(names.PlanetwideFocusScientistTakeover, colors.Blue));
        this.PlanetwideLushGrowthBomb = planetwideFocus(names.PlanetwideLushGrowthBomb, visualBuild(names.PlanetwideLushGrowthBomb, colors.Violet) // todo - 200
        );
        // Ships.
        var categories = BuildableCategory.Instances();
        // Drives.
        var categoryShipDrive = categories.ShipDrive;
        var deviceDefnDrive = new DeviceDefn("Drive", false, // isActive
        false, // needsTarget
        ["Drive"], // categoryNames
        (uwpe) => // init
         { }, (uwpe) => // updateForRound
         {
            // todo
        }, (uwpe) => // use
         {
            // todo
        });
        this.ShipDrive1TonklinMotor = shipComponent(names.ShipDrive1TonklinMotor, visualBuild("Drive", colors.Gray), 10, categoryShipDrive, deviceDefnDrive);
        this.ShipDrive2IonBanger = shipComponent(names.ShipDrive2IonBanger, visualBuild("Drive", colors.Red), 30, categoryShipDrive, deviceDefnDrive);
        this.ShipDrive3GravitonProjector = shipComponent(names.ShipDrive3GravitonProjector, visualBuild("Drive", colors.Green), 40, categoryShipDrive, deviceDefnDrive);
        this.ShipDrive4InertiaNegator = shipComponent(names.ShipDrive4InertiaNegator, visualBuild("Drive", colors.Red), 20, categoryShipDrive, deviceDefnDrive);
        this.ShipDrive5NanowaveSpaceBender = shipComponent(names.ShipDrive5NanowaveSpaceBender, visualBuild("Drive", colors.Red), 80, categoryShipDrive, deviceDefnDrive);
        // Generators.
        var categoryShipGenerator = categories.ShipGenerator;
        this.ShipGenerator1ProtonShaver = shipComponent(names.ShipGenerator1ProtonShaver, visualBuild("Generator", colors.Gray), 20, categoryShipGenerator, null // deviceDefn
        );
        this.ShipGenerator2SubatomicScoop = shipComponent(names.ShipGenerator2SubatomicScoop, visualBuild("Generator", colors.Red), 35, categoryShipGenerator, null // deviceDefn
        );
        this.ShipGenerator3QuarkExpress = shipComponent(names.ShipGenerator3QuarkExpress, visualBuild("Generator", colors.Green), 60, categoryShipGenerator, null // deviceDefn
        );
        this.ShipGenerator4VanKreegHypersplicer = shipComponent(names.ShipGenerator4VanKreegHypersplicer, visualBuild("Generator", colors.Blue), 80, categoryShipGenerator, null // deviceDefn
        );
        this.ShipGenerator5Nanotwirler = shipComponent(names.ShipGenerator5Nanotwirler, visualBuild("Generator", colors.Violet), 100, categoryShipGenerator, null // deviceDefn
        );
        // Hulls.
        var shipHull = (name, color, industryToBuild) => {
            return new BuildableDefn(name, false, // isItem
            canBeBuiltNever, mapCellSizeInPixels, visualBuild("Hull", color), industryToBuild, effectNone, null, // effectsAvailableToUse
            null, // categories
            null, // entityProperties
            null // entityModifyOnBuild
            );
        };
        this.ShipHull1Small = shipHull(names.ShipHull1Small, colors.Gray, 30);
        this.ShipHull2Medium = shipHull(names.ShipHull2Medium, colors.Red, 60);
        this.ShipHull3Large = shipHull(names.ShipHull3Large, colors.Green, 120);
        this.ShipHull4Enormous = shipHull(names.ShipHull4Enormous, colors.Blue, 240);
        // Items.
        var sc = (name, industry) => shipComponent(name, visualBuild(name, colors.Gray), industry, categories.ShipItem, null);
        this.ShipItemAccutron = sc(names.ShipItemAccutron, 60);
        this.ShipItemBackfirer = sc(names.ShipItemBackfirer, 60);
        this.ShipItemBrunswikDissipator = sc(names.ShipItemBrunswikDissipator, 100);
        this.ShipItemCannibalizer = sc(names.ShipItemCannibalizer, 20);
        this.ShipItemCloaker = sc(names.ShipItemCloaker, 30);
        this.ShipItemColonizer = sc(names.ShipItemColonizer, 35);
        this.ShipItemContainmentDevice = sc(names.ShipItemContainmentDevice, 15);
        this.ShipItemDisarmer = sc(names.ShipItemDisarmer, 30);
        this.ShipItemDisintegrator = sc(names.ShipItemDisintegrator, 150);
        this.ShipItemFleetDisperser = sc(names.ShipItemFleetDisperser, 30);
        this.ShipItemGizmogrifier = sc(names.ShipItemGizmogrifier, 30);
        this.ShipItemGravimetricCatapult = sc(names.ShipItemGravimetricCatapult, 16);
        this.ShipItemGravimetricCondensor = sc(names.ShipItemGravimetricCondensor, 30);
        this.ShipItemGravityDistorter = sc(names.ShipItemGravityDistorter, 20);
        this.ShipItemGyroInductor = sc(names.ShipItemGyroInductor, 20);
        this.ShipItemHyperfuel = sc(names.ShipItemHyperfuel, 20);
        this.ShipItemHyperswapper = sc(names.ShipItemHyperswapper, 20);
        this.ShipItemIntellectScrambler = sc(names.ShipItemIntellectScrambler, 20);
        this.ShipItemInvasionModule = sc(names.ShipItemInvasionModule, 70);
        this.ShipItemInvulnerablizer = sc(names.ShipItemInvulnerablizer, 60);
        this.ShipItemLaneBlocker = sc(names.ShipItemLaneBlocker, 30);
        this.ShipItemLaneDestabilizer = sc(names.ShipItemLaneDestabilizer, 40);
        this.ShipItemLaneEndoscope = sc(names.ShipItemLaneEndoscope, 20);
        this.ShipItemLaneMagnetron = sc(names.ShipItemLaneMagnetron, 50);
        this.ShipItemMassCondensor = sc(names.ShipItemMassCondensor, 50);
        this.ShipItemMolecularTieDown = sc(names.ShipItemMolecularTieDown, 20);
        this.ShipItemMovingPartExploiter = sc(names.ShipItemMovingPartExploiter, 60);
        this.ShipItemMyrmidonicCarbonizer = sc(names.ShipItemMyrmidonicCarbonizer, 70);
        this.ShipItemPhaseBomb = sc(names.ShipItemPhaseBomb, 40);
        this.ShipItemPlasmaCoupler = sc(names.ShipItemPlasmaCoupler, 20);
        this.ShipItemPositronBouncer = sc(names.ShipItemPositronBouncer, 10);
        this.ShipItemRecaller = sc(names.ShipItemRecaller, 40);
        this.ShipItemRemoteRepairFacility = sc(names.ShipItemRemoteRepairFacility, 70);
        this.ShipItemReplenisher = sc(names.ShipItemReplenisher, 60);
        this.ShipItemSacrificialOrb = sc(names.ShipItemSacrificialOrb, 20);
        this.ShipItemSelfDestructotron = sc(names.ShipItemSelfDestructotron, 50);
        this.ShipItemShieldBlaster = sc(names.ShipItemShieldBlaster, 30);
        this.ShipItemSmartBomb = sc(names.ShipItemSmartBomb, 30);
        this.ShipItemSpecialtyBlaster = sc(names.ShipItemSpecialtyBlaster, 30);
        this.ShipItemToroidalBlaster = sc(names.ShipItemToroidalBlaster, 20);
        this.ShipItemTractorBeam = sc(names.ShipItemTractorBeam, 30);
        this.ShipItemXRayMegaglasses = sc(names.ShipItemXRayMegaglasses, 100);
        // Sensors.
        var categoryShipSensor = categories.ShipSensor;
        this.ShipSensor1TonklinFrequencyAnalyzer = shipComponent(names.ShipSensor1TonklinFrequencyAnalyzer, visualBuild("Sensor1", colors.Gray), 20, categoryShipSensor, null);
        this.ShipSensor2SubspacePhaseArray = shipComponent(names.ShipSensor2SubspacePhaseArray, visualBuild("Sensor2", colors.Gray), 40, categoryShipSensor, null);
        this.ShipSensor3AuralCloudConstrictor = shipComponent(names.ShipSensor3AuralCloudConstrictor, visualBuild("Sensor3", colors.Gray), 60, categoryShipSensor, null);
        this.ShipSensor4HyperwaveTympanum = shipComponent(names.ShipSensor4HyperwaveTympanum, visualBuild("Sensor4", colors.Gray), 80, categoryShipSensor, null);
        this.ShipSensor5MurgatroydsKnower = shipComponent(names.ShipSensor5MurgatroydsKnower, visualBuild("Sensor5", colors.Gray), 100, categoryShipSensor, null);
        this.ShipSensor6NanowaveDecouplingNet = shipComponent(names.ShipSensor6NanowaveDecouplingNet, visualBuild("Sensor6", colors.Gray), 200, categoryShipSensor, null);
        // Shields.
        var categoryShipShield = categories.ShipShield;
        this.ShipShield1IonWrap = shipComponent(names.ShipShield1IonWrap, visualBuild("Shield1", colors.Gray), 10, categoryShipShield, null);
        this.ShipShield2ConcussionShield = shipComponent(names.ShipShield2ConcussionShield, visualBuild("Shield2", colors.Gray), 30, categoryShipShield, null);
        this.ShipShield3WaveScatterer = shipComponent(names.ShipShield3WaveScatterer, visualBuild("Shield3", colors.Gray), 50, categoryShipShield, null);
        this.ShipShield4Deactotron = shipComponent(names.ShipShield4Deactotron, visualBuild("Shield4", colors.Gray), 50, categoryShipShield, null);
        this.ShipShield5HyperwaveNullifier = shipComponent(names.ShipShield5HyperwaveNullifier, visualBuild("Shield5", colors.Gray), 100, categoryShipShield, null);
        this.ShipShield6Nanoshell = shipComponent(names.ShipShield6Nanoshell, visualBuild("Shield6", colors.Gray), 200, categoryShipShield, null);
        // Starlane Drives.
        var categoryShipStarlaneDrive = categories.ShipStarlaneDrive;
        this.ShipStarlaneDrive1StarLaneDrive = shipComponent(names.ShipStarlaneDrive1StarLaneDrive, visualBuild("StarDrive", colors.Gray), 30, categoryShipStarlaneDrive, null);
        this.ShipStarlaneDrive2StarLaneHyperdrive = shipComponent(names.ShipStarlaneDrive2StarLaneHyperdrive, visualBuild("StarDrive2", colors.Gray), 30, categoryShipStarlaneDrive, null);
        // Weapons.
        var categoryShipWeapon = categories.ShipWeapon;
        var deviceDefnWeapon = (name, usesPerRound, energyPerUse, range, damage) => new DeviceDefn(name, true, // isActive
        true, // needsTarget
        [categoryShipWeapon.name], // categoryNames
        (uwpe) => // init
         {
            // todo
        }, (uwpe) => // updateForRound
         {
            // todo
        }, (uwpe) => // use
         {
            var shipFiring = uwpe.entity;
            var entityTarget = uwpe.entity2;
            var pos = shipFiring.locatable().loc.pos.clone();
            var projectileDefn = ProjectileDefn.Instances().Default;
            var projectile = new Projectile(shipFiring.name + "_" + Projectile.name, projectileDefn, pos, shipFiring, entityTarget);
            var universe = uwpe.universe;
            var venue = universe.venueCurrent();
            var starsystem = venue.starsystem;
            starsystem.entityToSpawnAdd(projectile);
        });
        this.ShipWeapon01MassBarrageGun = shipComponent(names.ShipWeapon01MassBarrageGun, visualBuild("Weapon", colors.Gray), 10, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon01MassBarrageGun, 1, 1, 100, 1));
        this.ShipWeapon02FourierMissiles = shipComponent(names.ShipWeapon02FourierMissiles, visualBuild("Weapon", colors.Gray), 20, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon02FourierMissiles, 1, 1, 100, 1));
        this.ShipWeapon03QuantumSingularityLauncher = shipComponent(names.ShipWeapon03QuantumSingularityLauncher, visualBuild("Weapon", colors.Gray), 30, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon03QuantumSingularityLauncher, 1, 1, 100, 1));
        this.ShipWeapon04MolecularDisassociator = shipComponent(names.ShipWeapon04MolecularDisassociator, visualBuild("Weapon", colors.Gray), 40, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon04MolecularDisassociator, 1, 1, 100, 1));
        this.ShipWeapon05ElectromagneticPulser = shipComponent(names.ShipWeapon05ElectromagneticPulser, visualBuild("Weapon", colors.Gray), 50, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon05ElectromagneticPulser, 1, 1, 100, 1));
        this.ShipWeapon06Plasmatron = shipComponent(names.ShipWeapon06Plasmatron, visualBuild("Weapon", colors.Gray), 50, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon06Plasmatron, 1, 1, 100, 1));
        this.ShipWeapon07Ueberlaser = shipComponent(names.ShipWeapon07Ueberlaser, visualBuild("Weapon", colors.Gray), 70, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon07Ueberlaser, 1, 1, 100, 1));
        this.ShipWeapon08FergnatzLens = shipComponent(names.ShipWeapon08FergnatzLens, visualBuild("Weapon", colors.Gray), 50, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon08FergnatzLens, 1, 1, 100, 1));
        this.ShipWeapon09HypersphereDriver = shipComponent(names.ShipWeapon09HypersphereDriver, visualBuild("Weapon", colors.Gray), 100, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon09HypersphereDriver, 1, 1, 100, 1));
        this.ShipWeapon10Nanomanipulator = shipComponent(names.ShipWeapon10Nanomanipulator, visualBuild("Weapon", colors.Gray), 100, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon10Nanomanipulator, 1, 1, 100, 1));
        // Surface.
        this.SurfaceArtificialHydroponifier = facilitySurfaceUsable(names.SurfaceArtificialHydroponifier, visualBuild("Artificial Hydroponifier", colors.Gray), 100, null);
        this.SurfaceAutomation = facilitySurfaceUsable(names.SurfaceAutomation, visualBuild("todo", colors.Gray), 9999, null);
        this.SurfaceCloaker = facilitySurfaceUsable(names.SurfaceCloaker, visualBuild("Cloak", colors.Gray), 120, null);
        this.SurfaceCloningPlant = facilitySurfaceUsable(names.SurfaceCloningPlant, visualBuild("Cloning Plant", colors.Gray), 250, null);
        this.SurfaceEngineeringRetreat = facilitySurfaceUsable(names.SurfaceEngineeringRetreat, visualBuild("Engineering Retreat", colors.Gray), 80, null);
        this.SurfaceFertilizationPlant = facilitySurfaceUsable(names.SurfaceFertilizationPlant, visualBuild("Fertilization Plant", colors.Gray), 200, null);
        this.SurfaceHabitat = facilitySurfaceUsable(names.SurfaceHabitat, visualBuild("Habitat", colors.Gray), 160, null);
        this.SurfaceHyperpowerPlant = facilitySurfaceUsable(names.SurfaceHyperpowerPlant, visualBuild("Hyperpower Plant", colors.Gray), 200, null);
        this.SurfaceIndustrialMegafacility = facilitySurfaceUsable(names.SurfaceIndustrialMegafacility, visualBuild("Industrial Megafacility", colors.Gray), 110, null);
        this.SurfaceInternet = facilitySurfaceUsable(names.SurfaceInternet, visualBuild("Internet", colors.Gray), 250, null);
        this.SurfaceLogicFactory = facilitySurfaceUsable(names.SurfaceLogicFactory, visualBuild("Logic Factory", colors.Gray), 80, null);
        this.SurfaceMetroplex = facilitySurfaceUsable(names.SurfaceMetroplex, visualBuild("Metroplex", colors.Gray), 200, null);
        this.SurfaceObservationInstallation = facilitySurfaceUsable(names.SurfaceObservationInstallation, visualBuild("Observation Installation", colors.Gray), 40, null);
        this.SurfacePlanetaryTractorBeam = facilitySurfaceUsable(names.SurfacePlanetaryTractorBeam, visualBuild("Tractor Beam", colors.Gray), 50, null);
        this.SurfaceResearchCampus = facilitySurfaceUsable(names.SurfaceResearchCampus, visualBuild("Research Campus", colors.Gray), 160, null);
        this.SurfaceShield1SurfaceShield = facilitySurfaceUsable(names.SurfaceShield1SurfaceShield, visualBuild("Surface Shield", colors.Gray), 100, null);
        this.SurfaceShield2SurfaceMegaShield = facilitySurfaceUsable(names.SurfaceShield2SurfaceMegaShield, visualBuild("Surface Mega-Shield", colors.Gray), 180, null);
        this.SurfaceTerraforming = facilitySurfaceUsable(names.SurfaceTerraforming, visualBuild("Terraforming", colors.Gray), 50, null);
        this.SurfaceXenoArchaeologicalDig = new BuildableDefn(names.SurfaceXenoArchaeologicalDig, false, // isItem
        (m, p) => {
            //var cellAtPos = m.cellAtPosInCells(p);
            return false; // todo - Build only on ruins.
        }, mapCellSizeInPixels, visualBuild(names.SurfaceXenoArchaeologicalDig, colors.Gray), 50, effectNone, null, // effectsAvailableToUse
        null, // categories
        null, // entityProperties
        null // entityModifyOnBuild
        );
        // Default tech.
        this.SurfaceAgriplot = facilitySurfaceUsable(names.SurfaceAgriplot, visualBuild(names.SurfaceAgriplot, colors.GreenDark), 30, effectResourcesAdd([new Resource("Prosperity", 1)]));
        this.SurfaceColonyHub = new BuildableDefn(names.SurfaceColonyHub, false, // isItem
        canBeBuiltNever, mapCellSizeInPixels, visualBuild("Hub", colors.Gray), 30, effectResourcesAdd([new Resource("Industry", 1), new Resource("Prosperity", 1)]), null, // effectsAvailableToUse
        null, // categories
        null, // entityProperties
        null // entityModifyOnBuild
        );
        this.SurfaceFactory = facilitySurfaceUsable(names.SurfaceFactory, visualBuild(names.SurfaceFactory, colors.Red), 30, effectResourcesAdd([new Resource("Industry", 1)]));
        this.SurfaceLaboratory = facilitySurfaceUsable(names.SurfaceLaboratory, visualBuild(names.SurfaceLaboratory, colors.Blue), 50, effectResourcesAdd([new Resource("Research", 1)]));
        this.SurfaceTransportTubes = facilitySurfaceAnywhere(names.SurfaceTransportTubes, visualBuild("Transport", colors.GrayDark), 10, effectNone);
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
                this.SurfaceArtificialHydroponifier,
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
    static Instance(mapCellSizeInPixels) {
        if (BuildableDefnsLegacy._instance == null) {
            BuildableDefnsLegacy._instance = new BuildableDefnsLegacy(mapCellSizeInPixels);
        }
        return BuildableDefnsLegacy._instance;
    }
}
class BuildableDefnsLegacyNames {
    constructor() {
        this.OrbitalCloaker = "Orbital Cloaker";
        this.OrbitalDocks = "Orbital Docks";
        this.OrbitalShield1OrbitalShield = "Orbital Shield";
        this.OrbitalShield2OrbitalMegaShield = "Orbital Mega-Shield";
        this.OrbitalShipyard = "Shipyard";
        this.OrbitalWeapon1OrbitalMissileBase = "Orbital Missile Base";
        this.OrbitalWeapon2ShortRangeOrbitalWhopper = "Short-Range Orbital Whopper";
        this.OrbitalWeapon3LongRangeOrbitalWhopper = "Long-Range Orbital Whopper";
        this.PlanetwideFocusAlienHospitality = "Alien Hospitality";
        this.PlanetwideFocusEndlessParty = "Endless Party";
        this.PlanetwideFocusScientistTakeover = "Scientist Takeover";
        this.PlanetwideLushGrowthBomb = "Lush Growth Bomb";
        this.ShipDrive1TonklinMotor = "Tonklin Motor";
        this.ShipDrive2IonBanger = "Ion Banger";
        this.ShipDrive3GravitonProjector = "Graviton Projector";
        this.ShipDrive4InertiaNegator = "Inertia Negator";
        this.ShipDrive5NanowaveSpaceBender = "Nanowave Space Bender";
        this.ShipGenerator1ProtonShaver = "Proton Shaver";
        this.ShipGenerator2SubatomicScoop = "Subatomic Scoop";
        this.ShipGenerator3QuarkExpress = "Quark Express";
        this.ShipGenerator4VanKreegHypersplicer = "Van Kreeg Hypersplicer";
        this.ShipGenerator5Nanotwirler = "Nanotwirler";
        this.ShipHull1Small = "Small Ship Hull";
        this.ShipHull2Medium = "Medium Ship Hull";
        this.ShipHull3Large = "Large Ship Hull";
        this.ShipHull4Enormous = "Enormous Ship Hull";
        this.ShipItemAccutron = "Accutron";
        this.ShipItemBackfirer = "Backfirer";
        this.ShipItemBrunswikDissipator = "Brunswik Dissipator";
        this.ShipItemCannibalizer = "Cannibalizer";
        this.ShipItemCloaker = "Cloaker";
        this.ShipItemColonizer = "Colonizer";
        this.ShipItemContainmentDevice = "Containment Device";
        this.ShipItemDisarmer = "Disarmer";
        this.ShipItemDisintegrator = "Disintegrator";
        this.ShipItemFleetDisperser = "Fleet Disperser";
        this.ShipItemGizmogrifier = "Gizmogrifier";
        this.ShipItemGravimetricCatapult = "Gravimetric Catapult";
        this.ShipItemGravimetricCondensor = "Gravimetric Condensor";
        this.ShipItemGravityDistorter = "Gravity Distorter";
        this.ShipItemGyroInductor = "Gyro-Inductor";
        this.ShipItemHyperfuel = "Hyperfuel";
        this.ShipItemHyperswapper = "Hyperswapper";
        this.ShipItemIntellectScrambler = "Intellect Scrambler";
        this.ShipItemInvasionModule = "Invasion Module";
        this.ShipItemInvulnerablizer = "Invulerablizer";
        this.ShipItemLaneBlocker = "Lane Blocker";
        this.ShipItemLaneDestabilizer = "Lane Destabilizer";
        this.ShipItemLaneEndoscope = "Lane Endoscope";
        this.ShipItemLaneMagnetron = "Lane Magnetron";
        this.ShipItemMassCondensor = "Mass Condensor";
        this.ShipItemMolecularTieDown = "Molecular Tie-Down";
        this.ShipItemMovingPartExploiter = "Moving Part Exploiter";
        this.ShipItemMyrmidonicCarbonizer = "Myrmidonic Carbonizer";
        this.ShipItemPhaseBomb = "Phase Bomb";
        this.ShipItemPlasmaCoupler = "Plasma Coupler";
        this.ShipItemPositronBouncer = "Positron Bouncer";
        this.ShipItemRecaller = "Recaller";
        this.ShipItemRemoteRepairFacility = "Remote Repair Facility";
        this.ShipItemReplenisher = "Replenisher";
        this.ShipItemSacrificialOrb = "Sacrificial Orb";
        this.ShipItemSelfDestructotron = "Destructotron";
        this.ShipItemShieldBlaster = "Shield Blaster";
        this.ShipItemSmartBomb = "Smart Bomb";
        this.ShipItemSpecialtyBlaster = "Specialty Blaster";
        this.ShipItemToroidalBlaster = "Toroidal Blaster";
        this.ShipItemTractorBeam = "Tractor Beam";
        this.ShipItemXRayMegaglasses = "X-Ray Megaglasses";
        this.ShipSensor1TonklinFrequencyAnalyzer = "Tonklin Frequency Analyzer";
        this.ShipSensor2SubspacePhaseArray = "Subspace Phase Array";
        this.ShipSensor3AuralCloudConstrictor = "Aural Cloud Constrictor";
        this.ShipSensor4HyperwaveTympanum = "Hyperwave Tympanum";
        this.ShipSensor5MurgatroydsKnower = "Murgatroyd's Knower";
        this.ShipSensor6NanowaveDecouplingNet = "Nanowave Decoupling Net";
        this.ShipShield1IonWrap = "Ion Wrap";
        this.ShipShield2ConcussionShield = "Concussion Shield";
        this.ShipShield3WaveScatterer = "Wave Scatterer";
        this.ShipShield4Deactotron = "Deactotron";
        this.ShipShield5HyperwaveNullifier = "Hyperwave Nullifier";
        this.ShipShield6Nanoshell = "Nanoshell";
        this.ShipStarlaneDrive1StarLaneDrive = "Star Lane Drive";
        this.ShipStarlaneDrive2StarLaneHyperdrive = "Star Lane Hyperdrive";
        this.ShipWeapon01MassBarrageGun = "Mass Barrage Gun";
        this.ShipWeapon02FourierMissiles = "Fourier Missiles";
        this.ShipWeapon03QuantumSingularityLauncher = "Quantum Singularity Launcher";
        this.ShipWeapon04MolecularDisassociator = "Molecular Disassociator";
        this.ShipWeapon05ElectromagneticPulser = "Electromagnetic Pulser";
        this.ShipWeapon06Plasmatron = "Plasmatron";
        this.ShipWeapon07Ueberlaser = "Ueberlaser";
        this.ShipWeapon08FergnatzLens = "Fergnatz Lens";
        this.ShipWeapon09HypersphereDriver = "Hypersphere Driver";
        this.ShipWeapon10Nanomanipulator = "Nanomanipulator";
        this.SurfaceArtificialHydroponifier = "Artificial Hydroponifier";
        this.SurfaceAutomation = "Automation";
        this.SurfaceCloaker = "Surface Cloaker";
        this.SurfaceCloningPlant = "Cloning Plant";
        this.SurfaceEngineeringRetreat = "Engineering Retreat";
        this.SurfaceFertilizationPlant = "Fertilization Plant";
        this.SurfaceHabitat = "Habitat";
        this.SurfaceHyperpowerPlant = "Hyperpower Plant";
        this.SurfaceIndustrialMegafacility = "Industrial Megafacility";
        this.SurfaceInternet = "Internet";
        this.SurfaceLogicFactory = "Logic Factory";
        this.SurfaceMetroplex = "Metroplex";
        this.SurfaceObservationInstallation = "Observation Installation";
        this.SurfacePlanetaryTractorBeam = "Planetary Tractor Beam";
        this.SurfaceResearchCampus = "Research Campus";
        this.SurfaceShield1SurfaceShield = "Surface Shield";
        this.SurfaceShield2SurfaceMegaShield = "Surface Megashield";
        this.SurfaceTerraforming = "Terraforming";
        this.SurfaceXenoArchaeologicalDig = "Achaeological Dig";
        this.SurfaceAgriplot = "Agriplot";
        this.SurfaceColonyHub = "Colony Hub";
        this.SurfaceFactory = "Factory";
        this.SurfaceLaboratory = "Laboratory";
        this.SurfaceTransportTubes = "Transport Tubes";
    }
}
BuildableDefnsLegacyNames.Instance = new BuildableDefnsLegacyNames();
