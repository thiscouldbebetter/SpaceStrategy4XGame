
class Projectile extends Entity
{
	bodyDefn: BodyDefn;
	shipFiredFrom: Ship;
	entityTarget: Entity;

	_displacement: Coords;

	constructor
	(
		name: string,
		bodyDefn: BodyDefn,
		pos: Coords,
		shipFiredFrom: Ship,
		entityTarget: Entity
	)
	{
		super
		(
			name,
			[
				new Actor
				(
					Activity.fromDefnNameAndTargetEntity
					(
						"MoveToTargetCollideAndEndMove",
						entityTarget
					)
				),
				bodyDefn,
				Projectile.collidableBuild(pos),
				Killable.fromIntegrityMax(1),
				Locatable.fromPos(pos)
			]
		);

		this.bodyDefn = bodyDefn;
		this.shipFiredFrom = shipFiredFrom;

		this._displacement = Coords.create();
	}

	static bodyDefnBuild(color: Color): BodyDefn
	{
		var scaleFactor = 10;

		var visual = Projectile.visualForColorAndScaleFactor(color, scaleFactor);

		var returnValue = new BodyDefn
		(
			Projectile.name,
			Coords.fromXY(1, 1).multiplyScalar(scaleFactor), // size
			visual
		);

		return returnValue;
	}

	static collidableBuild(pos: Coords): Collidable
	{
		var collider = Sphere.fromRadiusAndCenter
		(
			VisualStar.radiusActual(), pos
		);

		return Collidable.fromColliderAndCollideEntities
		(
			collider,
			Projectile.collideEntities
		);
	}

	static collideEntities(uwpe: UniverseWorldPlaceEntities, collision: Collision): void
	{
		var projectile = uwpe.entity as Projectile;
		var target = uwpe.entity2;

		var targetTypeName = target.constructor.name;
		if (targetTypeName == LinkPortal.name)
		{
			var portal = target as LinkPortal;
			console.log("todo - projectile - collision - portal: " + portal.name);
		}
		else if (targetTypeName == Planet.name)
		{
			var planet = target as Planet;
			console.log("todo - projectile - collision - planet: " + planet.name);
		}
		else if (targetTypeName == Ship.name)
		{
			var projectileCollidable = projectile.collidable();
			var collision = Collision.fromEntitiesColliding(projectile, target);
			projectileCollidable.collisionHandle(uwpe, collision);
		}
		else
		{
			throw new Error("Unexpected collision!");
		}
	}

	static visualForColorAndScaleFactor(color: Color, scaleFactor: number): VisualBase
	{
		var visual = VisualCircle.fromRadiusAndColorFill(scaleFactor, color);
		return visual;
	}

	// instance methods

	collideWithEntity(uwpe: UniverseWorldPlaceEntities, target: Entity): void
	{
		var collidable = this.collidable();
		var collision = Collision.fromEntitiesColliding(this, target);
		collidable.collisionHandle(uwpe, collision);
	}

	faction(world: WorldExtended): Faction
	{
		return this.shipFiredFrom.faction(world);
	}

	moveTowardTargetAndReturnDistance
	(
		target: Entity
	): number
	{
		var projectilePos = this.locatable().loc.pos;
		var targetPos = target.locatable().loc.pos;
		var displacementToTarget =
			this._displacement.overwriteWith(targetPos).subtract(projectilePos);
		var distanceToTarget = displacementToTarget.magnitude();
		var speed = 1;
		if (distanceToTarget > speed)
		{
			var directionToTarget = displacementToTarget.divideScalar(distanceToTarget);
			var displacementToMove = directionToTarget.multiplyScalar(speed);
			projectilePos.add(displacementToMove);
			distanceToTarget -= speed;
		}
		else
		{
			projectilePos.overwriteWith(targetPos);
			distanceToTarget = 0;
		}
		return distanceToTarget;
	}
}
