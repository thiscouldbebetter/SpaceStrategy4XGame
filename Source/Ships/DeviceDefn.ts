
class DeviceDefn
{
	name: string;
	isActive: boolean;
	needsTarget: boolean;
	categories: BuildableCategory[];
	_initialize: (uwpe: UniverseWorldPlaceEntities) => void;
	updateForRound: (uwpe: UniverseWorldPlaceEntities) => void;
	usesPerRound: number;
	energyPerUse: number;
	_use: (uwpe: UniverseWorldPlaceEntities) => void;

	constructor
	(
		name: string,
		isActive: boolean,
		needsTarget: boolean,
		categories: BuildableCategory[],
		initialize: (uwpe: UniverseWorldPlaceEntities) => void,
		updateForRound: (uwpe: UniverseWorldPlaceEntities) => void,
		usesPerRound: number,
		energyPerUse: number,
		use: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.name = name;
		this.isActive = isActive;
		this.needsTarget = needsTarget;
		this.categories = categories;
		this._initialize = initialize;
		this.updateForRound = updateForRound;
		this.usesPerRound = usesPerRound || 1;
		this.energyPerUse = energyPerUse || 0;
		this._use = use;
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this._initialize(uwpe);
	}

	use(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._use != null)
		{
			var entityUsing = uwpe.entity;
			var deviceUser = DeviceUser.ofEntity(entityUsing);
			var energyNeededIsAvailable =
				deviceUser.energyRemainsThisRound(this.energyPerUse);
			if (energyNeededIsAvailable)
			{
				deviceUser.energyRemainingThisRoundSubtract(this.energyPerUse);
				this._use(uwpe);
			}
		}
	}
}
