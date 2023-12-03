
class DeviceDefn
{
	name: string;
	isActive: boolean;
	needsTarget: boolean;
	categoryNames: string[];
	_initialize: (uwpe: UniverseWorldPlaceEntities) => void;
	updateForRound: (uwpe: UniverseWorldPlaceEntities) => void;
	_use: (uwpe: UniverseWorldPlaceEntities) => void;

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
		this.name = name;
		this.isActive = isActive;
		this.needsTarget = needsTarget;
		this._initialize = initialize;
		this.updateForRound = updateForRound;
		this._use = use;
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this._initialize(uwpe);
	}

	use(uwpe: UniverseWorldPlaceEntities): void
	{
		this._use(uwpe);
	}
}
