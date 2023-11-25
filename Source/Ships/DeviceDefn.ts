
class DeviceDefn extends ItemDefn
{
	isActive: boolean;
	needsTarget: boolean;
	categoryNames: string[];
	_initialize: (uwpe: UniverseWorldPlaceEntities) => void;
	updateForRound: (uwpe: UniverseWorldPlaceEntities) => void;

	constructor
	(
		name: string,
		isActive: boolean,
		needsTarget: boolean,
		categoryNames: string[],
		initialize: (uwpe: UniverseWorldPlaceEntities) => void,
		updateForRound: (uwpe: UniverseWorldPlaceEntities) => void,
		use: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		super
		(
			name,
			name, // appearance
			name, // description
			null, // mass
			null, // tradeValue
			null, // stackSizeMax
			categoryNames,
			use,
			null, // visual
			null, // toEntity
		);
		this.isActive = isActive;
		this.needsTarget = needsTarget;
		this._initialize = initialize;
		this.updateForRound = updateForRound;
		this.use = use;
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this._initialize(uwpe);
	}

	toItem(): Device
	{
		return new Device(this);
	}
}
