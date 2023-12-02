"use strict";
class Planet extends Entity {
    constructor(name, planetType, pos, factionName, demographics, industry, layout) {
        super(name, [
            planetType.bodyDefn(),
            Collidable.fromCollider(Sphere.fromRadiusAndCenter(VisualStar.radiusActual(), pos)),
            new Controllable(Planet.toControl),
            new Factionable(factionName),
            ItemHolder.create(),
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
        return new Planet(name, planetType, pos, null, // factionName
        null, // demographics
        null, // industry
        null // layout
        );
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
                    var bodyAtPos = layoutMap.bodyAtPosInCells(cellPosInCells);
                    var isVacant = (bodyAtPos == null);
                    if (isVacant) {
                        var bodiesNeighboring = layoutMap.bodiesNeighboringPosInCells(cellPosInCells);
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
                    var bodyAtPos = layoutMap.bodyAtPosInCells(cellPosInCells);
                    var isVacant = (bodyAtPos == null);
                    if (isVacant) {
                        var bodiesNeighboring = layoutMap.bodiesNeighboringPosInCells(cellPosInCells);
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
        var terrainOrbit = layoutMap.terrainByName("Orbit");
        for (var y = 0; y < mapSizeInCells.y; y++) {
            cellPosInCells.y = y;
            for (var x = 0; x < mapSizeInCells.x; x++) {
                cellPosInCells.x = x;
                var terrainAtPos = layoutMap.terrainAtPosInCells(cellPosInCells);
                var isOrbit = (terrainAtPos == terrainOrbit);
                if (isOrbit) {
                    var bodyAtPos = layoutMap.bodyAtPosInCells(cellPosInCells);
                    var isVacant = (bodyAtPos == null);
                    if (isVacant) {
                        returnValues.push(cellPosInCells.clone());
                    }
                }
            }
        }
        return returnValues;
    }
    faction(world) {
        return this.factionable().faction(world);
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
    shipAddToOrbit(shipToAdd) {
        this.ships.push(shipToAdd);
        shipToAdd.locatable().loc.placeName = Planet.name + ":" + this.name;
    }
    shipLeaveOrbit(shipToLeaveOrbit, world) {
        ArrayHelper.remove(this.ships, shipToLeaveOrbit);
        var shipLoc = shipToLeaveOrbit.locatable().loc;
        var planetPos = this.locatable().loc.pos;
        var starsystem = this.starsystem(world);
        shipLoc.placeName = Starsystem.name + starsystem.name;
        shipLoc.pos.overwriteWith(planetPos); // todo - offset.
        starsystem.shipAdd(shipToLeaveOrbit, world);
    }
    starsystem(world) {
        var networkNodeFound = world.network.nodes.find(x => (x.starsystem.planets.indexOf(this) >= 0));
        var starsystemFound = (networkNodeFound == null ? null : networkNodeFound.starsystem);
        return starsystemFound;
    }
    toEntity() {
        return this;
    }
    toStringDescription(universe, world) {
        var resourcesPerTurnAsString = this.resourcesPerTurn(universe, world).join(", ");
        var returnValue = this.name
            + " - " + this.demographics.toStringDescription()
            + " - " + resourcesPerTurnAsString
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
            new ControlLabel("labelName", Coords.fromXY(0, 0), // pos
            Coords.fromXY(size.x, 0), // size
            false, // isTextCenteredHorizontally
            false, // isTextCenteredVertically
            DataBinding.fromContext(this.name), FontNameAndHeight.fromHeightInPixels(10))
        ]);
        return returnValue;
    }
    // Demographics.
    populationAdd(universe, amountToAdd) {
        this.demographics.populationAdd(universe, this, amountToAdd);
    }
    populationIncrement(universe) {
        this.populationAdd(universe, 1);
    }
    prosperityAccumulated() {
        return this.resourcesAccumulated.find(x => x.defnName == "Prosperity").quantity;
    }
    prosperityNetWithNeededToGrow(universe) {
        var prosperityNet = this.prosperityPerTurn(universe, universe.world, null);
        var prosperityAccumulated = this.prosperityAccumulated();
        var prosperityNeededToGrow = this.demographics.prosperityNeededToGrow();
        var returnValue = "+" + prosperityNet + "(" + prosperityAccumulated + "/" + prosperityNeededToGrow + " to grow)";
        return returnValue;
    }
    populationIdle(universe) {
        return this.demographics.populationIdle(universe, this);
    }
    populationIdleExists(universe) {
        return this.populationIdle(universe) > 0;
    }
    populationMax() {
        return this.planetType.size.populationMax();
    }
    populationOccupied(universe) {
        return this.demographics.populationOccupied(universe, this);
    }
    populationOverMaxPlusIdle(universe) {
        var populationCurrent = this.demographics.population;
        var populationIdle = this.populationIdle(universe);
        var returnValue = "" + populationCurrent + "/" + this.populationMax() + " (Idle: " + populationIdle + ")";
        return returnValue;
    }
    // diplomacy
    strategicValue(world) {
        return 1; // todo
    }
    // turns
    updateForRound(universe, world, faction) {
        if (faction != null) {
            this.resourcesPerTurnReset();
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
        var industryPerTurn = this.industryPerTurn(universe, world);
        var buildableAndProgress = this.industryBuildableAndProgress(universe);
        var returnValue = industryPerTurn
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
    industryPerTurn(universe, world) {
        var resource = this.resourcesPerTurnByName(universe, world).get("Industry");
        return (resource == null ? 0 : resource.quantity);
    }
    prosperityPerTurn(universe, world, faction) {
        var prosperityGross = this.resourcesPerTurnByName(universe, world).get("Prosperity").quantity;
        var prosperityConsumed = Math.floor(this.demographics.population / 4);
        var prosperityNet = prosperityGross - prosperityConsumed;
        var inefficiencyExponent = 0.85;
        prosperityNet = Math.pow(prosperityNet, inefficiencyExponent);
        prosperityNet = Math.round(prosperityNet);
        return prosperityNet;
    }
    researchPerTurn(universe, world, faction) {
        var resource = this.resourcesPerTurnByName(universe, world).get("Research");
        return (resource == null ? 0 : resource.quantity);
    }
    resourcesPerTurn(universe, world) {
        if (this._resourcesPerTurn == null) {
            this._resourcesPerTurn = new Array();
            var uwpe = new UniverseWorldPlaceEntities(universe, world, null, this, null);
            var layout = this.layout(universe);
            var facilities = layout.facilities();
            for (var f = 0; f < facilities.length; f++) {
                var facilityAsEntity = facilities[f];
                var facility = Buildable.ofEntity(facilityAsEntity);
                if (facility.isComplete) {
                    uwpe.entity2Set(facilityAsEntity);
                    facility.effectPerRoundApply(uwpe);
                }
            }
            this._resourcesPerTurnByName = null;
        }
        return this._resourcesPerTurn;
    }
    resourcesPerTurnByName(universe, world) {
        if (this._resourcesPerTurnByName == null) {
            var resourcesPerTurn = this.resourcesPerTurn(universe, world);
            this._resourcesPerTurnByName = ArrayHelper.addLookups(resourcesPerTurn, (x) => x.defnName);
        }
        return this._resourcesPerTurnByName;
    }
    resourcesPerTurnAdd(resourcesToAdd) {
        Resource.addManyToMany(resourcesToAdd, this._resourcesPerTurn);
    }
    resourcesPerTurnReset() {
        this._resourcesPerTurn = null;
        this._resourcesPerTurnByName = null;
    }
}
