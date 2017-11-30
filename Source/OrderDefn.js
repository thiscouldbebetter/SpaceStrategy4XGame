
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
				var target = order.target;
				if (actor.loc.equals(target.loc) == true)
				{
					order.isComplete = true;
				}
				else if (actor.activity == null)
				{
					actor.activity = new Activity
					(
						"MoveToTarget",
						[ order.target ]
					);
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
