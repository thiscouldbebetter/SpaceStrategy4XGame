
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
			// obey
			function(actor, order)
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
					var actorLoc = actor.loc;
					var target = order.target;
					var targetLoc = target.loc;

					if
					(
						actorLoc.venueName == targetLoc.venueName
						&& actorLoc.pos.equals(targetLoc.pos)
					)
					{
						order.isComplete = true;
					}
				}

			}
		);

		this._All =
		[
			this.Go,
		];

		this._All.addLookups("name");
	}

	OrderDefn.Instances = new OrderDefn_Instances();
}