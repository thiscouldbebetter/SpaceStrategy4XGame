
class Projectile extends Entity
{
	defn: ProjectileDefn;
	shipFiredFrom: Ship;
	entityTarget: Entity;

	_displacement: Coords;

	constructor
	(
		name: string,
		defn: ProjectileDefn,
		pos: Coords,
		shipFiredFrom: Ship,
		entityTarget: Entity
	)
	{
		super
		(
			name,
			[
				Projectile.actorBuild(entityTarget),
				Projectile.bodyDefnBuild(defn),
				Projectile.collidableBuild(pos),
				//Drawable.fromVisual(projectileDefn.visual),
				Killable.fromIntegrityMax(1),
				Locatable.fromPos(pos)
			]
		);

		this.defn = defn;

		this.shipFiredFrom = shipFiredFrom;

		this._displacement = Coords.create();
	}

	static actorBuild(entityTarget: Entity): Actor
	{
		return new Actor
		(
			Activity.fromDefnNameAndTargetEntity
			(
				"MoveToTargetCollideAndEndMove",
				entityTarget
			)
		);
	}

	static bodyDefnBuild(projectileDefn: ProjectileDefn): BodyDefn
	{
		var scaleFactor = 1;
		var visual = projectileDefn.visual;

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

		var didCollide = false;

		var targetTypeName = target.constructor.name;
		if (targetTypeName == LinkPortal.name)
		{
			var portal = target as LinkPortal;
			console.log("todo - projectile - collision - portal: " + portal.name);
			didCollide = true;
		}
		else if (targetTypeName == Planet.name)
		{
			var planet = target as Planet;
			console.log("todo - projectile - collision - planet: " + planet.name);
			didCollide = true;
		}
		else if (targetTypeName == Ship.name)
		{
			var ship = target as Ship;
			if (ship != projectile.shipFiredFrom)
			{
				var shipTargeted = ship;

				projectile.killable().kill();

				// var shipTargetedShields = shipTargeted.deviceUser().devicesShields();
				var damageAbsorbedByShield = 0; // todo
				var projectileDefn = projectile.defn;
				var damageTakenByTarget =
					projectileDefn.damagePerHit - damageAbsorbedByShield;
				if (damageTakenByTarget < 0)
				{
					damageTakenByTarget = 0;
				}
				shipTargeted.killable().integritySubtract(projectileDefn.damagePerHit);
				didCollide = true;
			}
		}
		else
		{
			// Do nothing.  Presumably this is just a point in space.
		}

		if (didCollide)
		{
			var starsystem = uwpe.place as Starsystem;
			starsystem.entityToRemoveAdd(projectile);
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

	faction(): Faction
	{
		return this.shipFiredFrom.faction();
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


class ProjectileDefn
{
	name: string;
	range: number;
	damagePerHit: number;
	visual: VisualBase;

	constructor
	(
		name: string,
		range: number,
		damagePerHit: number,
		visual: VisualBase
	)
	{
		this.name = name;
		this.range = range;
		this.damagePerHit = damagePerHit;
		this.visual = visual;
	}

	static _instances: ProjectileDefn_Instances;
	static Instances(): ProjectileDefn_Instances
	{
		if (ProjectileDefn._instances == null)
		{
			ProjectileDefn._instances = new ProjectileDefn_Instances();
		}
		return ProjectileDefn._instances;
	}
}

class ProjectileDefn_Instances
{
	Default: ProjectileDefn;

	constructor()
	{
		var colors = Color.Instances();
		var dimension = 3;

		var visualEllipse = VisualEllipse.fromSemiaxesAndColorFill
		(
			dimension, dimension / 2, colors.Yellow
		);

		// Because it's a rotating ellipse, the second half of the animation
		// looks exactly the same as the first, so just do half a rotation.
		var halfRotation = 0.5;

		var frameCount = 8;
		var visualsForFrames = [];

		for (let i = 0; i < frameCount; i++) // Must be let, not var.
		{
			var visualFrame = new VisualRotate
			(
				visualEllipse,
				(uwpe: UniverseWorldPlaceEntities) => i * halfRotation / frameCount
			);
			visualsForFrames.push(visualFrame);
		}

		var visual = VisualAnimation.fromFramesRepeating(visualsForFrames);

		this.Default = new ProjectileDefn
		(
			"Default",
			100, // range
			1, // damage
			visual
		);
	}
}
