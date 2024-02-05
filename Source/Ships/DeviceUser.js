"use strict";
class DeviceUser {
    constructor(devices) {
        this._devices = devices;
    }
    static fromEntities(entities) {
        var devices = entities.map(x => Device.ofEntity(x)).filter(x => (x != null));
        var deviceUser = new DeviceUser(devices);
        return deviceUser;
    }
    static ofEntity(entity) {
        return entity.propertyByName(DeviceUser.name);
    }
    reset() {
        this.distanceMaxPerMoveReset();
        this.energyPerMoveReset();
        this.energyPerRoundReset();
        this.speedThroughLinkReset();
        this.sensorRangeReset();
        this.shieldingReset();
    }
    // Devices.
    deviceAdd(deviceToAdd) {
        this._devices.push(deviceToAdd);
    }
    deviceRemove(deviceToRemove) {
        this._devices.splice(this._devices.indexOf(deviceToRemove), 1);
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
    devices() {
        return this._devices;
    }
    devicesDrives() {
        if (this._devicesDrives == null) {
            var devices = this.devices();
            var categoryShipDrive = BuildableCategory.Instances().ShipDrive;
            this._devicesDrives = devices.filter((x) => x.defn().categories.indexOf(categoryShipDrive) >= 0);
        }
        return this._devicesDrives;
    }
    devicesGenerators() {
        if (this._devicesGenerators == null) {
            var devices = this.devices();
            var categoryShipGenerators = BuildableCategory.Instances().ShipGenerator;
            this._devicesGenerators = devices.filter((x) => x.defn().categories.indexOf(categoryShipGenerators) >= 0);
        }
        return this._devicesGenerators;
    }
    devicesSensors() {
        if (this._devicesSensors == null) {
            var devices = this.devices();
            var categoryShipSensor = BuildableCategory.Instances().ShipSensor;
            this._devicesSensors = devices.filter((x) => x.defn().categories.indexOf(categoryShipSensor) >= 0);
        }
        return this._devicesSensors;
    }
    devicesShields() {
        if (this._devicesShields == null) {
            var devices = this.devices();
            var categoryShipShield = BuildableCategory.Instances().ShipShield;
            this._devicesShields = devices.filter((x) => x.defn().categories.indexOf(categoryShipShield) >= 0);
        }
        return this._devicesShields;
    }
    devicesStarlaneDrives() {
        if (this._devicesStarlaneDrives == null) {
            var devices = this.devices();
            var categories = BuildableCategory.Instances();
            this._devicesStarlaneDrives = devices.filter((x) => x.defn().categories.indexOf(categories.ShipStarlaneDrive) >= 0);
        }
        return this._devicesStarlaneDrives;
    }
    devicesUsable() {
        if (this._devicesUsable == null) {
            var devices = this.devices();
            this._devicesUsable = devices.filter((x) => x.defn().isActive);
        }
        return this._devicesUsable;
    }
    distanceMaxPerMove(uwpe) {
        if (this._distanceMaxPerMove == null) {
            this._distanceMaxPerMove = 0;
            var devicesDrives = this.devicesDrives();
            var energyPerMoveBefore = this._energyPerMove;
            var energyPerRoundBefore = this._energyPerRound;
            devicesDrives.forEach(x => x.updateForRound(uwpe));
            this._energyPerMove = energyPerMoveBefore;
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
    energyPerMove() {
        if (this._energyPerMove == null) {
            var devicesDrives = this.devicesDrives();
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
    energyPerRound(uwpe) {
        if (this._energyPerRound == null) {
            this._energyPerRound = 0;
            var devicesGenerators = this.devicesGenerators();
            var distanceMaxPerMoveBefore = this._distanceMaxPerMove;
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
    energyRemainingOverMax(uwpe) {
        var energyRemaining = this.energyRemainingThisRound(uwpe);
        var energyPerRound = this.energyPerRound(uwpe);
        var energyRemainingOverMax = energyRemaining + "/" + energyPerRound;
        return energyRemainingOverMax;
    }
    energyRemainingThisRound(uwpe) {
        if (this._energyRemainingThisRound == null) {
            this.energyRemainingThisRoundReset(uwpe);
        }
        return this._energyRemainingThisRound;
    }
    energyRemainingThisRoundAdd(energyToAdd) {
        this._energyRemainingThisRound += energyToAdd;
    }
    energyRemainingThisRoundClear() {
        this._energyRemainingThisRound = 0;
    }
    energyRemainingThisRoundIsEnoughToMove(uwpe) {
        var energyRemainingThisRound = this.energyRemainingThisRound(uwpe);
        var energyPerMove = this.energyPerMove();
        var isEnough = (energyRemainingThisRound >= energyPerMove);
        return isEnough;
    }
    energyRemainingThisRoundReset(uwpe) {
        this._energyRemainingThisRound = this.energyPerRound(uwpe);
    }
    energyRemainingThisRoundSubtract(energyToSubtract) {
        this._energyRemainingThisRound -= energyToSubtract;
    }
    energyRemainsThisRoundAny() {
        return (this._energyRemainingThisRound > 0);
    }
    energyRemainsThisRound(energyToCheck) {
        return (this._energyRemainingThisRound >= energyToCheck);
    }
    sensorRange(ship) {
        if (this._sensorRange == null) {
            this._sensorRange = 0;
            var devicesSensors = this.devicesSensors();
            var uwpe = UniverseWorldPlaceEntities.create().entitySet(ship);
            devicesSensors.forEach(x => x.updateForRound(uwpe));
        }
        return this._sensorRange;
    }
    sensorRangeAdd(rangeToAdd) {
        this._sensorRange += rangeToAdd;
    }
    sensorRangeReset() {
        this._sensorRange = null;
    }
    shielding(ship) {
        if (this._shielding == null) {
            this._shielding = 0;
            var devicesShields = this.devicesShields();
            var uwpe = UniverseWorldPlaceEntities.create().entitySet(ship);
            devicesShields.forEach(x => x.updateForRound(uwpe));
        }
        return this._shielding;
    }
    shieldingAdd(shieldingToAdd) {
        this._shielding += shieldingToAdd;
    }
    shieldingReset() {
        this._shielding = null;
    }
    speedThroughLink(ship) {
        if (this._speedThroughLink == null) {
            this._speedThroughLink = 0;
            var starlaneDrivesAsDevices = this.devicesStarlaneDrives();
            var uwpe = UniverseWorldPlaceEntities.create().entitySet(ship);
            for (var i = 0; i < starlaneDrivesAsDevices.length; i++) {
                var starlaneDrive = starlaneDrivesAsDevices[i];
                starlaneDrive.updateForRound(uwpe);
            }
            var shipFaction = ship.factionable().faction();
            var shipFactionDefn = shipFaction.defn();
            this._speedThroughLink
                *= shipFactionDefn.starlaneTravelSpeedMultiplier;
        }
        return this._speedThroughLink;
    }
    speedThroughLinkAdd(speedToAdd) {
        this._speedThroughLink += speedToAdd;
    }
    speedThroughLinkReset() {
        this._speedThroughLink = null;
    }
    updateForRound(uwpe) {
        this.reset();
        var devices = this.devices();
        for (var i = 0; i < devices.length; i++) {
            var device = devices[i];
            uwpe.entity2Set(device.toEntity());
            device.updateForRound(uwpe);
        }
        this.energyRemainingThisRoundReset(uwpe);
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
    initialize(uwpe) {
        this.energyRemainingThisRound(uwpe); // Do the calculations, but ignore the result for now.
    }
    updateForTimerTick(uwpe) { }
    // Equatable.
    equals(other) {
        return false; // todo
    }
}
