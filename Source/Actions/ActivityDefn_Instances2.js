"use strict";
class ActivityDefn_Instances2 {
    constructor() {
        this.MoveToTargetCollideAndEndMove = new ActivityDefn("MoveToTargetCollideAndEndMove", (uwpe) => {
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
                var universe = uwpe.universe;
                var world = universe.world;
                var venueStarsystem = universe.venueCurrent();
                venueStarsystem.entityMoving = null;
                var starsystem = venueStarsystem.starsystem;
                starsystem.factionToMoveAdvance(world);
            }
        });
        this._All =
            [
                this.MoveToTargetCollideAndEndMove,
            ];
    }
}
