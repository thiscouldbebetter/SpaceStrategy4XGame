"use strict";
class ActivityDefn {
    constructor(name, perform) {
        this.name = name;
        this.perform = perform;
    }
    static Instances() {
        if (ActivityDefn._instances == null) {
            ActivityDefn._instances = new ActivityDefn_Instances();
        }
        return ActivityDefn._instances;
    }
}
class ActivityDefn_Instances {
    constructor() {
        this.DoNothing = new ActivityDefn("DoNothing", (universe, actor, activity) => {
            // do nothing
        });
        this.MoveToTarget = new ActivityDefn("MoveToTarget", (universe, actor, activity) => {
            var ship = actor;
            ship.moveTowardTarget(universe, activity.target, ship);
        });
        this._All =
            [
                this.DoNothing,
                this.MoveToTarget,
            ];
    }
}
