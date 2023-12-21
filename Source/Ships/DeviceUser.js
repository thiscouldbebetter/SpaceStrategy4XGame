"use strict";
class DeviceUser {
    constructor() {
        this._energyRemainingThisRound = 0;
        this._energyPerRound = 0;
    }
    static ofEntity(entity) {
        return entity.propertyByName(DeviceUser.name);
    }
    deviceSelect(deviceToSelect) {
        this._deviceSelected = deviceToSelect;
    }
    deviceSelected() {
        return this._deviceSelected;
    }
    deviceSelectedCanBeUsedThisRound() {
        var deviceSelected = this.deviceSelected();
        var canBeUsed = deviceSelected == null
            ? false
            : deviceSelected.canBeUsedThisRoundByDeviceUser(this);
        return canBeUsed;
    }
    devices(ship) {
        var deviceEntities = ship.componentEntities.filter((x) => Device.ofEntity(x) != null);
        var devices = deviceEntities.map(x => Device.ofEntity(x));
        return devices;
    }
    devicesDrives(ship) {
        if (this._devicesDrives == null) {
            var devices = this.devices(ship);
            var categoryShipDrive = BuildableCategory.Instances().ShipDrive;
            this._devicesDrives = devices.filter((x) => x.defn().categories.indexOf(categoryShipDrive) >= 0);
        }
        return this._devicesDrives;
    }
    devicesStarlaneDrives(ship) {
        if (this._devicesStarlaneDrives == null) {
            var devices = this.devices(ship);
            var categories = BuildableCategory.Instances();
            this._devicesStarlaneDrives = devices.filter((x) => x.defn().categories.indexOf(categories.ShipStarlaneDrive) >= 0);
        }
        return this._devicesStarlaneDrives;
    }
    devicesUsable(ship) {
        if (this._devicesUsable == null) {
            var devices = this.devices(ship);
            this._devicesUsable = devices.filter((x) => x.defn().isActive);
        }
        return this._devicesUsable;
    }
    energyPerMove(ship) {
        if (this._energyPerMove == null) {
            var devicesDrives = this.devicesDrives(ship);
            var energyPerMoveSoFar = 0;
            devicesDrives.forEach(x => energyPerMoveSoFar += x.defn().energyPerUse);
            this._energyPerMove = energyPerMoveSoFar;
        }
        return this._energyPerMove;
    }
    energyPerMoveClear() {
        this._energyPerMove = 0;
    }
    energyPerRound() {
        return this._energyPerRound;
    }
    energyPerRoundAdd(energyToAdd) {
        this._energyPerRound += energyToAdd;
    }
    energyPerRoundClear() {
        this._energyPerRound = 0;
    }
    energyRemainingThisRound() {
        return this._energyRemainingThisRound;
    }
    energyRemainingThisRoundAdd(energyToAdd) {
        this._energyRemainingThisRound += energyToAdd;
    }
    energyRemainingThisRoundClear() {
        this._energyRemainingThisRound = 0;
    }
    energyRemainingThisRoundReset() {
        this._energyRemainingThisRound = this.energyPerRound();
    }
    energyRemainingThisRoundSubtract(energyToSubtract) {
        this._energyRemainingThisRound -= energyToSubtract;
    }
    energyRemainsThisRound(energyToCheck) {
        return (this._energyRemainingThisRound >= energyToCheck);
    }
    // Clonable.
    clone() {
        throw new Error("Not yet implemented.");
    }
    overwriteWith(other) {
        throw new Error("Not yet implemented.");
    }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
    // Equatable.
    equals(other) {
        return false; // todo
    }
}
