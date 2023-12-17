"use strict";
class WorldExtended extends World {
    constructor(name, dateCreated, activityDefns, buildableDefns, deviceDefns, technologyGraph, network, factions, ships, camera) {
        super(name, dateCreated, new WorldDefn([
            activityDefns
        ]), // worldDefn
        (placeName) => {
            return this.places.find(x => x.name == placeName);
        }, // placeGetByName
        (network == null ? "dummy" : network.name));
        this.buildableDefns = buildableDefns;
        this.deviceDefns = deviceDefns;
        this.technologyGraph = technologyGraph;
        this.network = network;
        this.factions = factions;
        this.ships = ships;
        this.camera = camera;
        this.dateSaved = this.dateCreated;
        this.buildableDefnsByName = ArrayHelper.addLookupsByName(this.buildableDefns);
        this.deviceDefnsByName = ArrayHelper.addLookupsByName(this.deviceDefns);
        this.factionsByName = ArrayHelper.addLookupsByName(this.factions);
        //this.shipsByName = ArrayHelper.addLookupsByName(this.ships);
        this.defn.itemDefnsInitialize([]);
        // this.defn.itemDefns.push(...deviceDefns);
        var buildableDefnsNonDevice = this.buildableDefns.filter(x => this.deviceDefnsByName.has(x.name) == false);
        var itemDefns = buildableDefnsNonDevice.map(x => ItemDefn.fromName(x.name));
        this.defn.itemDefns.push(...itemDefns);
        this.defn.itemDefnsByName = ArrayHelper.addLookupsByName(this.defn.itemDefns);
        this.roundsSoFar = 0;
        this._isAdvancingThroughRoundsUntilNotification = false;
        this.factionIndexCurrent = 0;
        this.places = [];
        this.places.push(this.network);
        this.places.push(...this.network.nodes.map(x => x.starsystem));
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
    deviceDefnByName(deviceDefnName) {
        return this.deviceDefnsByName.get(deviceDefnName);
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
    factionsOtherThanCurrent() {
        return this.factionsOtherThan(this.factionCurrent());
    }
    factionsOtherThan(faction) {
        return this.factions.filter(x => x.name != faction.name);
    }
    initialize(uwpe) {
        // Do nothing.
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
        return this.network.placeForEntityLocatable(entityLocatable);
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
        return new VenueWorldExtended(this);
    }
    updateForRound(uwpe) {
        var universe = uwpe.universe;
        var factionCurrent = this.factionCurrent();
        var notificationsBlocking = factionCurrent.notificationsForRoundAddToArray(universe, []);
        if (notificationsBlocking.length > 0) {
            this.roundAdvanceUntilNotificationDisable();
            factionCurrent.notificationsAdd(notificationsBlocking);
            factionCurrent.notificationSessionStart(universe);
        }
        else {
            uwpe.world = this;
            var world = universe.world;
            this.network.updateForRound(universe, world);
            this.factions.forEach(x => x.updateForRound(universe, world));
            this.roundsSoFar++;
        }
    }
    updateForRound_IgnoringNotifications(uwpe) {
        // This seems to be for automated tests.
        this.updateForRound(uwpe);
        // todo - Ignore notifications.
    }
    updateForTimerTick(uwpe) {
        var isFastForwarding = this.isAdvancingThroughRoundsUntilNotification();
        if (isFastForwarding) {
            var world = this;
            var factionCurrent = world.factionCurrent();
            var areThereAnyNotifications = factionCurrent.notificationsExist();
            if (areThereAnyNotifications) {
                this.roundAdvanceUntilNotificationToggle(uwpe);
                factionCurrent.notificationSessionStart(uwpe.universe);
            }
            else {
                world.updateForRound(uwpe);
            }
        }
        this.timerTicksSoFar++;
    }
}
