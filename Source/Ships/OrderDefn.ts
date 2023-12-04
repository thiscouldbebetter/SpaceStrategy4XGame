
class OrderDefn
{
	name: string;
	description: string;
	_obey: (uwpe: UniverseWorldPlaceEntities) => void

	constructor
	(
		name: string,
		description: string,
		obey: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.name = name;
		this.description = description;
		this._obey = obey;
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
	
	obey(uwpe: UniverseWorldPlaceEntities): void
	{
		this._obey(uwpe);
	}
}

class OrderDefn_Instances
{
	DoNothing: OrderDefn;
	Go: OrderDefn;
	UseDevice: OrderDefn;

	_All: OrderDefn[];
	_AllByName: Map<string,OrderDefn>;

	constructor()
	{
		this.DoNothing = new OrderDefn
		(
			"DoNothing",
			"doing nothing",
			(uwpe: UniverseWorldPlaceEntities) => {}
		);
	
		this.Go = new OrderDefn
		(
			"Go", "moving to", this.go
		);

		this.UseDevice = new OrderDefn
		(
			"UseDevice", "using", this.useDevice
		);

		this._All =
		[
			this.DoNothing,
			this.Go,
			this.UseDevice,
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}

	go(uwpe: UniverseWorldPlaceEntities): void
	{
		var e = uwpe.entity;

		var actor = e.actor();
		var orderable = Orderable.fromEntity(e);
		var order = orderable.order(e);

		var activity = actor.activity;
		var activityDefnDoNothing = ActivityDefn.Instances().DoNothing;
		if (activity.defnName == activityDefnDoNothing.name)
		{
			activity.defnNameAndTargetEntitySet
			(
				"MoveToTarget", order.entityBeingTargeted
			);
		}
	}

	useDevice(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;
		var orderable = Orderable.fromEntity(entity);
		var order = orderable.order(entity);

		var entityOrderable = uwpe.entity as Ship;

		var device = order.deviceToUse;
		if (device != null)
		{
			var universe = uwpe.universe;
			var venue = universe.venueCurrent() as VenueStarsystem;
			var starsystem = venue.starsystem;

			var projectile = device.projectile;

			if (projectile == null)
			{
				projectile = new Projectile
				(
					entityOrderable.name + "_projectile",
					Ship.bodyDefnBuild(null), // hack
					entityOrderable.locatable().loc.pos.clone(),
					entityOrderable // shipFiredFrom
				);

				projectile.actor().activity = 
					Activity.fromDefnNameAndTargetEntity
					(
						"MoveToTarget", order.entityBeingTargeted
					);

				starsystem.entityToSpawnAdd(projectile);

				device.projectile = projectile;
			}
			else
			{
				device.projectile = null;

				var projectilePos = projectile.locatable().loc.pos;
				var targetPos = order.entityBeingTargeted.locatable().loc.pos;

				if (projectilePos.equals(targetPos))
				{
					order.complete();
				}
			}

		}
	}
}
