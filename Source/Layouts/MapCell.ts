
class MapCell2
{
	pos: Coords;
	terrain: MapTerrain;
	body: Entity;

	constructor(pos: Coords, terrain: MapTerrain, body: Entity)
	{
		this.pos = pos;
		this.terrain = terrain;
		this.body = body;
	}
}
