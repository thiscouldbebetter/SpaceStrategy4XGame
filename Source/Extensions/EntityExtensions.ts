
class EntityExtensions
{
	static body(entity: Entity)
	{
		return entity.propertyByName(Body.name) as Body;
	}

	static buildable(entity: Entity)
	{
		return entity.propertyByName(Buildable.name) as Buildable;
	}

	static cursor(entity: Entity)
	{
		return entity.propertyByName(Cursor.name) as Cursor;
	}

	static linkPortal(entity: Entity)
	{
		return entity.propertyByName(LinkPortal.name) as LinkPortal;
	}

	static networkNode(entity: Entity)
	{
		return entity.propertyByName(NetworkNode2.name) as NetworkNode2;
	}

	static planet(entity: Entity)
	{
		return entity.propertyByName(Planet.name) as Planet;
	}

	static ship(entity: Entity)
	{
		return entity.propertyByName(Ship.name) as Ship;
	}
}
