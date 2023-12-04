"use strict";
class ActivityDefn_Instances2 {
    constructor() {
        this.MoveToTarget = new ActivityDefn("MoveToTarget", (uwpe) => {
            var ship = uwpe.entity;
            var activity = ship.actor().activity;
            var target = activity.targetEntity();
            var distanceToTarget = ship.moveTowardTargetAndReturnDistance(target);
            if (distanceToTarget == 0) {
                var doNothing = ActivityDefn.Instances().DoNothing;
                activity.clear().defnSet(doNothing);
                // activity.isDoneSet(true);
            }
        });
        this._All =
            [
                this.MoveToTarget,
            ];
    }
}
