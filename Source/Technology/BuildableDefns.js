"use strict";
class BuildableDefnsBasic {
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
        var effects = BuildableEffect.Instances();
        var effectNone = effects.None;
        var effectTodo = effects.ThrowError;
        var facilityOrbital = (name, visual, industryToBuildAmount) => new BuildableDefn(name, false, // isItem
        terrainNamesOrbital, mapCellSizeInPixels, visual, industryToBuildAmount, effectTodo, // effect
        null, // categories
        null // entityModifyOnBuild
        );
        var facilitySurfaceUsable = (name, visual, industryToBuildAmount, effect) => new BuildableDefn(name, false, // isItem
        terrainNamesSurfaceUsable, mapCellSizeInPixels, visual, industryToBuildAmount, effect, null, // categories
        null // entityModifyOnBuild
        );
        var facilitySurfaceAnywhere = (name, visual, industryToBuildAmount) => new BuildableDefn(name, false, // isItem
        terrainNamesSurface, mapCellSizeInPixels, visual, industryToBuildAmount, effectTodo, null, // categories
        null // entityModifyOnBuild
        );
        var planetwideFocus = (name, visual) => new BuildableDefn(name, null, // isItem
        null, // terrainNames,
        mapCellSizeInPixels, visual, null, // industryToBuildAmount,
        effectTodo, null, // categories
        null // entityModifyOnBuild
        );
        var shipComponent = (name, visual, industryToBuildAmount) => new BuildableDefn(name, true, // isItem
        terrainNamesShip, mapCellSizeInPixels, visual, industryToBuildAmount, effectTodo, null, // categories
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
        this.ShipHullEnormous = new BuildableDefn("Ship Hull, Enormous", false, // isItem
        terrainNamesOrbital, mapCellSizeInPixels, visualBuild("Hull", colors.Blue), 240, null, // effect
        null, // categories
        null // entityModifyOnBuild
        );
        this.ShipHullLarge = new BuildableDefn("Ship Hull, Large", false, // isItem
        terrainNamesOrbital, mapCellSizeInPixels, visualBuild("Hull", colors.Green), 120, null, // effect
        null, // categories
        null // entityModifyOnBuild
        );
        this.ShipHullMedium = new BuildableDefn("Ship Hull, Medium", false, // isItem
        terrainNamesOrbital, mapCellSizeInPixels, visualBuild("Hull", colors.Red), 60, null, // effect
        null, // categories
        null // entityModifyOnBuild
        );
        this.ShipHullSmall = new BuildableDefn("Ship Hull, Small", false, // isItem
        terrainNamesOrbital, mapCellSizeInPixels, visualBuild("Hull", colors.Gray), 30, null, // effect
        null, // categories
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
        ]), 100, effectNone, null, // categories
        // entityModifyOnBuild
        (entity) => entity.propertyAdd(new Shipyard()));
        this.SurfaceCloak = facilitySurfaceUsable("Surface Cloak", visualBuild("Cloak", colors.Gray), 120, effectNone);
        this.SurfaceColonyHub = facilitySurfaceUsable("Colony Hub", visualBuild("Hub", colors.Gray), 30, effectTodo // [ new Resource("Industry", 1), new Resource("Prosperity", 1) ] // resourcesPerTurn
        );
        this.SurfaceFactory = facilitySurfaceUsable("Factory", visualBuild("Factory", colors.Red), 30, effectTodo // [ new Resource("Industry", 1) ] // resourcesPerTurn
        );
        this.SurfaceFactoryAdvanced = facilitySurfaceUsable("Factory, Advanced", visualBuild("Factory2", colors.Pink), 60, effectTodo // [ new Resource("Industry", 2) ] // resourcesPerTurn
        );
        this.SurfaceFactoryMultiplier = facilitySurfaceUsable("Factory Multiplier", visualBuild("FacX", colors.Pink), 120, effectTodo // resourcesPerTurn
        );
        this.SurfaceLaboratory = facilitySurfaceUsable("Laboratory", visualBuild("Lab", colors.Blue), 30, effectNone // [ new Resource("Research", 1) ] // resourcesPerTurn
        );
        this.SurfaceLaboratoryAdvanced = facilitySurfaceUsable("Laboratory, Advanced", visualBuild("L", colors.BlueLight), 60, effectNone // [ new Resource("Research", 2) ] // resourcesPerTurn
        );
        this.SurfaceLaboratoryMultiplier = facilitySurfaceUsable("Laboratory Multiplier", visualBuild("LM", colors.Pink), 120, effectNone);
        this.SurfacePlantation = facilitySurfaceUsable("Plantation", visualBuild("Plant", colors.Green), 30, effectTodo // [ new Resource("Prosperity", 1) ] // resourcesPerTurn
        );
        this.SurfacePlantationAdvanced = facilitySurfaceUsable("Plantation, Advanced", visualBuild("Plant2", colors.GreenLight), 60, effectTodo // [ new Resource("Prosperity", 2) ] // resourcesPerTurn
        );
        this.SurfaceShield = facilitySurfaceUsable("Surface Shield", visualBuild("Shield", colors.Red), 30, null // resourcesPerTurn
        );
        this.SurfaceShieldAdvanced = facilitySurfaceUsable("Surface Shield, Advanced", visualBuild("Shield2", colors.Blue), 60, null // resourcesPerTurn
        );
        this.SurfaceTransportTubes = facilitySurfaceAnywhere("Transport Tubes", visualBuild("Transp", colors.Red), 15);
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
