
function Constraint_Cursor()
{
	this.name = "Cursor";

	// Helper variables.

	this._max = new Coords();
	this._min = new Coords();
	this._boundsToRestrictTo = new Box(this._min, this._max);
}

{
	Constraint_Cursor.prototype.constrain = function(universe, world, place, body)
	{
		var cursor = body;
		var venue = universe.venueCurrent;
		var mousePos = universe.inputHelper.mouseMovePos.clone();

		var camera = venue.camera;
		var cameraLoc = camera.loc;
		var cameraPos = cameraLoc.pos;
		var cameraOrientation = cameraLoc.orientation;

		mousePos.subtract(camera.viewSizeHalf);

		var xyPlaneNormal = new Coords(0, 0, 1);

		var cursorPos = cursor.locatable().loc.pos;

		var cameraForward = cameraOrientation.forward;
		var displacementFromCameraToMousePosProjected = cameraForward.clone().multiplyScalar
		(
			camera.focalLength
		).add
		(
			cameraOrientation.right.clone().multiplyScalar
			(
				mousePos.x
			)
		).add
		(
			cameraOrientation.down.clone().multiplyScalar
			(
				mousePos.y
			)
		);

		var rayFromCameraToMousePos = new Ray
		(
			cameraPos,
			displacementFromCameraToMousePosProjected
		);

		if (cursor.hasXYPositionBeenSpecified == false)
		{
			this._boundsToRestrictTo.fromMinAndMax
			(
				this._min.overwriteWithDimensions
				(
					Number.NEGATIVE_INFINITY,
					Number.NEGATIVE_INFINITY,
					0
				),
				this._max.overwriteWithDimensions
				(
					Number.POSITIVE_INFINITY,
					Number.POSITIVE_INFINITY,
					0
				)
			);

			var planeToRestrictTo = new Plane
			(
				xyPlaneNormal,
				0
			);

			var collisionPos = new Collision().rayAndPlane
			(
				rayFromCameraToMousePos,
				planeToRestrictTo
			).pos;

			if (collisionPos != null)
			{
				body.locatable().loc.pos.overwriteWith(collisionPos);
			}
		}
		else // if (cursor.hasXYPositionBeenSpecified == true)
		{
			this._boundsToRestrictTo.fromMinAndMax
			(
				this._pos.overwriteWithDimensions
				(
					cursorPos.x,
					cursorPos.y,
					Number.NEGATIVE_INFINITY
				),
				this._pos.overwriteWithDimensions
				(
					cursorPos.x,
					cursorPos.y,
					Number.POSITIVE_INFINITY
				)
			);

			var planeNormal = xyPlaneNormal.clone().crossProduct
			(
				cameraOrientation.right
			);

			cursorPos.z = 0;

			var planeToRestrictTo = new Plane
			(
				planeNormal,
				cursorPos.dotProduct(planeNormal)
			);

			var collisionPos = new Collision().rayAndPlane
			(
				rayFromCameraToMousePos,
				planeToRestrictTo
			).pos;

			if (collisionPos != null)
			{
				cursorPos.z = collisionPos.z;
			}
		}

		cursorPos.trimToRangeMinMax
		(
			this._boundsToRestrictTo._min,
			this._boundsToRestrictTo._max
		);
	};
}
