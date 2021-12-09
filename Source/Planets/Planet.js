"use strict";
class Planet extends Entity {
    constructor(name, bodyDefn, pos, factionName, demographics, industry, layout) {
        super(name, [
            bodyDefn,
            ItemHolder.create(),
            Locatable.fromPos(pos)
        ]);
        this.bodyDefn = bodyDefn;
        this.factionName = factionName;
        this.demographics = demographics;
        this.industry = industry;
        this.layout = layout;
        this.ships = [];
        this.resourcesAccumulated = [];
    }
    static fromNameBodyDefnAndPos(name, bodyDefn, pos) {
        return new Planet(name, bodyDefn, pos, null, null, null, null);
    }
    static bodyDefnPlanet() {
        if (Planet._bodyDefnPlanet == null) {
            Planet._bodyDefnPlanet = new BodyDefn("Planet", Coords.fromXY(10, 10), // size
            new VisualGroup([
                new VisualCircleGradient(10, // radius
                new ValueBreakGroup([
                    new ValueBreak(0, Color.byName("White")),
                    new ValueBreak(.2, Color.byName("White")),
                    new ValueBreak(.3, Color.byName("Cyan")),
                    new ValueBreak(.75, Color.byName("Cyan")),
                    new ValueBreak(1, Color.byName("Black")),
                ], null // ?
                ), null // colorBorder
                ),
                new VisualDynamic // todo - VisualDynamic2?
                ((uwpe) => {
                    var factionName = "todo"; // todo
                    var returnValue = null;
                    if (factionName == null) {
                        returnValue = new VisualNone();
                    }
                    else {
                        returnValue = new VisualOffset(VisualText.fromTextAndColor(factionName, Color.byName("White")), Coords.fromXY(0, 16));
                    }
                    return returnValue;
                })
            ]));
        }
        return Planet._bodyDefnPlanet;
    }
    static bodyDefnStar() {
        var starName = "Star";
        var starRadius = 30;
        var starColor = Color.Instances().Yellow;
        if (Planet._bodyDefnStar == null) {
            Planet._bodyDefnStar =
                new BodyDefn("Star", Coords.fromXY(1, 1).multiplyScalar(starRadius), // size
                new VisualGroup([
                    new VisualCircle(starRadius, starColor, starColor, null),
                    VisualText.fromTextAndColor(starName, Color.byName("Gray"))
                ]));
        }
        return Planet._bodyDefnStar;
    }
    // instance methods
    cellPositionsAvailableToBuildOnSurface() {
        var returnValues = new Array();
        var map = this.layout.map;
        var mapSizeInCells = map.sizeInCells;
        var cellPosInCells = Coords.create();
        var terrainSurface = this.layout.map.terrainByName("Surface");
        for (var y = 0; y < mapSizeInCells.y; y++) {
            cellPosInCells.y = y;
            for (var x = 0; x < mapSizeInCells.x; x++) {
                cellPosInCells.x = x;
                var terrainAtPos = map.terrainAtPosInCells(cellPosInCells);
                var isSurface = (terrainAtPos == terrainSurface);
                if (isSurface) {
                    var bodyAtPos = map.bodyAtPosInCells(cellPosInCells);
                    var isVacant = (bodyAtPos == null);
                    if (isVacant) {
                        var bodiesNeighboring = map.bodiesNeighboringPosInCells(cellPosInCells);
                        if (bodiesNeighboring.length > 0) {
                            returnValues.push(cellPosInCells.clone());
                        }
                    }
                }
            }
        }
        return returnValues;
    }
    cellPositionsAvailableToOccupyInOrbit() {
        var returnValues = new Array();
        var map = this.layout.map;
        var mapSizeInCells = map.sizeInCells;
        var cellPosInCells = Coords.create();
        var terrainOrbit = this.layout.map.terrainByName("Orbit");
        for (var y = 0; y < mapSizeInCells.y; y++) {
            cellPosInCells.y = y;
            for (var x = 0; x < mapSizeInCells.x; x++) {
                cellPosInCells.x = x;
                var terrainAtPos = map.terrainAtPosInCells(cellPosInCells);
                var isOrbit = (terrainAtPos == terrainOrbit);
                if (isOrbit == false) {
                    var bodyAtPos = map.bodyAtPosInCells(cellPosInCells);
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
        return (this.factionName == null ? null : world.factionByName(this.factionName));
    }
    toEntity() {
        return this;
    }
    shipAdd(shipToAdd) {
        this.ships.push(shipToAdd);
    }
    shipRemove(shipToRemove) {
        ArrayHelper.remove(this.ships, shipToRemove);
    }
    starsystem(world) {
        var networkNodeFound = world.network.nodes.find(x => (x.starsystem.planets.indexOf(this) >= 0));
        var starsystemFound = (networkNodeFound == null ? null : networkNodeFound.starsystem);
        return starsystemFound;
    }
    // controls
    toControl(universe, size) {
        var returnValue = ControlContainer.from4("containerPlanet", Coords.fromXY(0, 0), // pos
        size, [
            new ControlLabel("labelName", Coords.fromXY(0, 0), // pos
            Coords.fromXY(size.x, 0), // size
            false, // isTextCentered
            DataBinding.fromContext(this.name), 10 // fontHeightInPixels
            )
        ]);
        return returnValue;
    }
    // diplomacy
    strength(world) {
        return 1; // todo
    }
    // turns
    updateForTurn(universe, world, faction) {
        if (faction != null) {
            this._resourcesPerTurn = null;
            this._resourcesPerTurnByName = null;
            this.layout.updateForTurn(universe, world, faction, null);
            this.industry.updateForTurn(universe, world, faction, this);
            this.demographics.updateForTurn(universe, world, faction, this);
        }
    }
    // resources
    buildableEntitiesRemove(buildableEntitiesToRemove) {
        buildableEntitiesToRemove.forEach(x => this.buildableEntityRemove(x));
    }
    buildableEntityBuild(buildableEntityToBuild) {
        var buildableEntityInProgress = this.buildableEntityInProgress();
        if (buildableEntityInProgress != null) {
            if (buildableEntityInProgress != buildableEntityToBuild) {
                this.buildableEntityRemove(buildableEntityInProgress);
            }
        }
        var buildables = this.layout.map.bodies;
        buildables.push(buildableEntityToBuild);
    }
    buildableEntityInProgress() {
        return this.layout.map.bodies.find(x => Buildable.fromEntity(x).isComplete == false);
    }
    buildableEntityRemove(buildableEntityToRemove) {
        var bodies = this.layout.map.bodies;
        bodies.splice(bodies.indexOf(buildableEntityToRemove), 1);
    }
    industryPerTurn(universe, world, faction) {
        var resource = this.resourcesPerTurnByName(universe, world, faction).get("Industry");
        return (resource == null ? 0 : resource.quantity);
    }
    prosperityPerTurn(universe, world, faction) {
        var resource = this.resourcesPerTurnByName(universe, world, faction).get("Prosperity");
        return (resource == null ? 0 : resource.quantity);
    }
    researchPerTurn(universe, world, faction) {
        var resource = this.resourcesPerTurnByName(universe, world, faction).get("Research");
        return (resource == null ? 0 : resource.quantity);
    }
    resourcesPerTurn(universe, world, faction) {
        if (this._resourcesPerTurn == null) {
            var resourcesSoFar = new Array();
            var layout = this.layout;
            var facilities = layout.facilities();
            for (var f = 0; f < facilities.length; f++) {
                var facility = Buildable.fromEntity(facilities[f]);
                if (facility.isComplete) {
                    var facilityDefn = facility.defn(world);
                    var facilityResources = facilityDefn.resourcesPerTurn;
                    Resource.add(resourcesSoFar, facilityResources);
                }
            }
            this._resourcesPerTurn = resourcesSoFar;
        }
        return this._resourcesPerTurn;
    }
    resourcesPerTurnByName(universe, world, faction) {
        if (this._resourcesPerTurnByName == null) {
            var resourcesPerTurn = this.resourcesPerTurn(universe, world, faction);
            this._resourcesPerTurnByName = ArrayHelper.addLookups(resourcesPerTurn, (x) => x.defnName);
        }
        return this._resourcesPerTurnByName;
    }
}
