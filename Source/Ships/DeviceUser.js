"use strict";
class DeviceUser {
    constructor() {
        this._distanceMaxPerMove = null;
        this._energyPerRound = null;
        this._energyRemainingThisRound = null;
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
    devicesGenerators(ship) {
        if (this._devicesGenerators == null) {
            var devices = this.devices(ship);
            var categoryShipGenerators = BuildableCategory.Instances().ShipGenerator;
            this._devicesGenerators = devices.filter((x) => x.defn().categories.indexOf(categoryShipGenerators) >= 0);
        }
        return this._devicesGenerators;
    }
    devicesSensors(ship) {
        if (this._devicesSensors == null) {
            var devices = this.devices(ship);
            var categoryShipSensor = BuildableCategory.Instances().ShipSensor;
            this._devicesSensors = devices.filter((x) => x.defn().categories.indexOf(categoryShipSensor) >= 0);
        }
        return this._devicesSensors;
    }
    devicesShields(ship) {
        if (this._devicesShields == null) {
            var devices = this.devices(ship);
            var categoryShipShield = BuildableCategory.Instances().ShipShield;
            this._devicesShields = devices.filter((x) => x.defn().categories.indexOf(categoryShipShield) >= 0);
        }
        return this._devicesShields;
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
    distanceMaxPerMove(ship) {
        if (this._distanceMaxPerMove == null) {
            this._distanceMaxPerMove = 0;
            var devicesDrives = this.devicesDrives(ship);
            var energyPerRoundBefore = this._energyPerRound;
            var uwpe = UniverseWorldPlaceEntities.create().entitySet(ship);
            devicesDrives.forEach(x => x.updateForRound(uwpe));
            this._energyPerRound = energyPerRoundBefore;
        }
        return this._distanceMaxPerMove;
    }
    distanceMaxPerMoveAdd(distanceToAdd) {
        this._distanceMaxPerMove += distanceToAdd;
    }
    distanceMaxPerMoveReset() {
        this._distanceMaxPerMove = null;
    }
    energyPerMove(ship) {
        if (this._energyPerMove == null) {
            var devicesDrives = this.devicesDrives(ship);
            var energyPerMoveSoFar = 0;
            var distanceMaxPerMoveBefore = this._distanceMaxPerMove;
            devicesDrives.forEach(x => energyPerMoveSoFar += x.defn().energyPerUse);
            this._distanceMaxPerMove = distanceMaxPerMoveBefore;
            this._energyPerMove = energyPerMoveSoFar;
        }
        return this._energyPerMove;
    }
    energyPerMoveAdd(energyToAdd) {
        this._energyPerMove += energyToAdd;
    }
    energyPerMoveReset() {
        this._energyPerMove = null;
    }
    energyPerRound(ship) {
        if (this._energyPerRound == null) {
            var devicesGenerators = this.devicesGenerators(ship);
            var distanceMaxPerMoveBefore = this._distanceMaxPerMove;
            var uwpe = UniverseWorldPlaceEntities.create().entitySet(ship);
            devicesGenerators.forEach(x => x.updateForRound(uwpe));
            this._distanceMaxPerMove = distanceMaxPerMoveBefore;
        }
        return this._energyPerRound;
    }
    energyPerRoundAdd(energyToAdd) {
        this._energyPerRound += energyToAdd;
    }
    energyPerRoundReset() {
        this._energyPerRound = null;
    }
    energyRemainingOverMax(ship) {
        var energyRemaining = this.energyRemainingThisRound(ship);
        var energyPerRound = this.energyPerRound(ship);
        var energyRemainingOverMax = energyRemaining + "/" + energyPerRound;
        return energyRemainingOverMax;
    }
    energyRemainingThisRound(ship) {
        if (this._energyRemainingThisRound == null) {
            this.energyRemainingThisRoundReset(ship);
        }
        return this._energyRemainingThisRound;
    }
    energyRemainingThisRoundAdd(energyToAdd) {
        this._energyRemainingThisRound += energyToAdd;
    }
    energyRemainingThisRoundClear() {
        this._energyRemainingThisRound = 0;
    }
    energyRemainingThisRoundReset(ship) {
        this._energyRemainingThisRound = this.energyPerRound(ship);
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
