
class OrderDefn
{
	name: string;
	obey: (u: Universe, w: World, p: Place, e: Entity)=>void;

	constructor
	(
		name: string,
		obey: (u: Universe, w: World, p: Place, e: Entity)=>void
	)
	{
		this.name = name;
		this.obey = obey;
	}

	static _instances: OrderDefn_Instances;
	static Instances()
	{
		if (OrderDefn._instances == null)
		{
			OrderDefn._instances = new OrderDefn_Instances();
		}
		return OrderDefn._instances;
	}
}

class OrderDefn_Instances
{
	Go: OrderDefn;
	UseDevice: OrderDefn;

	_All: OrderDefn[];
	_AllByName: Map<string,OrderDefn>;

	constructor()
	{
		this.Go = new OrderDefn
		(
			"Go", this.go
		);

		this.UseDevice = new OrderDefn
		(
			"UseDevice", this.useDevice
		);

		this._All =
		[
			this.Go,
			this.UseDevice,
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}

	go(u: Universe, w: World, p: Place, e: Entity): void
	{
		var actor = e.actor();
		var orderable = Orderable.fromEntity(e);
		var order = orderable.order;

		if (actor.activity == null)
		{
			actor.activity = Activity.fromDefnNameAndTargetEntity
			(
				"MoveToTarget", order.targetEntity
			);
		}
		else
		{
			var actorLoc = e.locatable().loc;
			var target = order.targetEntity;
			var targetLoc = target.locatable().loc;

			if
			(
				actorLoc.placeName == targetLoc.placeName
				&& actorLoc.pos.equals(targetLoc.pos)
			)
			{
				order.isComplete = true;
			}
		}
	}

	useDevice
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): void
	{
		var orderable = Orderable.fromEntity(entity);
		var order = orderable.order;

		var ship = entity as Ship;

		var device = ship.deviceSelected;
		if (device != null)
		{
			var projectile = device.projectile;
			var venue = universe.venueCurrent as VenueStarsystem;
			var starsystem = venue.starsystem;

			if (projectile == null)
			{
				// hack - Replace with dedicated Projectile class.
				projectile = new Ship
				(
					ship.name + "_projectile",
					Projectile.bodyDefnBuild(),
					ship.locatable().loc.pos.clone(),
					ship.factionName,
					null // devices
				);
				projectile.energyPerMove = 0;
				projectile.distancePerMove = 1000;

				projectile.actor().activity = 
					Activity.fromDefnNameAndTargetEntity
					(
						"MoveToTarget", order.targetEntity
					);

				starsystem.shipAdd(projectile);

				device.projectile = projectile;
			}
			else
			{
				ArrayHelper.remove(starsystem.ships, projectile);
				device.projectile = null;

				var projectilePos = projectile.locatable().loc.pos;
				var targetPos = order.targetEntity.locatable().loc.pos;

				if (projectilePos.equals(targetPos))
				{
					order.isComplete = true;
				}
			}

		}
	}
}
