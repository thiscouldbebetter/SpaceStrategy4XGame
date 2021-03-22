
class MapCell
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
