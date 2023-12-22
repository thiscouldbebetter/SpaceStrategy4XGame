
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
	Sleep: OrderDefn;
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

		this.Sleep = new OrderDefn
		(
			"Sleep",
			"sleeping",
			(uwpe: UniverseWorldPlaceEntities) => {}
		);

		this.UseDevice = new OrderDefn
		(
			"UseDevice", "using", this.useDevice
		);

		this._All =
		[
			this.DoNothing,

			this.Go,
			this.UseDevice
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}

	go(uwpe: UniverseWorldPlaceEntities): void
	{
		var shipMoving = uwpe.entity as Ship;
		var deviceUser = DeviceUser.ofEntity(shipMoving);
		var hasEnoughEnergy =
			deviceUser.energyRemainingThisRoundIsEnoughToMove(shipMoving);
		if (hasEnoughEnergy)
		{
			var energyPerMove = deviceUser.energyPerMove(shipMoving);
			deviceUser.energyRemainingThisRoundSubtract(energyPerMove);
			var orderable = Orderable.fromEntity(shipMoving);
			var order = orderable.order(shipMoving);
			var targetFinal = order.entityBeingTargeted;
			var targetFinalPos = targetFinal.locatable().loc.pos;
			var entityMovingPos = shipMoving.locatable().loc.pos;
			var displacementToTargetFinal =
				targetFinalPos.clone().subtract(entityMovingPos);
			var distanceToTargetFinal = displacementToTargetFinal.magnitude();
			var distanceMaxPerMove = deviceUser.distanceMaxPerMove(shipMoving);
			var entityTargetImmediate: Entity; 
			if (distanceToTargetFinal <= distanceMaxPerMove)
			{
				entityTargetImmediate = targetFinal;
			}
			else
			{
				var directionToTarget =
					displacementToTargetFinal.divideScalar(distanceToTargetFinal);
				var displacementToTargetImmediate =
					directionToTarget.multiplyScalar(distanceMaxPerMove);
				var targetImmediatePos =
					displacementToTargetImmediate.add(entityMovingPos);
				var targetAsLocatable = Locatable.fromPos(targetImmediatePos);
				entityTargetImmediate = Entity.fromProperty(targetAsLocatable);
			}

			var actor = shipMoving.actor();
			var activity = actor.activity;
			var activityDefnDoNothing = ActivityDefn.Instances().DoNothing;
			if (activity.defnName == activityDefnDoNothing.name)
			{
				activity.defnNameAndTargetEntitySet
				(
					"MoveToTargetCollideAndEndMove", entityTargetImmediate
				);
				var universe = uwpe.universe;
				var venue = universe.venueCurrent() as VenueStarsystem;
				venue.entityMoving = shipMoving;
			}
		}
	}

	useDevice(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;
		var orderable = Orderable.fromEntity(entity);
		var order = orderable.order(entity);

		var device = order.deviceToUse;
		if (device != null)
		{
			device.use(uwpe);
		}
	}
}
