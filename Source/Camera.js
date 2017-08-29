
function Camera(viewSize, focalLength, pos, orientation)
{
	this.viewSize = viewSize;
	this.focalLength = focalLength;
	this.loc = new Location(pos);
	this.orientation = orientation;

	this.viewSizeHalf = this.viewSize.clone().divideScalar(2);
}

{
	Camera.prototype.convertWorldCoordsToViewCoords = function(coordsToConvert)
	{
		coordsToConvert.subtract
		(
			this.loc.pos
		);

		coordsToConvert.overwriteWithDimensions
		(
			this.orientation.right.dotProduct(coordsToConvert),
			this.orientation.down.dotProduct(coordsToConvert),
			this.orientation.forward.dotProduct(coordsToConvert)
		);

		var distanceForwardInFocalLengths = coordsToConvert.z / this.focalLength;

		coordsToConvert.x /= distanceForwardInFocalLengths;
		coordsToConvert.y /= distanceForwardInFocalLengths;

		coordsToConvert.x += this.viewSize.x / 2;
		coordsToConvert.y += this.viewSize.y / 2;

		return coordsToConvert;
	}

	Camera.prototype.rayToViewPos = function(posToProjectRayTo)
	{
		var orientation = this.orientation;	
		var returnValue = new Ray
		(
			this.loc.pos,
			orientation.forward.clone().multiplyScalar
			(
				this.focalLength
			).add
			(
				orientation.right.clone().multiplyScalar
				(
					posToProjectRayTo.x
				)
			).add
			(
				orientation.down.clone().multiplyScalar
				(
					posToProjectRayTo.y
				)
			)	
		);	

		return returnValue;
	}
}
