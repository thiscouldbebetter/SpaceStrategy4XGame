"use strict";
class WorldExtended extends World {
    constructor(name, dateCreated, activityDefns, buildableDefns, technologyGraph, starCluster, camera) {
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
        this.roundsSoFar = 0;
        this._isAdvancingThroughRoundsUntilNotification = false;
        this.places = [];
        this.places.push(this.starCluster);
        this.places.push(...this.starCluster.nodes.map(x => x.starsystem));
        this.shouldDrawOnlyWhenUpdated = true;
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
    isAdvancingThroughRoundsUntilNotification() {
        return this._isAdvancingThroughRoundsUntilNotification;
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
    roundAdvanceUntilNotificationDisable() {
        this._isAdvancingThroughRoundsUntilNotification = false;
    }
    roundAdvanceUntilNotificationToggle(uwpe) {
        this._isAdvancingThroughRoundsUntilNotification =
            (this._isAdvancingThroughRoundsUntilNotification == false);
    }
    roundNumberCurrent() {
        return this.roundsSoFar + 1;
    }
    toVenue() {
        return new VenueStarCluster(this);
    }
    updateForRound(uwpe) {
        var universe = uwpe.universe;
        var factionCurrent = this.factionCurrent();
        var notificationsBlocking = factionCurrent.notificationsForRoundAddToArray(universe, []);
        if (notificationsBlocking.length > 0) {
            this.roundAdvanceUntilNotificationDisable();
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
        this.roundsSoFar++;
    }
    updateForTimerTick(uwpe) {
        var isFastForwarding = this.isAdvancingThroughRoundsUntilNotification();
        if (isFastForwarding) {
            var world = this;
            var factionCurrent = world.factionCurrent();
            var areThereAnyNotifications = factionCurrent.notificationsExist();
            if (areThereAnyNotifications) {
                this.roundAdvanceUntilNotificationToggle(uwpe);
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
        return super.toSaveState(universe); // todo
    }
}
