
function Coords(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
}

{
	// constants

	Coords.NumberOfDimensions = 3;

	// instances

	function Coords_Instances()
	{
		this.Zeroes = new Coords(0, 0, 0);
	}

	Coords.Instances = new Coords_Instances();

	// methods

	Coords.prototype.absolute = function(other)
	{
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
		this.z = Math.abs(this.z);

		return this;
	}

	Coords.prototype.add = function(other)
	{
		this.x += other.x;
		this.y += other.y;
		this.z += other.z;

		return this;
	}

	Coords.prototype.clone = function()
	{
		return new Coords(this.x, this.y, this.z);
	}

	Coords.prototype.crossProduct = function(other)
	{
		return this.overwriteWithDimensions
		(
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x
		);
	}

	Coords.prototype.dimension = function(dimensionIndex)
	{
		var returnValue;

		if (dimensionIndex == 0)
		{
			returnValue = this.x;
		}
		else if (dimensionIndex == 1)
		{
			returnValue = this.y;
		}
		else 
		{
			returnValue = this.z;
		}

		return returnValue;
	}

	Coords.prototype.dimensions = function()
	{
		return [ this.x, this.y, this.z ];
	}

	Coords.prototype.dimension_Set = function(dimensionIndex, value)
	{
		if (dimensionIndex == 0)
		{
			this.x = value;
		}
		else if (dimensionIndex == 1)
		{
			this.y = value;
		}
		else 
		{
			this.z = value;
		}

		return this;
	}

	Coords.prototype.divide = function(other)
	{
		this.x /= other.x;
		this.y /= other.y;
		this.z /= other.z;

		return this;
	}

	Coords.prototype.divideScalar = function(scalar)
	{
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;

		return this;
	}

	Coords.prototype.dotProduct = function(other)
	{
		var returnValue = 
			this.x * other.x 
			+ this.y * other.y
			+ this.z * other.z;

		return returnValue;
	}

	Coords.prototype.equals = function(other)
	{
		var returnValue = 
		(
			this.x == other.x 
			&& this.y == other.y
			&& this.z == other.z
		);

		return returnValue;
	}

	Coords.prototype.floor = function(other)
	{
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);
		return this;
	}

	Coords.prototype.isWithinRangeMax = function(max)
	{
		var returnValue = 
		(
			this.x >= 0
			&& this.x <= max.x
			&& this.y >= 0
			&& this.y <= max.y
			&& this.z >= 0
			&& this.z <= max.z
		);

		return returnValue;
	}

	Coords.prototype.isWithinRangeMinMax = function(min, max)
	{
		var returnValue = 
		(
			this.x >= min.x
			&& this.x <= max.x
			&& this.y >= min.y
			&& this.y <= max.y
		);

		return returnValue;
	}

	Coords.prototype.magnitude = function()
	{
		return Math.sqrt
		(
			this.x * this.x
			+ this.y * this.y
			+ this.z * this.z
		);
	}

	Coords.prototype.multiply = function(other)
	{
		this.x *= other.x;
		this.y *= other.y;
		this.z *= other.z;

		return this;
	}

	Coords.prototype.multiplyScalar = function(scalar)
	{
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;
	}

	Coords.prototype.normalize = function()
	{
		return this.divideScalar(this.magnitude());
	}

	Coords.prototype.overwriteWith = function(other)
	{
		this.x = other.x;
		this.y = other.y;
		this.z = other.z;

		return this;
	}

	Coords.prototype.overwriteWithDimensions = function(x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;

		return this;
	}

	Coords.prototype.perpendicular2D = function()
	{
		var temp = this.x;
		this.x = this.y;
		this.y = 0 - temp;

		return this;
	}

	Coords.prototype.perpendicular3D = function()
	{
		var dimensionsAbsolute = this.clone().absolute().dimensions();

		var dimensionAbsoluteLeast = dimensionsAbsolute[0];
		var indexOfDimensionAbsoluteLeast = 0;

		for (var d = 1; d < dimensionsAbsolute.length; d++)
		{
			var dimensionAbsolute = dimensionsAbsolute[d];
			if (dimensionAbsolute < dimensionAbsoluteLeast)
			{
				dimensionAbsoluteLeast = dimensionAbsolute;
				indexOfDimensionAbsoluteLeast = d;
			}
		}

		var basisVector = new Coords(0, 0, 0).dimension_Set
		(
			indexOfDimensionAbsoluteLeast,
			1
		)

		this.crossProduct
		(
			basisVector
		);

		return this;
	}

	Coords.prototype.randomize = function()
	{
		this.overwriteWithDimensions
		(
			Math.random(),
			Math.random(),
			Math.random()
		);
		return this;
	}

	Coords.prototype.subtract = function(other)
	{
		this.x -= other.x;
		this.y -= other.y;
		this.z -= other.z;

		return this;
	}

	Coords.prototype.trimToRangeMinMax = function(min, max)
	{
		for (var d = 0; d < Coords.NumberOfDimensions; d++)
		{
			var thisDimension = this.dimension(d);

			var minDimension = min.dimension(d);
			var maxDimension = max.dimension(d);

			if (thisDimension < minDimension)
			{
				thisDimension = minDimension;
			} 
			else if (thisDimension > maxDimension)
			{
				thisDimension = maxDimension;				
			}

			this.dimension_Set(d, thisDimension);
		}
	}
}
