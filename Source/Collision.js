
function Collision()
{
	this.pos = new Coords(0, 0, 0);
	this.distanceToCollision = null;
	this.colliders = [];
}

{
	// static methods

	Collision.rayAndBodies = function(ray, bodies, bodyRadius, listToAddTo)
	{
		var bodyAsSphere = new Sphere(new Coords(), bodyRadius);

		for (var i = 0; i < bodies.length; i++)
		{
			var body = bodies[i];
			bodyAsSphere.center = body.loc.pos;

			var collisionOfRayWithBody = new Collision().rayAndSphere
			(
				ray, bodyAsSphere
			);

			if (collisionOfRayWithBody.distanceToCollision != null)
			{
				collisionOfRayWithBody.colliders.push
				(
					body
				);

				listToAddTo.push
				(
					collisionOfRayWithBody
				);
			}
		}

		return listToAddTo;
	}

	// instance methods

	Collision.prototype.rayAndFace = function(ray, face)
	{
		this.rayAndPlane
		(
			ray,
			face.plane
		);

		if (this.colliders["Plane"] != null)
		{
			if (this.isPosWithinFace(face) == false)
			{
				this.colliders["Face"] = null;
			}
			else
			{
				this.colliders["Face"] = face;

				var displacementFromVertex0ToCollision = new Coords(0, 0, 0);

				for (var t = 0; t < face.triangles.length; t++)
				{
					var triangle = face.triangles[t];
					if (this.isPosWithinFace(triangle) == true)
					{
						this.colliders["Triangle"] = triangle;
						break;
					}
				}
			}
		}

		return this;
	}

	Collision.prototype.rayAndPlane = function(ray, plane)
	{
		this.distanceToCollision = 
			(
				plane.distanceFromOrigin 
				- plane.normal.dotProduct(ray.vertex)
			)
			/ plane.normal.dotProduct(ray.direction);

		if (this.distanceToCollision >= 0)
		{
			this.pos.overwriteWith
			(
				ray.direction
			).multiplyScalar
			(
				this.distanceToCollision
			).add
			(
				ray.vertex
			);

			this.colliders["Plane"] = plane;
		}

		return this;
	}

	Collision.prototype.rayAndSphere = function(ray, sphere)
	{
		var rayDirection = ray.direction;
		var displacementFromSphereCenterToCamera = ray.vertex.clone().subtract
		(
			sphere.center
		);
		var sphereRadius = sphere.radius;
		var sphereRadiusSquared = sphereRadius * sphereRadius;

		var a = rayDirection.dotProduct(rayDirection);

		var b = 2 * rayDirection.dotProduct
		(
			displacementFromSphereCenterToCamera
		);

		var c = displacementFromSphereCenterToCamera.dotProduct
		(
			displacementFromSphereCenterToCamera
		) - sphereRadiusSquared;

		var discriminant = (b * b) - 4 * a * c;

		if (discriminant >= 0)
		{
			var rootOfDiscriminant = Math.sqrt(discriminant);

			var distanceToCollision1 = 
				(rootOfDiscriminant - b) 
				/ (2 * a);

			var distanceToCollision2 = 
				(0 - rootOfDiscriminant - b) 
				/ (2 * a);

			if (distanceToCollision1 >= 0)
			{
				if 
				(
					distanceToCollision2 >= 0 
					&& distanceToCollision2 < distanceToCollision1
				)
				{
					this.distanceToCollision = distanceToCollision2;
				}
				else
				{
					this.distanceToCollision = distanceToCollision1;
				}
			}
			else
			{
				this.distanceToCollision = distanceToCollision2;
			}

			this.pos.overwriteWith
			(
				ray.direction
			).multiplyScalar
			(
				this.distanceToCollision
			).add
			(
				ray.vertex
			);

			this.colliders["Sphere"] = sphere;
		}

		return this;
	}

	Collision.prototype.isPosWithinFace = function(face)
	{
		var displacementFromVertex0ToCollision = new Coords(0, 0);

		var isPosWithinAllEdgesOfFaceSoFar = true;

		var edges = face.edgesRectified;

		for (var e = 0; e < edges.length; e++)
		{
			var edgeFromFace = edges[e];

			displacementFromVertex0ToCollision.overwriteWith
			(
				this.pos
			).subtract
			(
				edgeFromFace.vertices[0].pos
			);

			// hack?
			var epsilon = .01;

			var dotProduct = displacementFromVertex0ToCollision.dotProduct
			(
				edgeFromFace.transverse
			);
			if (dotProduct >= epsilon)
			{
				isPosWithinAllEdgesOfFaceSoFar = false;
				break;
			}
		}

		return isPosWithinAllEdgesOfFaceSoFar;
	}

}
