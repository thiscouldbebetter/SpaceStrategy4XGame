"use strict";
class ActivityDefn_Instances2 {
    constructor() {
        this.MoveToTarget = new ActivityDefn("MoveToTarget", (uwpe) => {
            var ship = uwpe.entity;
            var activity = ship.actor().activity;
            ship.moveTowardTarget(uwpe.universe, activity.targetEntity(), ship);
        });
        this._All =
            [
                this.MoveToTarget,
            ];
    }
}
