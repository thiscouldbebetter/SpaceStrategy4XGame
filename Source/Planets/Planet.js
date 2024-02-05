"use strict";
class Planet extends Entity {
    constructor(name, planetType, pos, faction, demographics, industry, layout) {
        super(name, [
            planetType.bodyDefn(),
            Collidable.fromCollider(Sphere.fromRadiusAndCenter(VisualStar.radiusActual(), pos)),
            new Controllable(Planet.toControl),
            new DeviceUser([]),
            Drawable.fromVisual(Planet.visualBuild(planetType)),
            new Factionable(faction),
            Locatable.fromPos(pos)
        ]);
        this.planetType = planetType;
        this.demographics = demographics;
        this.industry = industry;
        this._layout = layout;
        this.ships = [];
        this.resourcesAccumulated =
            [
                new Resource("Industry", 0),
                new Resource("Prosperity", 0)
            ];
    }
    static fromNameTypeAndPos(name, planetType, pos) {
        return new Planet(name, planetType, pos, null, // faction
        null, // demographics
        null, // industry
        null // layout
        );
    }
    static generateRandom(universe, starsystemName, starsystemSize) {
        var planetType = PlanetType.random();
        var planetPos = Coords.create().randomize(universe.randomizer).multiply(starsystemSize).double().subtract(starsystemSize);
        var planetDemographics = new PlanetDemographics(0);
        var planetIndustry = new PlanetIndustry();
        var planet = new Planet(null, // name
        planetType, planetPos, null, // factionName
        planetDemographics, planetIndustry, null // layout
        );
        return planet;
    }
    // instance methods
    cellPositionsAvailableToBuildBuildableDefn(universe, buildableDefn) {
        var returnValues = new Array();
        var layout = this.layout(universe);
        var layoutMap = layout.map;
        var mapSizeInCells = layoutMap.sizeInCells;
        var cellPosInCells = Coords.create();
        for (var y = 0; y < mapSizeInCells.y; y++) {
            cellPosInCells.y = y;
            for (var x = 0; x < mapSizeInCells.x; x++) {
                cellPosInCells.x = x;
                var canBuildableBeBuiltOnTerrain = buildableDefn.canBeBuiltOnMapAtPosInCells(layoutMap, cellPosInCells);
                if (canBuildableBeBuiltOnTerrain) {
                    var bodyAtPos = layoutMap.entityAtPosInCells(cellPosInCells);
                    var isVacant = (bodyAtPos == null);
                    if (isVacant) {
                        var bodiesNeighboring = layoutMap.entitiesNeighboringPosInCells(cellPosInCells);
                        if (bodiesNeighboring.length > 0) {
                            returnValues.push(cellPosInCells.clone());
                        }
                    }
                }
            }
        }
        return returnValues;
    }
    cellPositionsAvailableToBuildOnSurface(universe) {
        var returnValues = new Array();
        var layout = this.layout(universe);
        var layoutMap = layout.map;
        var mapSizeInCells = layoutMap.sizeInCells;
        var cellPosInCells = Coords.create();
        for (var y = 0; y < mapSizeInCells.y; y++) {
            cellPosInCells.y = y;
            for (var x = 0; x < mapSizeInCells.x; x++) {
                cellPosInCells.x = x;
                var terrainAtPos = layoutMap.terrainAtPosInCells(cellPosInCells);
                var isSurface = terrainAtPos.isSurface();
                if (isSurface) {
                    var bodyAtPos = layoutMap.entityAtPosInCells(cellPosInCells);
                    var isVacant = (bodyAtPos == null);
                    if (isVacant) {
                        var bodiesNeighboring = layoutMap.entitiesNeighboringPosInCells(cellPosInCells);
                        if (bodiesNeighboring.length > 0) {
                            returnValues.push(cellPosInCells.clone());
                        }
                    }
                }
            }
        }
        return returnValues;
    }
    cellPositionsAvailableToOccupyInOrbit(universe) {
        var returnValues = new Array();
        var layout = this.layout(universe);
        var layoutMap = layout.map;
        var mapSizeInCells = layoutMap.sizeInCells;
        var cellPosInCells = Coords.create();
        var terrainOrbit = layoutMap.terrainByName("Orbital");
        for (var y = 0; y < mapSizeInCells.y; y++) {
            cellPosInCells.y = y;
            for (var x = 0; x < mapSizeInCells.x; x++) {
                cellPosInCells.x = x;
                var terrainAtPos = layoutMap.terrainAtPosInCells(cellPosInCells);
                var isOrbit = (terrainAtPos == terrainOrbit);
                if (isOrbit) {
                    var bodyAtPos = layoutMap.entityAtPosInCells(cellPosInCells);
                    var isVacant = (bodyAtPos == null);
                    if (isVacant) {
                        returnValues.push(cellPosInCells.clone());
                    }
                }
            }
        }
        return returnValues;
    }
    cellsAreVacantInOrbit(universe) {
        var haveAnyOrbitalCellsBeenVacantSoFar = false;
        var layout = this.layout(universe);
        var layoutMap = layout.map;
        var mapSizeInCells = layoutMap.sizeInCells;
        var cellPosInCells = Coords.create();
        for (var y = 0; y < mapSizeInCells.y; y++) {
            cellPosInCells.y = y;
            for (var x = 0; x < mapSizeInCells.x; x++) {
                cellPosInCells.x = x;
                var entityAtPos = layoutMap.entityAtPosInCells(cellPosInCells);
                var isVacant = (entityAtPos == null);
                if (isVacant) {
                    haveAnyOrbitalCellsBeenVacantSoFar = true;
                    break;
                }
            }
        }
        return haveAnyOrbitalCellsBeenVacantSoFar;
    }
    faction() {
        return this.factionable().faction();
    }
    factionWithShipsOrShieldsInOrbit(universe) {
        var factionFound = null;
        var shipsInOrbit = this.ships;
        if (shipsInOrbit.length > 0) {
            factionFound = shipsInOrbit[0].factionable().faction();
        }
        else if (this.shieldsArePresentInOrbit(universe)) {
            factionFound = this.faction();
        }
        return factionFound;
    }
    factionable() {
        return this.propertyByName(Factionable.name);
    }
    isAwaitingTarget() {
        return (this.deviceSelected != null);
    }
    jumpTo(universe) {
        var venuePlanet = new VenueLayout(universe.venueCurrent(), this, // modelParent
        this.layout(universe));
        universe.venueTransitionTo(venuePlanet);
    }
    layout(universe) {
        if (this._layout == null) {
            this._layout = this.planetType.layoutCreate(universe);
        }
        return this._layout;
    }
    notificationsForRoundAddToArray(universe, world, faction, notificationsSoFar) {
        var layout = this.layout(universe);
        layout.notificationsForRoundAddToArray(universe, world, faction, this, notificationsSoFar);
        this.industry.notificationsForRoundAddToArray(universe, world, this, notificationsSoFar);
        this.demographics.notificationsForRoundAddToArray(notificationsSoFar);
        return notificationsSoFar;
    }
    shieldsArePresentInOrbit(universe) {
        var layout = this.layout(universe);
        var areShieldsPresent = layout.shieldsArePresentInOrbit();
        return areShieldsPresent;
    }
    shipAddToOrbit(shipToAdd, universe) {
        var areAnyOrbitalCellsVacant = this.cellsAreVacantInOrbit(universe);
        if (areAnyOrbitalCellsVacant == false) {
            throw new Error("No empty spaces in orbit for ship.");
        }
        else {
            this.ships.push(shipToAdd);
            var placeName = Planet.name + ":" + this.name;
            var shipLoc = shipToAdd.locatable().loc;
            shipLoc.placeName = placeName;
            var cellPos = this.cellPositionsAvailableToOccupyInOrbit(universe)[0];
            shipLoc.pos.overwriteWith(cellPos);
            var layout = this.layout(universe);
            layout.map.entityAdd(shipToAdd);
        }
    }
    shipLeaveOrbit(shipToLeaveOrbit, uwpe) {
        ArrayHelper.remove(this.ships, shipToLeaveOrbit);
        var shipLoc = shipToLeaveOrbit.locatable().loc;
        var planetPos = this.locatable().loc.pos;
        var world = uwpe.world;
        var starsystem = this.starsystem(world);
        shipLoc.placeName = Starsystem.name + starsystem.name;
        shipLoc.pos.overwriteWith(planetPos); // todo - offset.
        starsystem.shipAdd(shipToLeaveOrbit, uwpe);
    }
    shipsArePresentInOrbit() {
        return (this.ships.length > 0);
    }
    shipsOrShieldsArePresentInOrbit(universe) {
        var areShipsOrShieldsPresent = this.shipsArePresentInOrbit()
            || this.shieldsArePresentInOrbit(universe);
        return areShipsOrShieldsPresent;
    }
    starsystem(world) {
        var starClusterNodeFound = world.starCluster.nodes.find(x => (x.starsystem.planets.indexOf(this) >= 0));
        var starsystemFound = (starClusterNodeFound == null ? null : starClusterNodeFound.starsystem);
        return starsystemFound;
    }
    toEntity() {
        return this;
    }
    toPlace() {
        return new PlanetAsPlace(this);
    }
    toStringDescription(universe, world) {
        var resourcesThisRoundAsString = this.resourcesThisRound(universe, world).join(", ");
        var returnValue = this.name
            + " - " + this.demographics.toStringDescription()
            + " - " + resourcesThisRoundAsString
            + " - " + this.industry.toStringDescription(universe, world, this)
            + ".";
        return returnValue;
    }
    // controls
    static toControl(uwpe, size, controlTypeName) {
        var universe = uwpe.universe;
        var planet = uwpe.entity;
        var returnValue = planet.toControl_Starsystem(universe, size);
        return returnValue;
    }
    toControl_Starsystem(universe, size) {
        var returnValue = ControlContainer.from4("containerPlanet", Coords.fromXY(0, 0), // pos
        size, [
            ControlLabel.from4Uncentered(Coords.fromXY(0, 0), // pos
            Coords.fromXY(size.x, 0), // size
            DataBinding.fromContext(this.name), FontNameAndHeight.fromHeightInPixels(10))
        ]);
        return returnValue;
    }
    // Demographics.
    population() {
        return this.demographics.population;
    }
    populationAdd(universe, amountToAdd) {
        this.demographics.populationAdd(universe, this, amountToAdd);
    }
    populationIncrement(universe) {
        this.populationAdd(universe, 1);
    }
    populationIdle(universe) {
        return this.demographics.populationIdle(universe, this);
    }
    populationIdleExists(universe) {
        return this.populationIdle(universe) > 0;
    }
    populationMax() {
        if (this._populationMax == null) {
            this._populationMax = this.planetType.size.populationMax();
        }
        return this._populationMax;
    }
    populationMaxAdd(populationToAdd) {
        this._populationMax += populationToAdd;
    }
    populationOccupied(universe) {
        return this.demographics.populationOccupied(universe, this);
    }
    populationOverMaxPlusIdle(universe) {
        var populationCurrent = this.demographics.population;
        var populationIdle = this.populationIdle(universe);
        var returnValue = "" + populationCurrent + "/" + this.populationMax()
            + " (Idle: " + populationIdle + ")";
        return returnValue;
    }
    prosperityAccumulated() {
        return this.resourcesAccumulated.find(x => x.defnName == "Prosperity").quantity;
    }
    prosperityNetWithNeededToGrow(universe) {
        var prosperityNet = this.prosperityThisRound(universe, universe.world, null);
        var prosperityAccumulated = this.prosperityAccumulated();
        var prosperityNeededToGrow = this.demographics.prosperityNeededToGrow();
        var returnValue = "+" + prosperityNet + "(" + prosperityAccumulated + "/" + prosperityNeededToGrow + " to grow)";
        return returnValue;
    }
    // diplomacy
    strategicValue(world) {
        return 1; // todo
    }
    // turns
    updateForRound(universe, world, faction) {
        if (faction != null) {
            this.resourcesThisRoundReset();
            var layout = this.layout(universe);
            layout.updateForRound(universe, world, faction, null);
            this.demographics.updateForRound(universe, world, faction, this);
            this.industry.updateForRound(universe, world, faction, this);
        }
    }
    // resources
    buildableEntitiesRemove(universe, entities) {
        this.layout(universe).buildableEntitiesRemove(entities);
    }
    buildableEntityBuild(universe, entity) {
        this.layout(universe).buildableEntityBuild(entity);
    }
    buildableEntityInProgress(universe) {
        return this.layout(universe).buildableEntityInProgress();
    }
    buildableInProgress(universe) {
        var buildableEntityInProgress = this.buildableEntityInProgress(universe);
        var returnValue = (buildableEntityInProgress == null
            ? null
            : Buildable.ofEntity(buildableEntityInProgress));
        return returnValue;
    }
    industryAccumulatedQuantity() {
        return this.industry.planetIndustryAccumulated(this).quantity;
    }
    industryAndBuildableInProgress(universe, world) {
        var industryThisRound = this.industryThisRound(universe, world);
        var buildableAndProgress = this.industryBuildableAndProgress(universe);
        var returnValue = industryThisRound
            + " " + buildableAndProgress;
        return returnValue;
    }
    industryBuildableAndProgress(universe) {
        var buildable = this.buildableInProgress(universe);
        var buildableAndProgress;
        if (buildable == null) {
            buildableAndProgress = "(building nothing)";
        }
        else {
            var buildableDefn = buildable.defn;
            var industryAccumulated = this.industryAccumulatedQuantity();
            var industryRequired = buildableDefn.industryToBuild;
            buildableAndProgress =
                "(" + industryAccumulated
                    + "/" + industryRequired
                    + " for " + buildableDefn.name + ")";
        }
        return buildableAndProgress;
    }
    industryBuildableProgress(universe) {
        var buildable = this.buildableInProgress(universe);
        var buildableProgress;
        if (buildable == null) {
            buildableProgress = "(-/-)";
        }
        else {
            var buildableDefn = buildable.defn;
            var industryAccumulated = this.industryAccumulatedQuantity();
            var industryRequired = buildableDefn.industryToBuild;
            buildableProgress =
                "(" + industryAccumulated + "/" + industryRequired + ")";
        }
        return buildableProgress;
    }
    industryThisRound(universe, world) {
        if (this._industryThisRound == null) {
            var resource = this.resourcesThisRoundByName(universe, world).get("Industry");
            this._industryThisRound = (resource == null ? 0 : resource.quantity);
        }
        return this._industryThisRound;
    }
    industryThisRoundClear() {
        this._industryThisRound = 0;
    }
    industryThisRoundAdd(amount) {
        this._industryThisRound += amount;
    }
    prosperityThisRound(universe, world, faction) {
        var prosperityGross = this.resourcesThisRoundByName(universe, world).get("Prosperity").quantity;
        var prosperityConsumed = Math.floor(this.demographics.population / 4);
        var prosperityNet = prosperityGross - prosperityConsumed;
        var inefficiencyExponent = 0.85;
        prosperityNet = Math.pow(prosperityNet, inefficiencyExponent);
        prosperityNet = Math.round(prosperityNet);
        return prosperityNet;
    }
    researchThisRound(universe, world, faction) {
        var resource = this.resourcesThisRoundByName(universe, world).get("Research");
        return (resource == null ? 0 : resource.quantity);
    }
    resourceThisRoundByName(universe, world, resourceDefnName) {
        var resourcesThisRoundByName = this.resourcesThisRoundByName(universe, world);
        var returnValue = resourcesThisRoundByName.get(resourceDefnName);
        return returnValue;
    }
    resourcesThisRound(universe, world) {
        if (this._resourcesThisRound == null) {
            this._resourcesThisRound = new Array();
            var thisAsPlace = this.toPlace();
            var uwpe = new UniverseWorldPlaceEntities(universe, world, thisAsPlace, null, null);
            var layout = this.layout(universe);
            var facilities = layout.facilities();
            for (var f = 0; f < facilities.length; f++) {
                var facilityAsEntity = facilities[f];
                var facility = Buildable.ofEntity(facilityAsEntity);
                if (facility.isComplete) {
                    uwpe.entitySet(facilityAsEntity);
                    facility.effectPerRoundApply(uwpe);
                }
            }
            this._resourcesThisRoundByName = null;
        }
        return this._resourcesThisRound;
    }
    resourcesThisRoundByName(universe, world) {
        if (this._resourcesThisRoundByName == null) {
            var resourcesThisRound = this.resourcesThisRound(universe, world);
            this._resourcesThisRoundByName = ArrayHelper.addLookups(resourcesThisRound, (x) => x.defnName);
        }
        return this._resourcesThisRoundByName;
    }
    resourcesThisRoundAdd(resourcesToAdd) {
        Resource.addManyToMany(resourcesToAdd, this._resourcesThisRound);
    }
    resourcesThisRoundReset() {
        this._resourcesThisRound = null;
        this._resourcesThisRoundByName = null;
    }
    // Visual.
    static visualBuild(planetType) {
        var returnVisual = planetType.visualProjected();
        return returnVisual;
    }
}
