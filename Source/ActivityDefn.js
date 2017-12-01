
function ActivityDefn(name, perform)
{
	this.name = name;
	this.perform = perform;
}

{
	ActivityDefn.Instances = new ActivityDefn_Instances();

	function ActivityDefn_Instances()
	{
		this.DoNothing = new ActivityDefn
		(
			"DoNothing",
			function(universe, actor, activity)
			{
				// do nothing
			}
		);

		this.MoveToTarget = new ActivityDefn
		(
			"MoveToTarget",
			function perform(universe, actor, activity)
			{
				var variables = activity.variables;
				var target = variables[0];

				var distanceMovedThisStep = variables[1];
				if (distanceMovedThisStep == null)
				{
					distanceMovedThisStep = 0;
				}
				var distanceToMoveThisTick = 3; // hack
				var distancePerStepMax = 100000; // hack
				if (distanceMovedThisStep + distanceToMoveThisTick > distancePerStepMax)
				{
					distanceToMoveThisTick = distancePerStepMax - distanceMovedThisStep;
				}

				var actorLoc = actor.loc;
				var actorPos = actorLoc.pos;
				var actorVel = actorLoc.vel;

				var targetPos = target.loc.pos;
				var displacementFromActorToTarget = targetPos.clone().subtract
				(
					actorPos
				);
				var distanceFromActorToTarget = displacementFromActorToTarget.magnitude();

				if (distanceFromActorToTarget < distanceToMoveThisTick)
				{
					distanceToMoveThisTick = distanceFromActorToTarget;
					actorPos.overwriteWith(targetPos);

					actor.activity = null; // hack
					actor.order = null; // hack

					universe.inputHelper.isEnabled = true;

					var targetDefnName = target.defn.name;
					if (targetDefnName == "LinkPortal")
					{
						var links = universe.world.network.links;

						var venueCurrent = universe.venueCurrent;
						var starsystemFrom = venueCurrent.starsystem;

						var starsystemNamesFromAndTo = target.starsystemNamesFromAndTo;
						var starsystemNameFrom = starsystemNamesFromAndTo[0];
						var starsystemNameTo = starsystemNamesFromAndTo[1];

						var link = links[starsystemNameFrom][starsystemNameTo];

						starsystemFrom.ships.splice
						(
							starsystemFrom.ships.indexOf(actor), 1
						);
						venueCurrent.bodies.splice
						(
							venueCurrent.bodies.indexOf(actor), 1
						)

						link.ships.push(actor);

						var direction;
						if (link.nodesLinked(universe)[0].starsystem == starsystemFrom)
						{
							direction = 1;
						}
						else
						{
							direction = -1;
						}

						actorPos.overwriteWithDimensions(0, 0, 0);
						var speed = 10; // hack
						actorVel.overwriteWithDimensions(speed * direction, 0, 0);
					}
					else if (targetDefnName == "Planet")
					{
						alert("todo - planet collision");
					}
				}
				else
				{
					var directionFromActorToTarget = displacementFromActorToTarget.divideScalar
					(
						distanceFromActorToTarget
					);

					actorVel.overwriteWith
					(
						directionFromActorToTarget
					).multiplyScalar
					(
						distanceToMoveThisTick
					);

					actorPos.add(actorVel);
				}

				distanceMovedThisStep += distanceToMoveThisTick;
				variables[1] = distanceMovedThisStep;
			}
		);

		this._All = 
		[
			this.DoNothing,

			this.MoveToTarget,
		];
	}
}
