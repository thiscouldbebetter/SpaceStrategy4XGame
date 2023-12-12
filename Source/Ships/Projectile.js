"use strict";
class Projectile extends Entity {
    constructor(name, projectileDefn, pos, shipFiredFrom, entityTarget) {
        super(name, [
            new Actor(Activity.fromDefnNameAndTargetEntity("MoveToTargetCollideAndEndMove", entityTarget)),
            Projectile.bodyDefnBuild(projectileDefn),
            //Drawable.fromVisual(projectileDefn.visual),
            Locatable.fromPos(pos),
            Projectile.collidableBuild(pos),
            Killable.fromIntegrityMax(1),
            Locatable.fromPos(pos)
        ]);
        this.shipFiredFrom = shipFiredFrom;
        this._displacement = Coords.create();
    }
    static bodyDefnBuild(projectileDefn) {
        var scaleFactor = 1;
        var visual = projectileDefn.visual;
        var returnValue = new BodyDefn(Projectile.name, Coords.fromXY(1, 1).multiplyScalar(scaleFactor), // size
        visual);
        return returnValue;
    }
    static collidableBuild(pos) {
        var collider = Sphere.fromRadiusAndCenter(VisualStar.radiusActual(), pos);
        return Collidable.fromColliderAndCollideEntities(collider, Projectile.collideEntities);
    }
    static collideEntities(uwpe, collision) {
        var projectile = uwpe.entity;
        var target = uwpe.entity2;
        var didCollide = false;
        var targetTypeName = target.constructor.name;
        if (targetTypeName == LinkPortal.name) {
            var portal = target;
            console.log("todo - projectile - collision - portal: " + portal.name);
            didCollide = true;
        }
        else if (targetTypeName == Planet.name) {
            var planet = target;
            console.log("todo - projectile - collision - planet: " + planet.name);
            didCollide = true;
        }
        else if (targetTypeName == Ship.name) {
            var ship = target;
            if (ship != projectile.shipFiredFrom) {
                console.log("todo - projectile - collision - ship: " + ship.name);
                didCollide = true;
            }
        }
        else {
            // Do nothing.  Presumably this is just a point in space.
        }
        if (didCollide) {
            var starsystem = uwpe.place;
            starsystem.entityToRemoveAdd(projectile);
        }
    }
    static visualForColorAndScaleFactor(color, scaleFactor) {
        var visual = VisualCircle.fromRadiusAndColorFill(scaleFactor, color);
        return visual;
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
    moveTowardTargetAndReturnDistance(target) {
        var projectilePos = this.locatable().loc.pos;
        var targetPos = target.locatable().loc.pos;
        var displacementToTarget = this._displacement.overwriteWith(targetPos).subtract(projectilePos);
        var distanceToTarget = displacementToTarget.magnitude();
        var speed = 1;
        if (distanceToTarget > speed) {
            var directionToTarget = displacementToTarget.divideScalar(distanceToTarget);
            var displacementToMove = directionToTarget.multiplyScalar(speed);
            projectilePos.add(displacementToMove);
            distanceToTarget -= speed;
        }
        else {
            projectilePos.overwriteWith(targetPos);
            distanceToTarget = 0;
        }
        return distanceToTarget;
    }
}
class ProjectileDefn {
    constructor(name, range, damage, visual) {
        this.name = name;
        this.range = range;
        this.damage = damage;
        this.visual = visual;
    }
    static Instances() {
        if (ProjectileDefn._instances == null) {
            ProjectileDefn._instances = new ProjectileDefn_Instances();
        }
        return ProjectileDefn._instances;
    }
}
class ProjectileDefn_Instances {
    constructor() {
        var colors = Color.Instances();
        var dimension = 3;
        var visualEllipse = VisualEllipse.fromSemiaxesAndColorFill(dimension, dimension / 2, colors.Yellow);
        var frameCount = 16;
        var visualsForFrames = [];
        for (let i = 0; i < frameCount; i++) // Must be let, not var.
         {
            var visualFrame = new VisualRotate(visualEllipse, (uwpe) => i / frameCount);
            visualsForFrames.push(visualFrame);
        }
        var visual = VisualAnimation.fromFramesRepeating(visualsForFrames);
        this.Default = new ProjectileDefn("Default", 100, // range
        1, // damage
        visual);
    }
}
