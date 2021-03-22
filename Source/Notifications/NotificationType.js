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
}
class NotificationType_Instances {
    constructor() {
        this.Default = new NotificationType("Default");
        this._All = [this.Default];
        this._AllByName = ArrayHelper.addLookupsByName(this._All);
    }
}
