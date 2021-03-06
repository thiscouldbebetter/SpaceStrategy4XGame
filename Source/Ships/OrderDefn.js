"use strict";
class OrderDefn {
    constructor(name, obey) {
        this.name = name;
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
        this.Go = new OrderDefn("Go", (u, w, p, e) => {
            var actor = e.actor();
            var orderable = Orderable.fromEntity(e);
            var order = orderable.order;
            if (actor.activity == null) {
                actor.activity = Activity.fromDefnNameAndTarget("MoveToTarget", order.targetEntity);
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
        });
        this.UseDevice = new OrderDefn("UseDevice", (universe, world, place, entity) => {
            var orderable = Orderable.fromEntity(entity);
            var order = orderable.order;
            var ship = entity;
            var device = ship.deviceSelected;
            if (device != null) {
                var projectile = device.projectile;
                var venue = universe.venueCurrent;
                var starsystem = venue.starsystem;
                if (projectile == null) {
                    // hack - Replace with dedicated Projectile class.
                    projectile = new Ship(ship.name + "_projectile", new Projectile(null).bodyDefnBuild(), ship.locatable().loc.pos.clone(), ship.factionName, null // devices
                    );
                    projectile.energyPerMove = 0;
                    projectile.distancePerMove = 1000;
                    projectile.actor().activity =
                        Activity.fromDefnNameAndTarget("MoveToTarget", order.targetEntity);
                    starsystem.shipAdd(projectile);
                    device.projectile = projectile;
                }
                else {
                    ArrayHelper.remove(starsystem.ships, projectile);
                    device.projectile = null;
                    var projectilePos = projectile.locatable().loc.pos;
                    var targetPos = order.targetEntity.locatable().loc.pos;
                    if (projectilePos.equals(targetPos)) {
                        order.isComplete = true;
                    }
                }
            }
        });
        this._All =
            [
                this.Go,
                this.UseDevice,
            ];
        this._AllByName = ArrayHelper.addLookupsByName(this._All);
    }
}
