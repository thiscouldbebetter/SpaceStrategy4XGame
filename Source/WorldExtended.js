"use strict";
class WorldExtended extends World {
    constructor(name, dateCreated, activityDefns, buildableDefns, technologyGraph, starCluster, factions, ships, camera) {
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
        this.factions = factions;
        this.ships = ships;
        this.camera = camera;
        this.dateSaved = this.dateCreated;
        this.buildableDefnsByName = ArrayHelper.addLookupsByName(this.buildableDefns);
        this.factionsByName = ArrayHelper.addLookupsByName(this.factions);
        this.roundsSoFar = 0;
        this._isAdvancingThroughRoundsUntilNotification = false;
        this.factionIndexCurrent = 0;
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
    factionAdd(faction) {
        this.factions.push(faction);
        this.factionsByName.set(faction.name, faction);
    }
    factionByName(factionName) {
        return this.factionsByName.get(factionName);
    }
    factionCurrent() {
        return this.factions[this.factionIndexCurrent];
    }
    factionPlayer() {
        return this.factions[0];
    }
    factionsOtherThanCurrent() {
        return this.factionsOtherThan(this.factionCurrent());
    }
    factionsOtherThan(faction) {
        return this.factions.filter(x => x.name != faction.name);
    }
    initialize(uwpe) {
        this.factions.forEach(x => x.initialize(uwpe));
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
        this.factions.forEach(x => x.updateForRound(universe, world));
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
}
