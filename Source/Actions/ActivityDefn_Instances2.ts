
class ActivityDefn_Instances2
{
	DoNothing: ActivityDefn;
	MoveToTargetCollideAndEndMove: ActivityDefn;

	_All: ActivityDefn[];

	constructor()
	{
		this.MoveToTargetCollideAndEndMove = new ActivityDefn
		(
			"MoveToTargetCollideAndEndMove",
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				ActivityDefn_Instances2.moveToTargetCollideAndEndMove_Perform(uwpe)
			}
		);

		this._All =
		[
			this.MoveToTargetCollideAndEndMove
		];
	}

	static moveToTargetCollideAndEndMove_Perform
	(
		uwpe: UniverseWorldPlaceEntities
	): void
	{
		var ship = uwpe.entity as Ship;
		var activity = ship.actor().activity;
		var target = activity.targetEntity();
		var distanceToTarget =
			ship.moveTowardTargetAndReturnDistance(target);
		if (distanceToTarget == 0)
		{
			var targetCollidable = target.collidable();
			if (targetCollidable != null)
			{
				var shipCollidable = ship.collidable();
				uwpe.entitySet(ship).entity2Set(target);
				shipCollidable.collideEntitiesForUniverseWorldPlaceEntities(uwpe);
			}

			activity.clear();

			var universe = uwpe.universe;
			var world = universe.world as WorldExtended;
			var venueStarsystem = universe.venueCurrent() as VenueStarsystem;
			venueStarsystem.entityMoving = null;
			var starsystem = venueStarsystem.starsystem;
			starsystem.factionToMoveAdvance(world);
		}
	}
}
