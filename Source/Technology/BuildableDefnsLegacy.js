"use strict";
class BuildableDefnsLegacy {
    static Instance(mapCellSizeInPixels) {
        if (BuildableDefnsLegacy._instance == null) {
            BuildableDefnsLegacy._instance = new BuildableDefnsLegacy(mapCellSizeInPixels);
        }
        return BuildableDefnsLegacy._instance;
    }
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
        var terrainNamesSurfaceUnusable = terrainNamesSurface.filter(x => x == terrains.SurfaceUnusable.name);
        var canBeBuiltOnSurfaceUnusable = (m, p) => terrainNamesSurfaceUnusable.indexOf(m.terrainAtPosInCells(p).name) >= 0;
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
        var effectPopulationMaxAdd = (populationMaxToAdd) => {
            var effect = new BuildableEffect("PopulationMaxAdd", 0, // order
            (uwpe) => {
                var planet = uwpe.place.planet;
                planet.populationMaxAdd(populationMaxToAdd);
            });
            return effect;
        };
        var effectResourcesAdd = (resourcesToAdd) => {
            var effect = new BuildableEffect("ResourcesAdd", 0, // order
            (uwpe) => {
                var planet = uwpe.place.planet;
                planet.resourcesThisRoundAdd(resourcesToAdd);
            });
            return effect;
        };
        var effectResourceMultiply = (resourceMultiplier) => {
            var effect = new BuildableEffect("ResourcesMultiply", 0, // order
            (uwpe) => {
                var universe = uwpe.universe;
                var world = uwpe.world;
                var planet = uwpe.place.planet;
                var resourceDefnName = resourceMultiplier.defnName;
                var resourceQuantityBefore = planet.resourceThisRoundByName(universe, world, resourceDefnName).quantity;
                var resourceQuantityToAdd = Math.floor(resourceQuantityBefore);
                var resourceToAdd = new Resource(resourceDefnName, resourceQuantityToAdd);
                planet.resourcesThisRoundAdd([resourceToAdd]);
            });
            return effect;
        };
        var facilityOrbital = (name, visual, industryToBuildAmount, description, categories) => new BuildableDefn(name, false, // isItem
        canBeBuiltInOrbit, mapCellSizeInPixels, visual, industryToBuildAmount, effectNone, null, // effectsAvailableToUse
        categories, null, // entityProperties
        null, // entityModifyOnBuild
        description);
        var facilitySurfaceUsable = (name, visual, industryToBuildAmount, effect, description) => new BuildableDefn(name, false, // isItem
        canBeBuiltOnSurfaceUsable, mapCellSizeInPixels, visual, industryToBuildAmount, effect, null, // effectsAvailableToUse
        null, // categories
        null, // entityProperties
        null, // entityModifyOnBuild
        description);
        var facilitySurfaceUnusable = (name, visual, industryToBuildAmount, effect, description) => new BuildableDefn(name, false, // isItem
        canBeBuiltOnSurfaceUnusable, mapCellSizeInPixels, visual, industryToBuildAmount, effect, null, // effectsAvailableToUse
        null, // categories
        null, // entityProperties
        null, // entityModifyOnBuild
        description);
        var facilitySurfaceAnywhere = (name, visual, industryToBuildAmount, effect, description) => new BuildableDefn(name, false, // isItem
        canBeBuiltOnSurfaceAnywhere, mapCellSizeInPixels, visual, industryToBuildAmount, effect, null, // effectsAvailableToUse
        null, // categories
        null, // entityProperties
        null, // entityModifyOnBuild
        description);
        var planetwideFocus = (name, visual, description) => new BuildableDefn(name, null, // isItem
        null, // terrainNames,
        mapCellSizeInPixels, visual, null, // industryToBuildAmount,
        effectTodo, null, // effectsAvailableToUse
        null, // categories
        null, // entityProperties
        null, // entityModifyOnBuild
        description);
        var shipComponent = (name, visual, industryToBuildAmount, category, deviceDefn, description) => new BuildableDefn(name, true, // isItem
        canBeBuiltNever, mapCellSizeInPixels, visual, industryToBuildAmount, effectTodo, null, // effectsAvailableToUse
        [category], (uwpe) => deviceDefn == null
            ? []
            : [new Device2(deviceDefn)], 
        // entityModifyOnBuild
        null, description);
        var names = BuildableDefnsLegacyNames.Instance;
        // Planet - Orbit.
        var categories = BuildableCategory.Instances();
        var categoryOrbital = categories.Orbital;
        var categoriesOrbital = [categoryOrbital];
        this.OrbitalCloaker = facilityOrbital(names.OrbitalCloaker, visualBuild("C", colors.Gray), 40, "Hides orbital structures from sensors.", categoriesOrbital);
        this.OrbitalDocks = facilityOrbital(names.OrbitalDocks, visualBuild("D", colors.Gray), 170, "Allows ships to be repaired and refitted.", categoriesOrbital);
        var categoriesOrbitalAndShields = [
            categoryOrbital,
            categories.Shield
        ];
        this.OrbitalShield1OrbitalShield = facilityOrbital(names.OrbitalShield1OrbitalShield, visualBuild("S", colors.Red), 60, "Protects orbital structures and prevents others from orbiting.", categoriesOrbitalAndShields);
        this.OrbitalShield2OrbitalMegaShield = facilityOrbital(names.OrbitalShield2OrbitalMegaShield, visualBuild("S", colors.Blue), 120, "A more powerful orbital shield.", categoriesOrbitalAndShields);
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
                var venueLayout = universe.venueCurrent();
                var shipBuilder = new ShipBuilder(venueLayout);
                universe.venueCurrentRemove();
                var shipBuilderAsControl = shipBuilder.toControl(universe, displaySize);
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
        null, // entityModifyOnBuild
        "Allows new ships to be built.");
        this.OrbitalWeapon1OrbitalMissileBase = facilityOrbital(names.OrbitalWeapon1OrbitalMissileBase, visualBuild(names.OrbitalWeapon1OrbitalMissileBase, colors.Gray), 60, "Allows the host planet to attack nearby ships twice per turn.", categoriesOrbital);
        this.OrbitalWeapon2ShortRangeOrbitalWhopper = facilityOrbital(names.OrbitalWeapon2ShortRangeOrbitalWhopper, visualBuild(names.OrbitalWeapon2ShortRangeOrbitalWhopper, colors.Red), 90, "A more powerful orbital weapon, but only one shot per turn.", categoriesOrbital);
        this.OrbitalWeapon3LongRangeOrbitalWhopper = facilityOrbital(names.OrbitalWeapon3LongRangeOrbitalWhopper, visualBuild("Long-Range Whopper", colors.Green), 180, "A still more powerful orbital weapon with longer range and multiple shots.", categoriesOrbital);
        // Planetwide.
        this.PlanetwideFocusAlienHospitality = planetwideFocus(names.PlanetwideFocusAlienHospitality, visualBuild(names.PlanetwideFocusAlienHospitality, colors.Orange), "Directs industrial output to improving diplomatic relations.");
        this.PlanetwideFocusEndlessParty = planetwideFocus(names.PlanetwideFocusEndlessParty, visualBuild(names.PlanetwideFocusEndlessParty, colors.Green), "Directs industrial output to increasing population growth.");
        this.PlanetwideFocusScientistTakeover = planetwideFocus(names.PlanetwideFocusScientistTakeover, visualBuild(names.PlanetwideFocusScientistTakeover, colors.Blue), "Directs industrial output to increasing research.");
        this.PlanetwideLushGrowthBomb = planetwideFocus(names.PlanetwideLushGrowthBomb, visualBuild(names.PlanetwideLushGrowthBomb, colors.Violet), // todo - 200
        "Increases planetary maximum population by 10.");
        // Ships.
        var categories = BuildableCategory.Instances();
        // Drives.
        var categoryShipDrive = categories.ShipDrive;
        var deviceDefnDrive = (energyPerUse, distanceMaxPerMoveMultiple) => new DeviceDefn("Drive", false, // isActive
        false, // needsTarget
        [categoryShipDrive], (uwpe) => { }, // init
        (uwpe) => // updateForRound
         {
            var shipDeviceUser = DeviceUser.ofEntity(uwpe.entity);
            shipDeviceUser.energyPerMoveAdd(energyPerUse);
            var distanceMaxPerMoveBase = 50;
            var distanceMaxPerMove = distanceMaxPerMoveMultiple * distanceMaxPerMoveBase;
            shipDeviceUser.distanceMaxPerMoveAdd(distanceMaxPerMove);
        }, 0, // usesPerRound
        energyPerUse, (uwpe) => // use
         {
            // Do nothing?
        });
        this.ShipDrive1TonklinMotor = shipComponent(names.ShipDrive1TonklinMotor, visualBuild("Drive", colors.Gray), 10, categoryShipDrive, deviceDefnDrive(1, 1), "Consumes energy to move a ship through a starsystem.");
        this.ShipDrive2IonBanger = shipComponent(names.ShipDrive2IonBanger, visualBuild("Drive", colors.Red), 30, categoryShipDrive, deviceDefnDrive(1, 2), "A more powerful ship drive.");
        this.ShipDrive3GravitonProjector = shipComponent(names.ShipDrive3GravitonProjector, visualBuild("Drive", colors.Green), 40, categoryShipDrive, deviceDefnDrive(3, 3), "A still more powerful ship drive.");
        this.ShipDrive4InertiaNegator = shipComponent(names.ShipDrive4InertiaNegator, visualBuild("Drive", colors.Red), 20, categoryShipDrive, deviceDefnDrive(1, 3), "As powerful as a gravitor projector, but more energy-efficient.");
        this.ShipDrive5NanowaveSpaceBender = shipComponent(names.ShipDrive5NanowaveSpaceBender, visualBuild("Drive", colors.Red), 80, categoryShipDrive, deviceDefnDrive(5, 5), "The most powerful ship drive.");
        // Generators.
        var categoryShipGenerator = categories.ShipGenerator;
        var deviceDefnGenerator = (name, energyPerTurn) => {
            return new DeviceDefn(name, false, // isActive
            false, // needsTarget
            [categoryShipGenerator], null, // initialize
            // updateForRound
            (uwpe) => {
                var deviceUser = DeviceUser.ofEntity(uwpe.entity);
                deviceUser.energyPerRoundAdd(energyPerTurn);
            }, 0, // usesPerRound
            0, // energyPerUse
            null // use
            );
        };
        var colorGenerator = colors.Yellow;
        var shipGenerator = (name, industryToBuild, energyPerTurn, description) => shipComponent(name, visualBuild(name, colorGenerator), industryToBuild, categoryShipGenerator, deviceDefnGenerator(name, energyPerTurn), description);
        this.ShipGenerator1ProtonShaver = shipGenerator(names.ShipGenerator1ProtonShaver, 20, 2, "Produces energy to power other devices on the ship.");
        this.ShipGenerator2SubatomicScoop = shipGenerator(names.ShipGenerator2SubatomicScoop, 35, 4, "A more powerful ship generator.");
        this.ShipGenerator3QuarkExpress = shipGenerator(names.ShipGenerator3QuarkExpress, 60, 6, "A still more powerful ship generator.");
        this.ShipGenerator4VanKreegHypersplicer = shipGenerator(names.ShipGenerator4VanKreegHypersplicer, 80, 8, "A yet more powerful ship generator.");
        this.ShipGenerator5Nanotwirler = shipGenerator(names.ShipGenerator5Nanotwirler, 100, 10, "The most powerful ship generator.");
        // Hulls.
        var shipHull = (name, color, industryToBuild, description) => {
            return new BuildableDefn(name, false, // isItem
            canBeBuiltNever, mapCellSizeInPixels, visualBuild("Hull", color), industryToBuild, effectNone, null, // effectsAvailableToUse
            null, // categories
            null, // entityProperties
            null, // entityModifyOnBuild
            description);
        };
        this.ShipHull1Small = shipHull(names.ShipHull1Small, colors.Gray, 30, "A small ship hull with space for only a few components.");
        this.ShipHull2Medium = shipHull(names.ShipHull2Medium, colors.Red, 60, "A larger ship hull with space for more components.");
        this.ShipHull3Large = shipHull(names.ShipHull3Large, colors.Green, 120, "A stll larger ship hull with space for even more components.");
        this.ShipHull4Enormous = shipHull(names.ShipHull4Enormous, colors.Blue, 240, "The largest and most spacious ship hull.");
        // Items.
        var sc = (name, industry, deviceDefn, description) => shipComponent(name, visualBuild(name, colors.Gray), industry, categories.ShipItem, null, // use
        description);
        this.ShipItemAccutron = sc(names.ShipItemAccutron, 60, null, // deviceDefn
        "Increases the range of ship weapons.");
        this.ShipItemBackfirer = sc(names.ShipItemBackfirer, 60, null, "Damages the target ship in proportion to its firepower.");
        this.ShipItemBrunswikDissipator = sc(names.ShipItemBrunswikDissipator, 100, null, // deviceDefn
        "Depletes the target ship's stored energy for this round.");
        this.ShipItemCannibalizer = sc(names.ShipItemCannibalizer, 20, null, // deviceDefn
        "Damages the host ship's hull to provide it more energy.");
        this.ShipItemCloaker = sc(names.ShipItemCloaker, 30, null, // deviceDefn
        "Hides ship components from sensors.");
        this.ShipItemColonizer = sc(names.ShipItemColonizer, 35, null, // deviceDefn
        "Allows a colony to be established on an uninhabited planet.");
        this.ShipItemContainmentDevice = sc(names.ShipItemContainmentDevice, 15, null, // deviceDefn
        "Destroys colonizers and invasion modules on the target ship.");
        this.ShipItemDisarmer = sc(names.ShipItemDisarmer, 30, null, // deviceDefn
        "Destroys a random weapon on the target ship.");
        this.ShipItemDisintegrator = sc(names.ShipItemDisintegrator, 150, null, // deviceDefn
        "Consumed to destroy a targeted ship outright.");
        this.ShipItemFleetDisperser = sc(names.ShipItemFleetDisperser, 30, null, // deviceDefn
        "Pushes other ships away from the targeted ship.");
        this.ShipItemGizmogrifier = sc(names.ShipItemGizmogrifier, 30, null, // deviceDefn
        "Destroys a major device on the targeted ship.");
        this.ShipItemGravimetricCatapult = sc(names.ShipItemGravimetricCatapult, 16, null, // deviceDefn
        "Moves the host ship to the opposite side of the sun.");
        this.ShipItemGravimetricCondensor = sc(names.ShipItemGravimetricCondensor, 30, null, // deviceDefn
        "Pulls all ships in the starsystem toward the sun.");
        this.ShipItemGravityDistorter = sc(names.ShipItemGravityDistorter, 20, null, // deviceDefn
        "Pushes all ships away from the host ship.");
        this.ShipItemGyroInductor = sc(names.ShipItemGyroInductor, 20, null, // deviceDefn
        "Generates energy upon leaving planetary orbit.");
        this.ShipItemHyperfuel = sc(names.ShipItemHyperfuel, 20, null, // deviceDefn
        "Consumed to fully replenish the host ship's energy.");
        this.ShipItemHyperswapper = sc(names.ShipItemHyperswapper, 20, null, // deviceDefn
        "The host and target ship switch positions.");
        this.ShipItemIntellectScrambler = sc(names.ShipItemIntellectScrambler, 20, null, // deviceDefn
        "Nullifies the experience of the targeted ship's crew.");
        this.ShipItemInvasionModule = sc(names.ShipItemInvasionModule, 70, null, // deviceDefn
        "Consumed to allows enemy planets to be taken over from orbit.");
        this.ShipItemInvulnerablizer = sc(names.ShipItemInvulnerablizer, 60, null, // deviceDefn
        "Consumed to make the host ship invincible for this round.");
        this.ShipItemLaneBlocker = sc(names.ShipItemLaneBlocker, 30, null, // deviceDefn
        "Blocks the ends of the link for a targeted portal with a weak obstacle.");
        this.ShipItemLaneDestabilizer = sc(names.ShipItemLaneDestabilizer, 40, null, // deviceDefn
        "Consumed to push all ships in the link for a targeted portal through to its end.");
        this.ShipItemLaneEndoscope = sc(names.ShipItemLaneEndoscope, 20, null, // deviceDefn
        "Allows sensors to reach neighboring starsystems through link portals.");
        this.ShipItemLaneMagnetron = sc(names.ShipItemLaneMagnetron, 50, null, // deviceDefn
        "Consumed to push the host ship instantly through to the end of a starlane.");
        this.ShipItemMassCondensor = sc(names.ShipItemMassCondensor, 50, null, // deviceDefn
        "Pulls nearby ships toward the targeted ship.");
        this.ShipItemMolecularTieDown = sc(names.ShipItemMolecularTieDown, 20, null, // deviceDefn
        "Disables the targeted ship's engines for this round.");
        this.ShipItemMovingPartExploiter = sc(names.ShipItemMovingPartExploiter, 60, null, // deviceDefn
        "Destroys equipment on target ship and damages hull proportional to equipment's advancement.");
        this.ShipItemMyrmidonicCarbonizer = sc(names.ShipItemMyrmidonicCarbonizer, 70, null, // deviceDefn
        "Severely damages targeted ship and moderately damages those nearby.");
        this.ShipItemPhaseBomb = sc(names.ShipItemPhaseBomb, 40, null, // deviceDefn
        "Destroys surface structures from planetary orbit.");
        this.ShipItemPlasmaCoupler = sc(names.ShipItemPlasmaCoupler, 20, null, // deviceDefn
        "Transfers energy from the host ship to the targeted ship.");
        this.ShipItemPositronBouncer = sc(names.ShipItemPositronBouncer, 10, null, // deviceDefn
        "Pushes the targeted ship away from the host ship.");
        this.ShipItemRecaller = sc(names.ShipItemRecaller, 40, null, // deviceDefn
        "Instantly teleports the host ship back to its home system.");
        this.ShipItemRemoteRepairFacility = sc(names.ShipItemRemoteRepairFacility, 70, null, // deviceDefn
        "Repairs hull damage on the host ship.");
        this.ShipItemReplenisher = sc(names.ShipItemReplenisher, 60, null, // deviceDefn
        "Recharges all devices on the host ship.");
        this.ShipItemSacrificialOrb = sc(names.ShipItemSacrificialOrb, 20, null, // deviceDefn
        "Transfers hull damage to the host ship from the targeted ship.");
        this.ShipItemSelfDestructotron = sc(names.ShipItemSelfDestructotron, 50, null, // deviceDefn
        "Destroys the host ship to damage those nearby.");
        this.ShipItemShieldBlaster = sc(names.ShipItemShieldBlaster, 30, null, // deviceDefn
        "Disables the target ship's shields for this round.");
        this.ShipItemSmartBomb = sc(names.ShipItemSmartBomb, 30, null, // deviceDefn
        "Consumed to inflict moderate damage on all enemy ships in the starsystem.");
        this.ShipItemSpecialtyBlaster = sc(names.ShipItemSpecialtyBlaster, 30, null, // deviceDefn
        "Destroys a device selected by the user on the targeted ship.");
        this.ShipItemToroidalBlaster = sc(names.ShipItemToroidalBlaster, 20, null, // deviceDefn
        "Boosts engine performance but causes hull damage.");
        this.ShipItemTractorBeam = sc(names.ShipItemTractorBeam, 30, null, // deviceDefn
        "Pulls a targeted ship closer to the host ship.");
        this.ShipItemXRayMegaglasses = sc(names.ShipItemXRayMegaglasses, 100, null, // deviceDefn
        "Makes the equipment loadout of a ship in sensor range visible.");
        // Sensors.
        var categoryShipSensor = categories.ShipSensor;
        var deviceDefnSensor = (name, sensorRange) => {
            return new DeviceDefn(name, false, // isActive
            false, // needsTarget
            [categoryShipSensor], null, // initialize
            // updateForRound
            (uwpe) => {
                var deviceUser = DeviceUser.ofEntity(uwpe.entity);
                deviceUser.sensorRangeAdd(sensorRange);
            }, 0, // usesPerRound
            0, // energyPerUse
            null // use
            );
        };
        var colorSensor = colors.Violet;
        var rangeMultiplier = 4; // hack
        var shipSensor = (name, industryToBuild, range, description) => {
            return shipComponent(name, visualBuild(name, colorSensor), industryToBuild, categoryShipSensor, deviceDefnSensor(name, range * rangeMultiplier), description);
        };
        this.ShipSensor1TonklinFrequencyAnalyzer = shipSensor(names.ShipSensor1TonklinFrequencyAnalyzer, 20, 25, "A basic sensor that makes the status of others' ships visible at close range.");
        this.ShipSensor2SubspacePhaseArray = shipSensor(names.ShipSensor2SubspacePhaseArray, 40, 50, "A sensor that can detect at double the baseline range.");
        this.ShipSensor3AuralCloudConstrictor = shipSensor(names.ShipSensor3AuralCloudConstrictor, 60, 75, "A sensor that can detect at triple the baseline range.");
        this.ShipSensor4HyperwaveTympanum = shipSensor(names.ShipSensor4HyperwaveTympanum, 80, 100, "A sensor that can detect at quadruple the baseline range.");
        this.ShipSensor5MurgatroydsKnower = shipSensor(names.ShipSensor5MurgatroydsKnower, 100, 200, "A sensor that can detect at octuple the baseline range.");
        this.ShipSensor6NanowaveDecouplingNet = shipSensor(names.ShipSensor6NanowaveDecouplingNet, 200, 1000, "A sensor that can scan ships at 40 times the baseline range.");
        // Shields.
        var categoryShipShield = categories.ShipShield;
        var deviceDefnShield = (name, energyPerMove, damageAbsorbed) => {
            return new DeviceDefn(name, false, // isActive
            false, // needsTarget
            [categoryShipShield], null, // initialize
            // updateForRound
            (uwpe) => {
                var deviceUser = DeviceUser.ofEntity(uwpe.entity);
                deviceUser.shieldingAdd(damageAbsorbed);
            }, 0, // usesPerRound
            0, // energyPerUse
            null // use
            // todo - updateForMove
            );
        };
        var colorShield = colors.Violet;
        var shipShield = (name, industryToBuild, energyPerMove, damageAbsorbed, description) => {
            return shipComponent(name, visualBuild(name, colorShield), industryToBuild, categoryShipShield, deviceDefnShield(name, energyPerMove, damageAbsorbed), description);
        };
        this.ShipShield1IonWrap = shipShield(names.ShipShield1IonWrap, 10, 2, 1, "When powered, protects the host ship from minor hull damage.");
        this.ShipShield2ConcussionShield = shipShield(names.ShipShield2ConcussionShield, 30, 4, 2, "Twice the shielding of baseline, but uses twice the energy.");
        this.ShipShield3WaveScatterer = shipShield(names.ShipShield3WaveScatterer, 50, 0, 1, "The same shielding as baseline, but uses no energy.");
        this.ShipShield4Deactotron = shipShield(names.ShipShield4Deactotron, 50, 4, 3, "Triple the shielding of the baseline, using only twice the energy.");
        this.ShipShield5HyperwaveNullifier = shipShield(names.ShipShield5HyperwaveNullifier, 100, 8, 4, "Quadruple the shielding of the baseline, and uses four times the energy.");
        this.ShipShield6Nanoshell = shipShield(names.ShipShield6Nanoshell, 200, 6, 5, "Quintuple the shielding of the baseline, at only three times the energy use.");
        // Starlane Drives.
        var categoryShipStarlaneDrive = categories.ShipStarlaneDrive;
        var speedIncrementStep = 20;
        var deviceDefnStarlaneDrive = (name, speedIncrementMultiple) => {
            return new DeviceDefn(name, false, // isActive
            false, // needsTarget
            [categoryShipStarlaneDrive], null, // initialize
            // updateForRound
            (uwpe) => {
                var deviceUser = DeviceUser.ofEntity(uwpe.entity);
                var speedIncrement = speedIncrementMultiple
                    * speedIncrementStep;
                deviceUser.speedThroughLinkAdd(speedIncrement);
            }, 0, // usesPerRound
            0, // energyPerUse
            null // use
            );
        };
        var colorStarlaneDrive = colors.Cyan;
        var shipStarlaneDrive = (name, industryToBuild, speedIncrement, description) => {
            return shipComponent(name, visualBuild(name, colorStarlaneDrive), industryToBuild, categoryShipStarlaneDrive, deviceDefnStarlaneDrive(name, speedIncrement), description);
        };
        this.ShipStarlaneDrive1StarLaneDrive = shipStarlaneDrive(names.ShipStarlaneDrive1StarLaneDrive, 25, 1, "Makes it possible to travel through starlanes; multiples increase speed.");
        this.ShipStarlaneDrive2StarLaneHyperdrive = shipStarlaneDrive(names.ShipStarlaneDrive2StarLaneHyperdrive, 50, 2, "Increases speed of travel through starlanes at twice that of baseline.");
        // Weapons.
        var categoryShipWeapon = categories.ShipWeapon;
        var deviceDefnWeaponUse = (uwpe) => {
            var universe = uwpe.universe;
            var venue = universe.venueCurrent();
            var starsystem = venue.starsystem;
            var entityFiring = uwpe.entity;
            var entityFiringOrder = entityFiring.orderable().order(entityFiring);
            var entityBeingTargeted = entityFiringOrder.entityBeingTargeted;
            var device = entityFiring.deviceUser().deviceSelected();
            var projectile = device.projectile;
            if (projectile == null) {
                var projectileDefn = ProjectileDefn.Instances().Default;
                projectile = new Projectile(entityFiring.name + "_" + Projectile.name, projectileDefn, Locatable.of(entityFiring).loc.pos.clone(), entityFiring, // entityFiredFrom
                entityBeingTargeted);
                Actor.of(projectile).activity =
                    Activity.fromDefnNameAndTargetEntity("MoveToTargetCollideAndEndMove", entityBeingTargeted);
                starsystem.entityToSpawnAdd(projectile);
                device.projectile = projectile;
            }
            else {
                device.projectile = null;
                var projectilePos = Locatable.of(projectile).loc.pos;
                var targetPos = Locatable.of(entityBeingTargeted).loc.pos;
                if (projectilePos.equals(targetPos)) {
                    entityFiringOrder.complete();
                }
            }
        };
        var deviceDefnWeapon = (name, usesPerRound, energyPerUse, range, damage) => new DeviceDefn(name, true, // isActive
        true, // needsTarget
        [categoryShipWeapon], // categoryNames
        (uwpe) => // init
         {
            // todo
        }, (uwpe) => // updateForRound
         {
            // todo
        }, usesPerRound, energyPerUse, deviceDefnWeaponUse);
        this.ShipWeapon01MassBarrageGun = shipComponent(names.ShipWeapon01MassBarrageGun, visualBuild("Weapon", colors.Gray), 10, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon01MassBarrageGun, 1, 1, 25, 1), // uses, energy, range, damage
        "Inflicts minor hull damage on a target ship at short range.");
        this.ShipWeapon02FourierMissiles = shipComponent(names.ShipWeapon02FourierMissiles, visualBuild("Weapon", colors.Gray), 20, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon02FourierMissiles, 1, 2, 40, 2), "Twice the damage as baseline, with 1.6 times the range.");
        this.ShipWeapon03QuantumSingularityLauncher = shipComponent(names.ShipWeapon03QuantumSingularityLauncher, visualBuild("Weapon", colors.Gray), 30, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon03QuantumSingularityLauncher, 1, 2, 25, 4), "Four times the damage as baseline, but twice the energy use.");
        this.ShipWeapon04MolecularDisassociator = shipComponent(names.ShipWeapon04MolecularDisassociator, visualBuild("Weapon", colors.Gray), 40, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon04MolecularDisassociator, 1, 2, 50, 4), "Four times the damage and twice the range as baseline, but twice the energy use.");
        this.ShipWeapon05ElectromagneticPulser = shipComponent(names.ShipWeapon05ElectromagneticPulser, visualBuild("Weapon", colors.Gray), 50, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon05ElectromagneticPulser, 5, 1, 50, 1), "Five shots with twice the range as baseline.");
        this.ShipWeapon06Plasmatron = shipComponent(names.ShipWeapon06Plasmatron, visualBuild("Weapon", colors.Gray), 50, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon06Plasmatron, 1, 2, 100, 4), "Four times the range and damage as baseline, at only twice the energy use.");
        this.ShipWeapon07Ueberlaser = shipComponent(names.ShipWeapon07Ueberlaser, visualBuild("Weapon", colors.Gray), 70, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon07Ueberlaser, 2, 3, 50, 6), "Two shots with double range, sextuple damage, triple energy use as baseline.");
        this.ShipWeapon08FergnatzLens = shipComponent(names.ShipWeapon08FergnatzLens, visualBuild("Weapon", colors.Gray), 50, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon08FergnatzLens, 2, 0, 35, 4), "Two shots with 1.4 times range and quadruple damage as baseline, using no energy.");
        this.ShipWeapon09HypersphereDriver = shipComponent(names.ShipWeapon09HypersphereDriver, visualBuild("Weapon", colors.Gray), 100, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon09HypersphereDriver, 2, 6, 75, 10), "Two shots with 10 times damage, triple range, sextuple energy use as baseline.");
        this.ShipWeapon10Nanomanipulator = shipComponent(names.ShipWeapon10Nanomanipulator, visualBuild("Weapon", colors.Gray), 100, categoryShipWeapon, deviceDefnWeapon(names.ShipWeapon10Nanomanipulator, 3, 6, 50, 13), "Three shots with 13 times damage, double range, sextuple energy use as baseline.");
        // Surface.
        this.SurfaceArtificialHydroponifier = facilitySurfaceUsable(names.SurfaceArtificialHydroponifier, visualBuild("Artificial Hydroponifier", colors.Gray), 100, effectResourcesAdd([new Resource("Prosperity", 2)]), "Provides 2 prosperity per turn, plus a possible bonus depending on terrain.");
        this.SurfaceAutomation = facilitySurfaceUsable(names.SurfaceAutomation, visualBuild("todo", colors.Gray), 9999, null, // todo
        "Frees the worker in a facility to work elsewhere.");
        this.SurfaceCloaker = facilitySurfaceUsable(names.SurfaceCloaker, visualBuild("Cloak", colors.Gray), 120, null, "Hides surface structures from others' sensors.");
        this.SurfaceCloningPlant = facilitySurfaceUsable(names.SurfaceCloningPlant, visualBuild("Cloning Plant", colors.Gray), 250, null, "Doubles the population added when the population increases.");
        this.SurfaceEngineeringRetreat = facilitySurfaceUsable(names.SurfaceEngineeringRetreat, visualBuild("Engineering Retreat", colors.Gray), 80, effectResourcesAdd([
            new Resource("Industry", 1),
            new Resource("Research", 1)
        ]), "Provides 1 point each of industry and research.");
        this.SurfaceFertilizationPlant = facilitySurfaceUsable(names.SurfaceFertilizationPlant, visualBuild("Fertilization Plant", colors.Gray), 200, effectResourceMultiply(new Resource("Prosperity", 1.5)), "First one present adds 50% to total prosperity produced.");
        this.SurfaceHabitat = facilitySurfaceUsable(names.SurfaceHabitat, visualBuild("Habitat", colors.Gray), 160, effectPopulationMaxAdd(3), "Increases maximum population by 3.");
        this.SurfaceHyperpowerPlant = facilitySurfaceUsable(names.SurfaceHyperpowerPlant, visualBuild("Hyperpower Plant", colors.Gray), 200, effectResourceMultiply(new Resource("Industry", 1.5)), "First one present adds 50% to total industry produced.");
        this.SurfaceIndustrialMegafacility = facilitySurfaceUsable(names.SurfaceIndustrialMegafacility, visualBuild("Industrial Megafacility", colors.Gray), 110, effectResourcesAdd([
            new Resource("Industry", 2)
        ]), "Produces 2 industry, plus a possible bonus based on terrain.");
        this.SurfaceInternet = facilitySurfaceUsable(names.SurfaceInternet, visualBuild("Internet", colors.Gray), 250, effectResourceMultiply(new Resource("Research", 1.5)), "First one present adds 50% to total industry produced.");
        this.SurfaceLogicFactory = facilitySurfaceUsable(names.SurfaceLogicFactory, visualBuild("Logic Factory", colors.Gray), 80, effectResourcesAdd([
            new Resource("Prosperity", 1),
            new Resource("Research", 1)
        ]), "Produces 1 prosperity and 1 research.");
        var surfaceMetroplexEffects = [
            effectResourcesAdd([
                new Resource("Industry", 1),
                new Resource("Prosperity", 2),
                new Resource("Research", 1)
            ]),
            effectPopulationMaxAdd(2),
        ];
        this.SurfaceMetroplex = facilitySurfaceUsable(names.SurfaceMetroplex, visualBuild("Metroplex", colors.Gray), 200, 
        // todo - Adds 2 to max population as well?
        new BuildableEffect("Multiple", 0, (uwpe) => {
            surfaceMetroplexEffects[0].apply(uwpe);
            surfaceMetroplexEffects[1].apply(uwpe);
        }), "Adds 2 prosperity, 1 industry, 1 research, 2 max population.");
        this.SurfaceObservationInstallation = facilitySurfaceUsable(names.SurfaceObservationInstallation, visualBuild("Observation Installation", colors.Gray), 40, null, "Scans the contents of others' ships.");
        this.SurfacePlanetaryTractorBeam = facilitySurfaceUsable(names.SurfacePlanetaryTractorBeam, visualBuild("Tractor Beam", colors.Gray), 50, null, "Pulls a targeted ship closer to the host planet.");
        this.SurfaceResearchCampus = facilitySurfaceUsable(names.SurfaceResearchCampus, visualBuild("Research Campus", colors.Gray), 160, effectResourcesAdd([
            new Resource("Research", 2)
        ]), "Produces 2 research, plus a possible bonus depending on terrain.");
        this.SurfaceShield1SurfaceShield = facilitySurfaceUsable(names.SurfaceShield1SurfaceShield, visualBuild("Surface Shield", colors.Gray), 100, null, "Consumed to destroy one invading enemy unit.");
        this.SurfaceShield2SurfaceMegaShield = facilitySurfaceUsable(names.SurfaceShield2SurfaceMegaShield, visualBuild("Surface Mega-Shield", colors.Gray), 180, null, "Consumed to destroy two invading enemy units.");
        this.SurfaceTerraforming = facilitySurfaceUnusable(names.SurfaceTerraforming, visualBuild("Terraforming", colors.Gray), 50, null, "Converts a cell's terrain from unusable to usable.");
        this.SurfaceXenoArchaeologicalDig = new BuildableDefn(names.SurfaceXenoArchaeologicalDig, false, // isItem
        (m, p) => {
            //var cellAtPos = m.cellAtPosInCells(p);
            return false; // todo - Build only on ruins.
        }, mapCellSizeInPixels, visualBuild(names.SurfaceXenoArchaeologicalDig, colors.Gray), 50, effectNone, null, // effectsAvailableToUse
        null, // categories
        null, // entityProperties
        null, // entityModifyOnBuild
        "Extracts a technological advance from ancient ruins.");
        // Default tech.
        this.SurfaceAgriplot = facilitySurfaceUsable(names.SurfaceAgriplot, visualBuild(names.SurfaceAgriplot, colors.GreenDark), 30, effectResourcesAdd([new Resource("Prosperity", 1)]), "Provides 1 prosperity, plus a possible bonus based on terrain.");
        this.SurfaceColonyHub = new BuildableDefn(names.SurfaceColonyHub, false, // isItem
        canBeBuiltNever, mapCellSizeInPixels, visualBuild("Hub", colors.Gray), 30, effectResourcesAdd([
            new Resource("Industry", 1),
            new Resource("Prosperity", 1)
        ]), null, // effectsAvailableToUse
        null, // categories
        null, // entityProperties
        null, // entityModifyOnBuild,
        "Provides 1 industry and 1 prosperity, plus any terrain bonus.");
        this.SurfaceFactory = facilitySurfaceUsable(names.SurfaceFactory, visualBuild(names.SurfaceFactory, colors.Red), 30, effectResourcesAdd([new Resource("Industry", 1)]), "Provides 1 industry, plus a possible bonus based on terrain.");
        this.SurfaceLaboratory = facilitySurfaceUsable(names.SurfaceLaboratory, visualBuild(names.SurfaceLaboratory, colors.Blue), 50, effectResourcesAdd([new Resource("Research", 1)]), "Provides 1 research, plus a possible bonus based on terrain.");
        this.SurfaceOutpost = facilitySurfaceUsable(names.SurfaceOutpost, visualBuild("Outpost", colors.Gray), 120, effectPopulationMaxAdd(1), "Increases maximum population by 1.");
        this.SurfaceTransportTubes = facilitySurfaceAnywhere(names.SurfaceTransportTubes, visualBuild("Transport", colors.GrayDark), 10, effectNone, "Allows unusable terrain to be crossed to access usable terrain.");
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
                this.SurfaceOutpost,
                this.SurfaceTransportTubes
            ];
    }
}
class BuildableDefnsLegacyNames {
    constructor() {
        this.assignLegacyNames();
        // this.assignAlternateNames();
    }
    assignLegacyNames() {
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
        this.SurfaceXenoArchaeologicalDig = "Archaeological Dig";
        this.SurfaceAgriplot = "Agriplot";
        this.SurfaceColonyHub = "Colony Hub";
        this.SurfaceFactory = "Factory";
        this.SurfaceLaboratory = "Laboratory";
        this.SurfaceOutpost = "Outpost";
        this.SurfaceTransportTubes = "Transport Tubes";
    }
    assignAlternateNames() {
        this.OrbitalCloaker = "Orbital Scanner Jammer";
        this.OrbitalDocks = "Skydocks";
        this.OrbitalShield1OrbitalShield = "Exospheric Particle Cascade";
        this.OrbitalShield2OrbitalMegaShield = "Orbital Aegis";
        this.OrbitalShipyard = "Shipyard";
        this.OrbitalWeapon1OrbitalMissileBase = "Orbital Missilary";
        this.OrbitalWeapon2ShortRangeOrbitalWhopper = "Short-Range Orbital Blaster";
        this.OrbitalWeapon3LongRangeOrbitalWhopper = "Long-Range Orbital Blaster";
        this.PlanetwideFocusAlienHospitality = "Planetwide Diplomacy Focus";
        this.PlanetwideFocusEndlessParty = "Planetwide Growth Focus";
        this.PlanetwideFocusScientistTakeover = "Planetwide Research Focus";
        this.PlanetwideLushGrowthBomb = "Nanohabitation Matrix";
        this.ShipDrive1TonklinMotor = "Chemical Thruster";
        this.ShipDrive2IonBanger = "Ion Engine";
        this.ShipDrive3GravitonProjector = "Gravitic Polarizer";
        this.ShipDrive4InertiaNegator = "Inertial Fractionator";
        this.ShipDrive5NanowaveSpaceBender = "Spatiofolder";
        this.ShipGenerator1ProtonShaver = "Nucleonic Powerplant";
        this.ShipGenerator2SubatomicScoop = "Ion Harvester";
        this.ShipGenerator3QuarkExpress = "Strongforce Forge";
        this.ShipGenerator4VanKreegHypersplicer = "Superstring Knotter";
        this.ShipGenerator5Nanotwirler = "Zero-Point Plenum";
        this.ShipHull1Small = "Small Ship Hull";
        this.ShipHull2Medium = "Medium Ship Hull";
        this.ShipHull3Large = "Large Ship Hull";
        this.ShipHull4Enormous = "Enormous Ship Hull";
        this.ShipItemAccutron = "Weapons Range Extender";
        this.ShipItemBackfirer = "Attacker Hacker";
        this.ShipItemBrunswikDissipator = "Enervatrix Zero";
        this.ShipItemCannibalizer = "Hullplate Fuzor";
        this.ShipItemCloaker = "Scanner Skipper";
        this.ShipItemColonizer = "Capsule Colonizer";
        this.ShipItemContainmentDevice = "Neuterizer";
        this.ShipItemDisarmer = "Harmlessizer";
        this.ShipItemDisintegrator = "Disintegrator";
        this.ShipItemFleetDisperser = "Antigraviton Gun";
        this.ShipItemGizmogrifier = "Decomponentizer";
        this.ShipItemGravimetricCatapult = "Solar Swapper";
        this.ShipItemGravimetricCondensor = "Graviton Field Projector";
        this.ShipItemGravityDistorter = "Antigraviton Field Projector";
        this.ShipItemGyroInductor = "Gravitic Regenerator";
        this.ShipItemHyperfuel = "Exacapacitance Discharge Array";
        this.ShipItemHyperswapper = "Switcheroo";
        this.ShipItemIntellectScrambler = "Amnesianator";
        this.ShipItemInvasionModule = "Military Dropship";
        this.ShipItemInvulnerablizer = "Magic Shell";
        this.ShipItemLaneBlocker = "Link Hinker";
        this.ShipItemLaneDestabilizer = "Hypertopology Collapser";
        this.ShipItemLaneEndoscope = "Quantum Keyholer";
        this.ShipItemLaneMagnetron = "Hypertsunami Waverider";
        this.ShipItemMassCondensor = "Graviton Gun";
        this.ShipItemMolecularTieDown = "Immobilizer";
        this.ShipItemMovingPartExploiter = "Entropy Cannon";
        this.ShipItemMyrmidonicCarbonizer = "Volumetric Hyperfutzer";
        this.ShipItemPhaseBomb = "Transdimensional Nuke";
        this.ShipItemPlasmaCoupler = "Power Projector";
        this.ShipItemPositronBouncer = "Backoff Beam";
        this.ShipItemRecaller = "Homer";
        this.ShipItemRemoteRepairFacility = "Repair Drone Swarm";
        this.ShipItemReplenisher = "Quick Loader";
        this.ShipItemSacrificialOrb = "Entropy Exchange";
        this.ShipItemSelfDestructotron = "Explosive Self-Destruct System";
        this.ShipItemShieldBlaster = "Defenselessizer";
        this.ShipItemSmartBomb = "Systemwide Attack Vector";
        this.ShipItemSpecialtyBlaster = "Pinpoint Rad-Blaster";
        this.ShipItemToroidalBlaster = "Hyper-Turboizer";
        this.ShipItemTractorBeam = "Attractor Ray";
        this.ShipItemXRayMegaglasses = "Scanalyzer";
        this.ShipSensor1TonklinFrequencyAnalyzer = "Deep-Radar Dish";
        this.ShipSensor2SubspacePhaseArray = "Quantum Disturbance Web";
        this.ShipSensor3AuralCloudConstrictor = "Gravity Wave Detector";
        this.ShipSensor4HyperwaveTympanum = "Superstring Tug Noticer";
        this.ShipSensor5MurgatroydsKnower = "Transdimensional Lookit";
        this.ShipSensor6NanowaveDecouplingNet = "Far-Seeing Eye";
        this.ShipShield1IonWrap = "Ionic Deflector";
        this.ShipShield2ConcussionShield = "Forcefield";
        this.ShipShield3WaveScatterer = "Spatial Passthrough";
        this.ShipShield4Deactotron = "Interaction Dampener";
        this.ShipShield5HyperwaveNullifier = "Superstring Safety Net";
        this.ShipShield6Nanoshell = "Transdimensional Spreader";
        this.ShipStarlaneDrive1StarLaneDrive = "Link Drive";
        this.ShipStarlaneDrive2StarLaneHyperdrive = "Improved Link Drive";
        this.ShipWeapon01MassBarrageGun = "Bullet Stormer";
        this.ShipWeapon02FourierMissiles = "Missile Barrage";
        this.ShipWeapon03QuantumSingularityLauncher = "Black Hole Gun";
        this.ShipWeapon04MolecularDisassociator = "Matter Decoherer";
        this.ShipWeapon05ElectromagneticPulser = "Rapid Zapper";
        this.ShipWeapon06Plasmatron = "Protean Chaos Projector";
        this.ShipWeapon07Ueberlaser = "Exawatt Laser";
        this.ShipWeapon08FergnatzLens = "Entropy Focuser";
        this.ShipWeapon09HypersphereDriver = "Tesseract Flinger";
        this.ShipWeapon10Nanomanipulator = "Reality Canceller";
        this.SurfaceArtificialHydroponifier = "Hydroponicarium";
        this.SurfaceAutomation = "Automation";
        this.SurfaceCloaker = "Surface Scanner Jammer";
        this.SurfaceCloningPlant = "Mass Gestatational Array";
        this.SurfaceEngineeringRetreat = "Experimental Fabricary";
        this.SurfaceFertilizationPlant = "Fertility Promotion Center";
        this.SurfaceHabitat = "Intensive Habitation Dome";
        this.SurfaceHyperpowerPlant = "Industrial Interchange Integrator";
        this.SurfaceIndustrialMegafacility = "Industrial Megafacility";
        this.SurfaceInternet = "Scientific Collaboration Network";
        this.SurfaceLogicFactory = "Experimental Biofarm";
        this.SurfaceMetroplex = "Arcology";
        this.SurfaceObservationInstallation = "Deep-Space Monitoring Station";
        this.SurfacePlanetaryTractorBeam = "Planetary Tractor Beam";
        this.SurfaceResearchCampus = "Research Collegium";
        this.SurfaceShield1SurfaceShield = "Surface-to-Air Missile Battery";
        this.SurfaceShield2SurfaceMegaShield = "Surface-to-Air Beam Projector";
        this.SurfaceTerraforming = "Terraforming";
        this.SurfaceXenoArchaeologicalDig = "Archaeological Dig";
        this.SurfaceAgriplot = "Plantation";
        this.SurfaceColonyHub = "Colony Hub";
        this.SurfaceFactory = "Factory";
        this.SurfaceLaboratory = "Laboratory";
        this.SurfaceOutpost = "Habitation Cells";
        this.SurfaceTransportTubes = "Transit Network";
    }
}
BuildableDefnsLegacyNames.Instance = new BuildableDefnsLegacyNames();
