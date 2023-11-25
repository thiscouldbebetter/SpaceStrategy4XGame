"use strict";
class NotificationType {
    constructor(name) {
        this.name = name;
    }
    static Instances() {
        if (NotificationType._instances == null) {
            NotificationType._instances = new NotificationType_Instances();
        }
        return NotificationType._instances;
    }
    static byName(name) {
        return NotificationType.Instances().byName(name);
    }
}
class NotificationType_Instances {
    constructor() {
        this.Default = new NotificationType("Default");
        this._All = [this.Default];
        this._AllByName = ArrayHelper.addLookupsByName(this._All);
    }
    byName(name) {
        return (this._AllByName.has(name) ? this._AllByName.get(name) : this.Default);
    }
}
