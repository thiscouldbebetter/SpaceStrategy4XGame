"use strict";
class OrderDefn {
    constructor(name, description, obey) {
        this.name = name;
        this.description = description;
        this.obey = obey;
    }
    static Instances() {
        if (OrderDefn._instances == null) {
            OrderDefn._instances = new OrderDefn_Instances();
        }
        return OrderDefn._instances;
    }
}
class OrderDefn_Instances {
    constructor() {
        this.Go = new OrderDefn("Go", "moving to", this.go);
        this.UseDevice = new OrderDefn("UseDevice", "using", this.useDevice);
        this._All =
            [
                this.Go,
                this.UseDevice,
            ];
        this._AllByName = ArrayHelper.addLookupsByName(this._All);
    }
    go(u, w, p, e) {
        var actor = e.actor();
        var orderable = Orderable.fromEntity(e);
        var order = orderable.order;
        var activity = actor.activity;
        if (activity.defnName == ActivityDefn.Instances().DoNothing.name) {
            activity.defnNameAndTargetEntitySet("MoveToTarget", order.targetEntity);
        }
        else {
            var actorLoc = e.locatable().loc;
            var target = order.targetEntity;
            var targetLoc = target.locatable().loc;
            if (actorLoc.placeName == targetLoc.placeName
                && actorLoc.pos.equals(targetLoc.pos)) {
                order.isComplete = true;
            }
        }
    }
    useDevice(universe, world, place, entity) {
        var orderable = Orderable.fromEntity(entity);
        var order = orderable.order;
        var ship = entity;
        var device = ship.deviceSelected;
        if (device != null) {
            var venue = universe.venueCurrent;
            var starsystem = venue.starsystem;
            var projectile = device.projectile;
            if (projectile == null) {
                projectile = new Projectile(ship.name + "_projectile", Ship.bodyDefnBuild(null), // hack
                ship.locatable().loc.pos.clone(), ship // shipFiredFrom
                );
                projectile.actor().activity =
                    Activity.fromDefnNameAndTargetEntity("MoveToTarget", order.targetEntity);
                starsystem.entityToSpawnAdd(projectile);
                device.projectile = projectile;
            }
            else {
                device.projectile = null;
                var projectilePos = projectile.locatable().loc.pos;
                var targetPos = order.targetEntity.locatable().loc.pos;
                if (projectilePos.equals(targetPos)) {
                    order.isComplete = true;
                }
            }
        }
    }
}
