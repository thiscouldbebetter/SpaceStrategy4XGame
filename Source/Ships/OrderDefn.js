
function OrderDefn(name, obey)
{
	this.name = name;
	this.obey = obey;
}

{
	function OrderDefn_Instances()
	{
		this.Go = new OrderDefn
		(
			"Go",
			function obey(universe, actor, order)
			{
				if (actor.activity == null)
				{
					actor.activity = new Activity
					(
						"MoveToTarget", order.target
					);
				}
				else
				{
					var actorLoc = actor.locatable.loc;
					var target = order.target;
					var targetLoc = target.locatable.loc;

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
		);

		this.UseDevice = new OrderDefn
		(
			"UseDevice",
			function obey(universe, actor, order)
			{
				var device = actor.deviceSelected;
				if (device != null)
				{
					var projectile = device.projectile;
					var starsystem = universe.venueCurrent.starsystem;

					if (projectile == null)
					{
						// hack - Replace with dedicated Projectile class.
						projectile = new Ship
						(
							actor.name + "_projectile",
							new Projectile().bodyDefnBuild(),
							actor.locatable().loc.pos.clone(),
							actor.factionName,
							null // devices
						);
						projectile.energyPerMove = 0;
						projectile.distancePerMove = 1000;

						projectile.activity = new Activity
						(
							"MoveToTarget", order.target
						);

						starsystem.ships.push(projectile);

						device.projectile = projectile;
					}
					else
					{
						starsystem.ships.remove(projectile);
						device.projectile = null;

						var projectilePos = projectile.locatable().loc.pos;
						var targetPos = order.target.locatable().loc.pos;

						if (projectilePos.equals(targetPos))
						{
							order.isComplete = true;
						}
					}

				}
			}
		);

		this._All =
		[
			this.Go,
			this.UseDevice,
		];

		this._All.addLookupsByName();
	}

	OrderDefn.Instances = new OrderDefn_Instances();
}
