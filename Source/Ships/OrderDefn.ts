
class OrderDefn
{
	name: string;
	description: string;
	obey: (u: Universe, w: World, p: Place, e: Entity)=>void;

	constructor
	(
		name: string,
		description: string,
		obey: (u: Universe, w: World, p: Place, e: Entity)=>void
	)
	{
		this.name = name;
		this.description = description;
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
			"Go", "moving to", this.go
		);

		this.UseDevice = new OrderDefn
		(
			"UseDevice", "using", this.useDevice
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

		var activity = actor.activity;
		if (activity.defnName == ActivityDefn.Instances().DoNothing.name)
		{
			activity.defnNameAndTargetEntitySet
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
			var projectileEntity =
				device.projectileEntity as Ship; // hack - Replace with dedicated Projectile class.
			var venue = universe.venueCurrent as VenueStarsystem;
			var starsystem = venue.starsystem;

			if (projectileEntity == null)
			{
				projectileEntity = new Ship
				(
					ship.name + "_projectile",
					Projectile.bodyDefnBuild(),
					ship.locatable().loc.pos.clone(),
					ship.factionName,
					null // devices
				);
				var turnAndMove = 
					projectileEntity.turnAndMove;
				turnAndMove.energyPerMove = 0;
				turnAndMove.distancePerMove = 1000;

				projectileEntity.actor().activity = 
					Activity.fromDefnNameAndTargetEntity
					(
						"MoveToTarget", order.targetEntity
					);

				starsystem.shipAdd(projectileEntity);

				device.projectileEntity = projectileEntity;
			}
			else
			{
				ArrayHelper.remove(starsystem.ships, projectileEntity);
				device.projectileEntity = null;

				var projectilePos = projectileEntity.locatable().loc.pos;
				var targetPos = order.targetEntity.locatable().loc.pos;

				if (projectilePos.equals(targetPos))
				{
					order.isComplete = true;
				}
			}

		}
	}
}
