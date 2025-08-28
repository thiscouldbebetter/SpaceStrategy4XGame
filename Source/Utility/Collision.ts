
class CollisionExtended
{
	pos: Coords;
	distanceToCollision: number;
	colliders: any[];
	collidersByName: Map<string,any>;

	constructor()
	{
		this.pos = Coords.create();
		this.distanceToCollision = null;
		this.colliders = [];
		this.collidersByName = new Map<string,any>();
	}

	// static methods

	static rayAndEntitiesCollidable
	(
		ray: Ray,
		entitiesCollidable: Entity[],
		listToAddTo: CollisionExtended[]
	): CollisionExtended[]
	{
		for (var i = 0; i < entitiesCollidable.length; i++)
		{
			var entity = entitiesCollidable[i];
			var collidable = Collidable.of(entity);

			if (collidable != null)
			{
				var collider = collidable.collider as Sphere;

				var collision = new CollisionExtended();
				var collisionOfRayWithCollider = collision.rayAndSphere
				(
					ray, collider
				);

				if (collisionOfRayWithCollider.distanceToCollision != null)
				{
					collisionOfRayWithCollider.colliders.push
					(
						entity // Should this be collider?
					);

					listToAddTo.push
					(
						collisionOfRayWithCollider
					);
				}
			}
		}

		return listToAddTo;
	}

	// instance methods

	rayAndPlane(ray: Ray, plane: Plane): CollisionExtended
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

			this.colliders.push(plane);
			this.collidersByName.set(Plane.name, plane);
		}

		return this;
	}

	rayAndSphere(ray: Ray, sphere: Sphere): CollisionExtended
	{
		var rayDirection = ray.direction;
		var displacementFromSphereCenterToCamera = ray.vertex.clone().subtract
		(
			sphere.center
		);
		var sphereRadius = sphere.radius();
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

			this.collidersByName.set(Sphere.name, sphere);
		}

		return this;
	}
}
