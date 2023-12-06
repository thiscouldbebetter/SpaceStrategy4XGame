"use strict";
class DeviceUser {
    constructor() {
        // todo
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
    devices(ship) {
        var deviceEntities = ship.componentEntities.filter((x) => Device.ofEntity(x) != null);
        var devices = deviceEntities.map(x => Device.ofEntity(x));
        return devices;
    }
    devicesDrives(ship) {
        if (this._devicesDrives == null) {
            var devices = this.devices(ship);
            this._devicesDrives = devices.filter((x) => x.defn().categoryNames.indexOf("Drive") >= 0);
        }
        return this._devicesDrives;
    }
    devicesUsable(ship) {
        if (this._devicesUsable == null) {
            var devices = this.devices(ship);
            this._devicesUsable = devices.filter((x) => x.defn().isActive);
        }
        return this._devicesUsable;
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
