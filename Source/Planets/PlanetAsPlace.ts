
class PlanetAsPlace extends PlaceBase
{
	planet: Planet;

	constructor(planet: Planet)
	{
		super
		(
			planet.name,
			null, // defnName
			null, // parentName
			null, // size
			null // entities
		);

		this.planet = planet;
	}
}
