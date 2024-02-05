"use strict";
class WorldExtended extends World {
    constructor(name, dateCreated, activityDefns, buildableDefns, technologyGraph, camera, starCluster) {
        super(name, dateCreated, new WorldDefn([
            activityDefns
        ]), // worldDefn
        (placeName) => {
            return this.places.find(x => x.name == placeName);
        }, // placeGetByName
        (starCluster == null ? "dummy" : starCluster.name));
        this.buildableDefns = buildableDefns;
        this.technologyGraph = technologyGraph;
        this.starCluster = starCluster;
        this.camera = camera;
        this.dateSaved = this.dateCreated;
        this.buildableDefnsByName = ArrayHelper.addLookupsByName(this.buildableDefns);
        this.places = [];
        if (starCluster != null) {
            this.starClusterSet(starCluster);
        }
        this.shouldDrawOnlyWhenUpdated = true;
    }
    static blank(universe) {
        var activityDefns = ArrayHelper.flattenArrayOfArrays([
            new ActivityDefn_Instances2()._All,
            ActivityDefn.Instances()._All
        ]);
        var viewSize = universe.display.sizeInPixels.clone();
        var mapCellSizeInPixels = viewSize.clone().divideScalar(16).zSet(0); // hack
        var buildableDefns = 
        // new BuildableDefnsBasic(mapCellSizeInPixels)._All;
        BuildableDefnsLegacy.Instance(mapCellSizeInPixels);
        var technologyGraph = 
        // TechnologyGraph.demo(mapCellSizeInPixels);
        TechnologyGraph.legacy(mapCellSizeInPixels, buildableDefns);
        var viewDimension = viewSize.y;
        var focalLength = viewDimension;
        viewSize.z = focalLength;
        var camera = new Camera(viewSize, focalLength, Disposition.fromPos(new Coords(-viewDimension, 0, 0)), null // entitiesInViewSort
        );
        var returnValue = new WorldExtended(null, // name,
        DateTime.now(), activityDefns, buildableDefns._All, technologyGraph, camera, null // starCluster
        );
        return returnValue;
    }
    // instance methods
    activityDefnByName(activityDefnName) {
        return this.defn.activityDefnByName(activityDefnName);
    }
    buildableDefnAdd(buildableDefn) {
        this.buildableDefns.push(buildableDefn);
        this.buildableDefnsByName.set(buildableDefn.name, buildableDefn);
    }
    buildableDefnByName(buildableDefnName) {
        return this.buildableDefnsByName.get(buildableDefnName);
    }
    buildableDefnRemove(buildableDefn) {
        this.buildableDefns.splice(this.buildableDefns.indexOf(buildableDefn), 1);
        this.buildableDefnsByName.delete(buildableDefn.name);
    }
    factionCurrent() {
        return this.starCluster.factionCurrent();
    }
    factionPlayer() {
        return this.starCluster.factionPlayer();
    }
    factions() {
        return this.starCluster.factions;
    }
    initialize(uwpe) {
        this.starCluster.initialize(uwpe);
    }
    mapCellSizeInPixels(universe) {
        if (this._mapCellSizeInPixels == null) {
            var viewSize = universe.display.sizeInPixels;
            this._mapCellSizeInPixels = viewSize.clone().divideScalar(16).zSet(0);
        }
        return this._mapCellSizeInPixels;
    }
    notificationsExist() {
        var faction = this.factionCurrent();
        var notificationSession = faction.notificationSession;
        var areThereAnyNotifications = notificationSession.notificationsExist();
        return areThereAnyNotifications;
    }
    placeForEntityLocatable(entityLocatable) {
        return this.starCluster.placeForEntityLocatable(entityLocatable);
    }
    saveFileNameStem() {
        var returnValue = StringHelper.spacesToUnderscores(this.name + "-Round_" + this.starCluster.roundNumberCurrent());
        return returnValue;
    }
    starClusterSet(value) {
        this.starCluster = value;
        this.name = this.starCluster.name;
        this.places.push(this.starCluster);
        this.places.push(...this.starCluster.nodes.map(x => x.starsystem));
    }
    toVenue() {
        return new VenueStarCluster(this);
    }
    updateForRound(uwpe) {
        var universe = uwpe.universe;
        var factionCurrent = this.factionCurrent();
        var notificationsBlocking = factionCurrent.notificationsForRoundAddToArray(universe, []);
        if (notificationsBlocking.length > 0) {
            this.starCluster.roundAdvanceUntilNotificationDisable();
            factionCurrent.notificationsAdd(notificationsBlocking);
            factionCurrent.notificationSessionStart(universe, universe.display.sizeInPixels.clone().half());
        }
        else {
            this.updateForRound_IgnoringNotifications(uwpe);
        }
    }
    updateForRound_IgnoringNotifications(uwpe) {
        var universe = uwpe.universe;
        uwpe.world = this;
        var world = this;
        this.starCluster.updateForRound(universe, world);
    }
    updateForTimerTick(uwpe) {
        var isFastForwarding = this.starCluster.roundsAreAdvancingUntilNotification();
        if (isFastForwarding) {
            var world = this;
            var factionCurrent = world.factionCurrent();
            var areThereAnyNotifications = factionCurrent.notificationsExist();
            if (areThereAnyNotifications) {
                this.starCluster.roundAdvanceUntilNotificationToggle(uwpe);
                factionCurrent.notificationSessionStart(uwpe.universe, uwpe.universe.display.sizeInPixels.clone().half());
            }
            else {
                world.updateForRound(uwpe);
            }
        }
        this.timerTicksSoFar++;
    }
    // Saving.
    toSaveState(universe) {
        var returnValue = new SaveStateWorldExtended().fromWorld(this);
        return returnValue;
    }
}
class SaveStateWorldExtended extends SaveStateWorld {
    constructor() {
        super("-", // name
        "-", // placeName
        "-", // timePlayingAsString
        DateTime.now(), // timeSaved
        null // imageSnapshot
        );
    }
    fromWorld(world) {
        var worldExtended = world;
        this.world = null; // Important to keep file size down.
        this.starCluster = worldExtended.starCluster;
        return this;
    }
    toWorld(universe) {
        var world = WorldExtended.blank(universe);
        world.starClusterSet(this.starCluster);
        return world;
    }
    // Loadable.
    load() {
        // todo
    }
    unload() {
        this.world = null;
    }
}
