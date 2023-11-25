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
    cellPositionsAvailableToBuildOnSurface(universe) {
        var returnValues = new Array();
        var layout = this.layout(universe);
        var layoutMap = layout.map;
        var mapSizeInCells = layoutMap.sizeInCells;
        var cellPosInCells = Coords.create();
        var terrainSurface = layoutMap.terrainByName("Surface");
        for (var y = 0; y < mapSizeInCells.y; y++) {
            cellPosInCells.y = y;
            for (var x = 0; x < mapSizeInCells.x; x++) {
                cellPosInCells.x = x;
                var terrainAtPos = layoutMap.terrainAtPosInCells(cellPosInCells);
                var isSurface = (terrainAtPos == terrainSurface);
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
                if (isOrbit == false) {
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
    shipAdd(shipToAdd) {
        this.ships.push(shipToAdd);
        shipToAdd.locatable().loc.placeName = Planet.name + ":" + this.name;
    }
    shipRemove(shipToRemove) {
        ArrayHelper.remove(this.ships, shipToRemove);
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
        var populationCurrent = this.demographics.population;
        var populationOccupied = this.populationOccupied(universe);
        var populationIdle = populationCurrent - populationOccupied;
        return populationIdle;
    }
    populationIdleExists(universe) {
        return this.populationIdle(universe) > 0;
    }
    populationMax() {
        return this.planetType.size.populationMax();
    }
    populationOccupied(universe) {
        var layout = this.layout(universe);
        var facilities = layout.facilities();
        var facilitiesAutomated = facilities.filter(x => Buildable.ofEntity(x).isAutomated);
        var returnValue = facilities.length - facilitiesAutomated.length;
        return returnValue;
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
            this._resourcesPerTurn = null;
            this._resourcesPerTurnByName = null;
            var layout = this.layout(universe);
            layout.updateForRound(universe, world, faction, null);
            this.industry.updateForRound(universe, world, faction, this);
            this.demographics.updateForRound(universe, world, faction, this);
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
    industryAccumulated() {
        return this.industry.planetIndustryAccumulated(this);
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
            var resourcesSoFar = new Array();
            var layout = this.layout(universe);
            var facilities = layout.facilities();
            for (var f = 0; f < facilities.length; f++) {
                var facility = Buildable.ofEntity(facilities[f]);
                if (facility.isComplete) {
                    var facilityDefn = facility.defn(world);
                    var facilityResources = facilityDefn.resourcesPerTurn;
                    Resource.addManyToMany(resourcesSoFar, facilityResources);
                }
            }
            this._resourcesPerTurn = resourcesSoFar;
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
}
