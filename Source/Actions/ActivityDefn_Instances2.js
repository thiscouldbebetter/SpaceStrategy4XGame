"use strict";
class ActivityDefn_Instances2 {
    constructor() {
        this.MoveToTargetAndCollide = new ActivityDefn("MoveToTargetAndCollide", (uwpe) => {
            var ship = uwpe.entity;
            var activity = ship.actor().activity;
            var target = activity.targetEntity();
            var distanceToTarget = ship.moveTowardTargetAndReturnDistance(target);
            if (distanceToTarget == 0) {
                var doNothing = ActivityDefn.Instances().DoNothing;
                activity.clear().defnSet(doNothing);
                var targetCollidable = target.collidable();
                if (targetCollidable != null) {
                    var shipCollidable = ship.collidable();
                    uwpe.entitySet(ship).entity2Set(target);
                    shipCollidable.collideEntitiesForUniverseWorldPlaceEntities(uwpe);
                }
            }
        });
        this._All =
            [
                this.MoveToTargetAndCollide,
            ];
    }
}
