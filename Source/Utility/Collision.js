"use strict";
class CollisionExtended {
    constructor() {
        this.pos = Coords.create();
        this.distanceToCollision = null;
        this.colliders = [];
        this.collidersByName = new Map();
    }
    // static methods
    static rayAndBodies(ray, bodies, bodyRadius, listToAddTo) {
        var bodyAsSphere = new Sphere(Coords.create(), bodyRadius);
        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
            bodyAsSphere.center = body.locatable().loc.pos;
            var collisionOfRayWithBody = new CollisionExtended().rayAndSphere(ray, bodyAsSphere);
            if (collisionOfRayWithBody.distanceToCollision != null) {
                collisionOfRayWithBody.colliders.push(body);
                listToAddTo.push(collisionOfRayWithBody);
            }
        }
        return listToAddTo;
    }
    // instance methods
    rayAndFace(ray, face) {
        this.rayAndPlane(ray, face.plane());
        if (this.collidersByName.get(Plane.name) != null) {
            if (this.isPosWithinFace(face) == false) {
                this.collidersByName.set(Face.name, null);
            }
            else {
                this.collidersByName.set(Face.name, face);
                /*
                var displacementFromVertex0ToCollision = Coords.create();

                for (var t = 0; t < face.triangles.length; t++)
                {
                    var triangle = face.triangles[t];
                    if (this.isPosWithinFace(triangle))
                    {
                        this.collidersByName.set("Triangle", triangle);
                        break;
                    }
                }
                */
            }
        }
        return this;
    }
    rayAndPlane(ray, plane) {
        this.distanceToCollision =
            (plane.distanceFromOrigin
                - plane.normal.dotProduct(ray.vertex))
                / plane.normal.dotProduct(ray.direction);
        if (this.distanceToCollision >= 0) {
            this.pos.overwriteWith(ray.direction).multiplyScalar(this.distanceToCollision).add(ray.vertex);
            this.colliders.push(plane);
            this.collidersByName.set(Plane.name, plane);
        }
        return this;
    }
    rayAndSphere(ray, sphere) {
        var rayDirection = ray.direction;
        var displacementFromSphereCenterToCamera = ray.vertex.clone().subtract(sphere.center);
        var sphereRadius = sphere.radius;
        var sphereRadiusSquared = sphereRadius * sphereRadius;
        var a = rayDirection.dotProduct(rayDirection);
        var b = 2 * rayDirection.dotProduct(displacementFromSphereCenterToCamera);
        var c = displacementFromSphereCenterToCamera.dotProduct(displacementFromSphereCenterToCamera) - sphereRadiusSquared;
        var discriminant = (b * b) - 4 * a * c;
        if (discriminant >= 0) {
            var rootOfDiscriminant = Math.sqrt(discriminant);
            var distanceToCollision1 = (rootOfDiscriminant - b)
                / (2 * a);
            var distanceToCollision2 = (0 - rootOfDiscriminant - b)
                / (2 * a);
            if (distanceToCollision1 >= 0) {
                if (distanceToCollision2 >= 0
                    && distanceToCollision2 < distanceToCollision1) {
                    this.distanceToCollision = distanceToCollision2;
                }
                else {
                    this.distanceToCollision = distanceToCollision1;
                }
            }
            else {
                this.distanceToCollision = distanceToCollision2;
            }
            this.pos.overwriteWith(ray.direction).multiplyScalar(this.distanceToCollision).add(ray.vertex);
            this.collidersByName.set(Sphere.name, sphere);
        }
        return this;
    }
    isPosWithinFace(face) {
        var displacementFromVertex0ToCollision = Coords.create();
        var isPosWithinAllEdgesOfFaceSoFar = true;
        var edges = face.edges(); // todo - Formerly .edgesRectified;
        for (var e = 0; e < edges.length; e++) {
            var edgeFromFace = edges[e];
            displacementFromVertex0ToCollision.overwriteWith(this.pos).subtract(edgeFromFace.vertices[0]);
            // hack?
            var epsilon = .01;
            var dotProduct = displacementFromVertex0ToCollision.dotProduct(edgeFromFace.transverse(null));
            if (dotProduct >= epsilon) {
                isPosWithinAllEdgesOfFaceSoFar = false;
                break;
            }
        }
        return isPosWithinAllEdgesOfFaceSoFar;
    }
}
