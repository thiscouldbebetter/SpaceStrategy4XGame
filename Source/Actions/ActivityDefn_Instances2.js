"use strict";
class ActivityDefn_Instances2 {
    constructor() {
        this.MoveToTargetCollideAndEndMove = new ActivityDefn("MoveToTargetCollideAndEndMove", (uwpe) => {
            ActivityDefn_Instances2.moveToTargetCollideAndEndMove_Perform(uwpe);
        });
        this._All =
            [
                this.MoveToTargetCollideAndEndMove
            ];
    }
    static moveToTargetCollideAndEndMove_Perform(uwpe) {
        var ship = uwpe.entity;
        var activity = Actor.of(ship).activity;
        var target = activity.targetEntity();
        var distanceToTarget = ship.moveTowardTargetAndReturnDistance(target);
        if (distanceToTarget == 0) {
            var targetCollidable = Collidable.of(target);
            if (targetCollidable != null) {
                var shipCollidable = Collidable.of(ship);
                uwpe.entitySet(ship).entity2Set(target);
                shipCollidable.collideEntitiesForUniverseWorldPlaceEntities(uwpe);
            }
            activity.clear();
            var universe = uwpe.universe;
            var world = universe.world;
            var venueStarsystem = universe.venueCurrent();
            venueStarsystem.entityMoving = null;
            var starsystem = venueStarsystem.starsystem;
            starsystem.factionToMoveAdvance(world);
        }
    }
}
