
function Constraint_Cursor()
{
	this.name = "Cursor";

	// Helper variables.

	this.boundsToRestrictToMin = new Coords();
	this.boundsToRestrictToMax = new Coords();
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

		var cursorPos = cursor.loc.pos;

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
			this.boundsToRestrictToMin.overwriteWithDimensions
			(
				Number.NEGATIVE_INFINITY,
				Number.NEGATIVE_INFINITY,
				0
			);

			this.boundsToRestrictToMax.overwriteWithDimensions
			(
				Number.POSITIVE_INFINITY,
				Number.POSITIVE_INFINITY,
				0
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
				body.loc.pos.overwriteWith(collisionPos);
			}
		}
		else
		{
			this.boundsToRestrictToMin.overwriteWithDimensions
			(
				cursorPos.x,
				cursorPos.y,
				Number.NEGATIVE_INFINITY
			);
			this.boundsToRestrictToMax.overwriteWithDimensions
			(
				cursorPos.x,
				cursorPos.y,
				Number.POSITIVE_INFINITY
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
			this.boundsToRestrictToMin,
			this.boundsToRestrictToMax
		);
	}
}
