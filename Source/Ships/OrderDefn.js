"use strict";
class OrderDefn {
    constructor(name, description, obey) {
        this.name = name;
        this.description = description;
        this._obey = obey;
    }
    static Instances() {
        if (OrderDefn._instances == null) {
            OrderDefn._instances = new OrderDefn_Instances();
        }
        return OrderDefn._instances;
    }
    obey(uwpe) {
        this._obey(uwpe);
    }
}
class OrderDefn_Instances {
    constructor() {
        this.DoNothing = new OrderDefn("DoNothing", "doing nothing", (uwpe) => { });
        this.Go = new OrderDefn("Go", "moving to", this.go);
        this.UseDevice = new OrderDefn("UseDevice", "using", this.useDevice);
        this._All =
            [
                this.DoNothing,
                this.Go,
                this.UseDevice
            ];
        this._AllByName = ArrayHelper.addLookupsByName(this._All);
    }
    go(uwpe) {
        var entityMoving = uwpe.entity;
        var orderable = Orderable.fromEntity(entityMoving);
        var order = orderable.order(entityMoving);
        var targetFinal = order.entityBeingTargeted;
        var targetFinalPos = targetFinal.locatable().loc.pos;
        var entityMovingPos = entityMoving.locatable().loc.pos;
        var displacementToTargetFinal = targetFinalPos.clone().subtract(entityMovingPos);
        var distanceToTargetFinal = displacementToTargetFinal.magnitude();
        var starsystemTraverser = StarsystemTraverser.ofEntity(entityMoving);
        var distanceMaxPerMove = starsystemTraverser.distanceMaxPerMove();
        var entityTargetImmediate;
        if (distanceToTargetFinal <= distanceMaxPerMove) {
            entityTargetImmediate = targetFinal;
        }
        else {
            var directionToTarget = displacementToTargetFinal.divideScalar(distanceToTargetFinal);
            var displacementToTargetImmediate = directionToTarget.multiplyScalar(distanceMaxPerMove);
            var targetImmediatePos = displacementToTargetImmediate.add(entityMovingPos);
            var targetAsLocatable = Locatable.fromPos(targetImmediatePos);
            entityTargetImmediate = Entity.fromProperty(targetAsLocatable);
        }
        var actor = entityMoving.actor();
        var activity = actor.activity;
        var activityDefnDoNothing = ActivityDefn.Instances().DoNothing;
        if (activity.defnName == activityDefnDoNothing.name) {
            activity.defnNameAndTargetEntitySet("MoveToTargetCollideAndEndMove", entityTargetImmediate);
            var universe = uwpe.universe;
            var venue = universe.venueCurrent();
            venue.entityMoving = entityMoving;
        }
    }
    useDevice(uwpe) {
        var entity = uwpe.entity;
        var orderable = Orderable.fromEntity(entity);
        var order = orderable.order(entity);
        var entityOrderable = uwpe.entity;
        var device = order.deviceToUse;
        if (device != null) {
            var universe = uwpe.universe;
            var venue = universe.venueCurrent();
            var starsystem = venue.starsystem;
            var projectile = device.projectile;
            if (projectile == null) {
                var projectileDefn = ProjectileDefn.Instances().Default;
                projectile = new Projectile(entityOrderable.name + "_projectile", projectileDefn, entityOrderable.locatable().loc.pos.clone(), entityOrderable, // shipFiredFrom
                order.entityBeingTargeted);
                projectile.actor().activity =
                    Activity.fromDefnNameAndTargetEntity("MoveToTargetCollideAndEndMove", order.entityBeingTargeted);
                starsystem.entityToSpawnAdd(projectile);
                device.projectile = projectile;
            }
            else {
                device.projectile = null;
                var projectilePos = projectile.locatable().loc.pos;
                var targetPos = order.entityBeingTargeted.locatable().loc.pos;
                if (projectilePos.equals(targetPos)) {
                    order.complete();
                }
            }
        }
    }
}
