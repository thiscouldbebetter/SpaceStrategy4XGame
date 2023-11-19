"use strict";
class Projectile extends Entity {
    constructor(name, defn, pos, shipFiredFrom) {
        super(name, [
            Actor.default(),
            Collidable.default(),
            defn,
            Killable.fromIntegrityMax(1),
            Locatable.fromPos(pos)
        ]);
        this.defn = defn;
        this.shipFiredFrom = shipFiredFrom;
    }
    // instance methods
    collideWithEntity(uwpe, target) {
        var collidable = this.collidable();
        var collision = Collision.fromEntitiesColliding(this, target);
        collidable.collisionHandle(uwpe, collision);
    }
    faction(world) {
        return this.shipFiredFrom.faction(world);
    }
}
