"use strict";
class BuildableDefnsBasic {
    constructor() {
        var mapCellSizeInPixels = Coords.fromXY(20, 20); // hack
        var fontHeight = mapCellSizeInPixels.y / 2;
        var terrainNamesOrbital = ["Orbit"];
        var terrainNamesShip = ["Ship"];
        var terrainNamesSurface = ["Surface"];
        var colors = Color.Instances();
        var visualBuild = (labelText, color) => {
            return new VisualGroup([
                new VisualRectangle(mapCellSizeInPixels, color, null, null),
                VisualText.fromTextHeightAndColor(labelText, fontHeight, colors.White)
            ]);
        };
        var industryToBuild = (amount) => [new Resource("Industry", amount)];
        var facilityOrbital = (name, visual, industryToBuildAmount) => new BuildableDefn(name, false, // isItem
        terrainNamesOrbital, mapCellSizeInPixels, visual, industryToBuild(industryToBuildAmount), null, // resourcesProducedPerTurn
        null // entityModifyOnBuild
        );
        var facilitySurface = (name, visual, industryToBuildAmount, resourcesProducedPerTurn) => new BuildableDefn(name, false, // isItem
        terrainNamesSurface, mapCellSizeInPixels, visual, industryToBuild(industryToBuildAmount), resourcesProducedPerTurn, null // entityModifyOnBuild
        );
        var planetwideFocus = (name, visual) => new BuildableDefn(name, null, // isItem
        null, // terrainNames,
        mapCellSizeInPixels, visual, null, // industryToBuild(industryToBuildAmount),
        null, // resourcesProducedPerTurn,
        null // entityModifyOnBuild
        );
        var shipComponent = (name, visual, industryToBuildAmount) => new BuildableDefn(name, true, // isItem
        terrainNamesShip, mapCellSizeInPixels, visual, industryToBuild(industryToBuildAmount), null, // resourcesProducedPerTurn
        null // entityModifyOnBuild
        );
        this.OrbitalCloak = facilityOrbital("Orbital Cloak", visualBuild("C", colors.Gray), 120);
        this.OrbitalDocks = facilityOrbital("Orbital Docks", visualBuild("D", colors.Gray), 120);
        this.OrbitalShield = facilityOrbital("Orbital Shield", visualBuild("S", colors.Red), 60);
        this.OrbitalShieldAdvanced = facilityOrbital("Orbital Shield, Advanced", visualBuild("S", colors.Blue), 120);
        this.OrbitalWeaponBasic = facilityOrbital("Orbital Weapon, Basic", visualBuild("W", colors.Gray), 60);
        this.OrbitalWeaponIntermediate = facilityOrbital("Orbital Weapon, Intermediate", visualBuild("W", colors.Red), 120);
        this.OrbitalWeaponAdvanced = facilityOrbital("Orbital Weapon, Advanced", visualBuild("W", colors.Green), 240);
        this.PlanetwideFocusDiplomacy = planetwideFocus("Planetwide Diplomacy Focus", visualBuild("Focus", colors.Orange));
        this.PlanetwideFocusResearch = planetwideFocus("Planetwide Research Focus", visualBuild("Focus", colors.Blue));
        this.ShipDriveBasic = shipComponent("Ship Drive, Basic", visualBuild("Drive", colors.Gray), 30);
        this.ShipDriveIntermediate = shipComponent("Ship Drive, Intermediate", visualBuild("Drive", colors.Red), 60);
        this.ShipDriveAdvanced = shipComponent("Ship Drive, Advanced", visualBuild("Drive", colors.Green), 120);
        this.ShipDriveSupreme = shipComponent("Ship Drive, Supreme", visualBuild("Drive", colors.Red), 240);
        this.ShipGeneratorBasic = shipComponent("Ship Generator, Basic", visualBuild("Generator", colors.Gray), 30);
        this.ShipGeneratorIntermediate = shipComponent("Ship Generator, Intermediate", visualBuild("Generator", colors.Red), 60);
        this.ShipGeneratorAdvanced = shipComponent("Ship Generator, Advanced", visualBuild("Generator", colors.Green), 120);
        this.ShipGeneratorSupreme = shipComponent("Ship Generator, Supreme", visualBuild("Generator", colors.Blue), 240);
        this.ShipHullEnormous = new BuildableDefn("Ship Hull, Enormous", true, // isItem // Is it, though?
        terrainNamesOrbital, mapCellSizeInPixels, visualBuild("Hull", colors.Blue), industryToBuild(240), [], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.ShipHullLarge = new BuildableDefn("Ship Hull, Large", true, // isItem // Is it, though?
        terrainNamesOrbital, mapCellSizeInPixels, visualBuild("Hull", colors.Green), industryToBuild(120), [], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.ShipHullMedium = new BuildableDefn("Ship Hull, Medium", true, // isItem // Is it, though?
        terrainNamesOrbital, mapCellSizeInPixels, visualBuild("Hull", colors.Red), industryToBuild(60), [], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.ShipHullSmall = new BuildableDefn("Ship Hull, Small", true, // isItem // Is it, though?
        terrainNamesOrbital, mapCellSizeInPixels, visualBuild("Hull", colors.Gray), industryToBuild(30), [], // resourcesPerTurn
        null // entityModifyOnBuild
        );
        this.ShipItemCloak = shipComponent("Cloak", visualBuild("Cloak", colors.Gray), 100);
        this.ShipItemColonyBuilder = shipComponent("Colony Builder", visualBuild("Col", colors.Gray), 100);
        this.ShipItemDropShip = shipComponent("Drop Ship", visualBuild("Drop Ship", colors.Gray), 100);
        this.ShipSensorsBasic = shipComponent("Ship Sensors, Basic", visualBuild("Sensors", colors.Gray), 30);
        this.ShipSensorsIntermediate = shipComponent("Ship Sensors, Intermediate", visualBuild("Sensors", colors.Red), 60);
        this.ShipSensorsAdvanced = shipComponent("Ship Sensors, Advanced", visualBuild("Sensors", colors.Green), 120);
        this.ShipSensorsSupreme = shipComponent("Ship Sensors, Supreme", visualBuild("Sensors", colors.Blue), 240);
        this.ShipShieldBasic = shipComponent("Ship Shield, Basic", visualBuild("Shield", colors.Gray), 30);
        this.ShipShieldIntermediate = shipComponent("Ship Shield, Intermediate", visualBuild("Shield", colors.Red), 60);
        this.ShipShieldAdvanced = shipComponent("Ship Shield, Advanced", visualBuild("Shield", colors.Green), 120);
        this.ShipShieldSupreme = shipComponent("Ship Shield, Supreme", visualBuild("Shield", colors.Blue), 240);
        this.ShipWeaponBasic = shipComponent("Ship Weapon, Basic", visualBuild("Weapon", colors.Gray), 30);
        this.ShipWeaponIntermediate = shipComponent("Ship Weapon, Intermediate", visualBuild("Weapon", colors.Red), 60);
        this.ShipWeaponAdvanced = shipComponent("Ship Weapon, Advanced", visualBuild("Weapon", colors.Green), 120);
        this.ShipWeaponSupreme = shipComponent("Ship Weapon, Supreme", visualBuild("Weapon", colors.Blue), 240);
        this.Shipyard = new BuildableDefn("Shipyard", false, // isItem
        terrainNamesOrbital, mapCellSizeInPixels, new VisualGroup([
            VisualRectangle.fromSizeAndColorFill(mapCellSizeInPixels, Color.byName("Orange"))
        ]), industryToBuild(100), [], // resourcesPerTurn
        // entityModifyOnBuild
        (entity) => entity.propertyAdd(new Shipyard()));
        this.SurfaceCloak = facilitySurface("Surface Cloak", visualBuild("Cloak", colors.Gray), 120, null // resourcesPerTurn
        );
        this.SurfaceColonyHub = facilitySurface("Colony Hub", visualBuild("H", colors.Gray), 30, [new Resource("Industry", 1), new Resource("Prosperity", 1)] // resourcesPerTurn
        );
        this.SurfaceFactory = facilitySurface("Factory", visualBuild("F", colors.Red), 30, [new Resource("Industry", 1)] // resourcesPerTurn
        );
        this.SurfaceFactoryAdvanced = facilitySurface("Factory, Advanced", visualBuild("F", colors.Pink), 60, [new Resource("Industry", 2)] // resourcesPerTurn
        );
        this.SurfaceFactoryMultiplier = facilitySurface("Factory Multiplier", visualBuild("FM", colors.Pink), 120, null // resourcesPerTurn
        );
        this.SurfaceLaboratory = facilitySurface("Laboratory", visualBuild("L", colors.Blue), 30, [new Resource("Research", 1)] // resourcesPerTurn
        );
        this.SurfaceLaboratoryAdvanced = facilitySurface("Laboratory, Advanced", visualBuild("L", colors.BlueLight), 30, [new Resource("Research", 2)] // resourcesPerTurn
        );
        this.SurfaceLaboratoryMultiplier = facilitySurface("Laboratory Multiplier", visualBuild("LM", colors.Pink), 120, null // resourcesPerTurn
        );
        this.SurfacePlantation = facilitySurface("Plantation", visualBuild("P", colors.Green), 30, [new Resource("Prosperity", 1)] // resourcesPerTurn
        );
        this.SurfacePlantationAdvanced = facilitySurface("Plantation, Advanced", visualBuild("P", colors.GreenLight), 30, [new Resource("Prosperity", 2)] // resourcesPerTurn
        );
        this.SurfaceShield = facilitySurface("Surface Shield", visualBuild("S", colors.Red), 30, null // resourcesPerTurn
        );
        this.SurfaceShieldAdvanced = facilitySurface("Surface Shield, Advanced", visualBuild("S", colors.Blue), 60, null // resourcesPerTurn
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
            ];
    }
}
