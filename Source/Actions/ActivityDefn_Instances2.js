"use strict";
class ActivityDefn_Instances2 {
    constructor() {
        this.MoveToTarget = new ActivityDefn("MoveToTarget", (u, w, p, e) => {
            var ship = e;
            var activity = e.actor().activity;
            ship.moveTowardTarget(u, activity.target(), ship);
        });
        this._All =
            [
                this.MoveToTarget,
            ];
    }
}
