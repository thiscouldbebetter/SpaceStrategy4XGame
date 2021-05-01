
class Device //
{
	defn: DeviceDefn;

	energyThisTurn: number;
	isActive: boolean;
	shieldingThisTurn: number;
	usesThisTurn: number;

	projectile: Ship;

	target: Entity;

	constructor(defn: DeviceDefn)
	{
		this.defn = defn;
	}

	updateForTurn
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): void
	{
		this.defn.updateForTurn(universe, world, place, entity, this);
	}

	use
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): void
	{
		this.defn.use(universe, world, place, entity, this);
	}
}
