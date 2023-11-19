
class Projectile extends Entity
{
	defn: BodyDefn;
	shipFiredFrom: Ship;

	_visual: VisualBase;

	constructor
	(
		name: string,
		defn: BodyDefn,
		pos: Coords,
		shipFiredFrom: Ship
	)
	{
		super
		(
			name,
			[
				Actor.default(),
				Collidable.default(),
				defn,
				Killable.fromIntegrityMax(1),
				Locatable.fromPos(pos)
			]
		);

		this.defn = defn;
		this.shipFiredFrom = shipFiredFrom;
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
}
