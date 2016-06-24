
function DisplayHelper(viewSize, fontHeightInPixels)
{
	this.viewSize = viewSize;
	this.fontHeightInPixels = fontHeightInPixels;
}

{
	DisplayHelper.prototype.clear = function(colorBorder, colorBack)
	{
		this.drawRectangle
		(
			new Coords(0, 0), 
			this.viewSize, 
			(colorBorder == null ? "Gray" : colorBorder), 
			(colorBack == null ? "White" : colorBack)
		);
	}

	DisplayHelper.prototype.drawControlButton = function(control, pos)
	{
		var size = control.size;

		var colorsForeAndBack;

		if (control.isEnabled() == false)
		{
			colorsForeAndBack = ["LightGray", "White"];
		}
		else if (control.isHighlighted == true)
		{
			colorsForeAndBack = ["White", "Gray"];
		}
		else
		{
			colorsForeAndBack = ["Gray", "White"];
		}

		this.drawRectangle
		(
			pos, size, 
			colorsForeAndBack[0], colorsForeAndBack[1]
		)

		var text = control.text;

		var textWidth = this.graphics.measureText(text).width;
		var textMarginLeft = (size.x - textWidth) / 2;
		var textHeight = this.fontHeightInPixels;
		var textMarginTop = (size.y - textHeight) / 2;

		this.graphics.fillStyle = colorsForeAndBack[0];
		this.graphics.fillText
		(
			text,
			pos.x + textMarginLeft,
			pos.y + textMarginTop + textHeight
		);
	}

	DisplayHelper.prototype.drawControlContainer = function(container, pos)
	{
		var size = container.size;

		this.drawRectangle
		(
			pos, 
			size, 
			container.colorsForeAndBack[0], 
			container.colorsForeAndBack[1]
		)

		var children = container.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.draw
			(
				pos.clone().add(child.pos)
			);
		}
	}

	DisplayHelper.prototype.drawControlImage = function(controlImage, pos)
	{
		var size = controlImage.size;

		this.drawRectangle
		(
			pos, size, "Gray", "White"
		)

		this.graphics.drawImage
		(
			controlImage.systemImage,
			pos.x, pos.y,
			this.viewSize.x, this.viewSize.y
		);
	}

	DisplayHelper.prototype.drawControlLabel = function(control, pos)
	{
		var size = control.size;
		var text = control.text();

		var textHeight = this.fontHeightInPixels;

		var textMargins;

		if (control.isTextCentered == true)
		{
			var textWidth = this.graphics.measureText(text).width;
			textMargins = new Coords
			(
				(size.x - textWidth) / 2,
				(size.y - textHeight) / 2
			);
		}
		else
		{
			textMargins = new Coords
			(
				2,
				(size.y - textHeight) / 2
			);
		}

		this.graphics.fillStyle = "Gray";
		this.graphics.fillText
		(
			text,
			pos.x + textMargins.x ,
			pos.y + textMargins.y + textHeight
		);				
	}

	DisplayHelper.prototype.drawControlList = function(list, pos)
	{
		var size = list.size;

		this.drawRectangle
		(
			pos, size, "Gray", "White"
		);

		this.graphics.fillStyle = "Gray";
		var itemSpacing = 12; // hack
		var itemSizeY = itemSpacing;
		var textMarginLeft = 2;
		var itemPosY = pos.y;

		var items = list.options();
		var numberOfItems = (items == null ? 0 : items.length);

		var numberOfItemsVisible = Math.floor(size.y / itemSizeY);
		var indexStart = list.indexOfFirstOptionVisible;
		var indexEnd = indexStart + numberOfItemsVisible - 1;
		if (indexEnd >= numberOfItems)
		{
			indexEnd = numberOfItems - 1;
		}

		var optionSelected = list.optionSelected();

		var scrollbar = list.scrollbar;
		var scrollbarSize = scrollbar.size;
		var textAreaSize = new Coords(size.x - size.y, size.y);

		for (var i = indexStart; i <= indexEnd; i++)
		{
			var item = items[i];

			if (item == optionSelected)
			{
				this.graphics.fillStyle = "Gray";
				this.graphics.fillRect

				(
					pos.x + textMarginLeft, 
					itemPosY,
					size.x - textMarginLeft * 2,
					itemSizeY
				);
				this.graphics.fillStyle = "White";
			}
			else
			{
				this.graphics.fillStyle = "Gray";
			}

			var text = DataBinding.get
			(
				item, list.bindingExpressionForOptionText
			);

			itemPosY += itemSizeY;


			this.graphics.fillText
			(
				text,
				pos.x + textMarginLeft,
				itemPosY
			);			
		}

		this.drawControlScrollbar
		(
			scrollbar, 
			scrollbar.pos.clone().add(pos)
		);
	}

	DisplayHelper.prototype.drawControlScrollbar = function(control, pos)
	{
		var size = control.size;

		this.drawRectangle
		(
			pos,
			control.size,			
			"White", "Gray"
		);

		var buttonSize = new Coords(size.x, size.x);
		var buttonPositions = 
		[
			pos,
			new Coords
			(
				pos.x,
				pos.y + size.y - buttonSize.y
			)
		];

		var verticesForButtonArrow = 
		[
			new Coords(1/3, 2/3),
			new Coords(2/3, 2/3),
			new Coords(1/2, 1/3),
		];

		var vertexPos = new Coords(0, 0, 0);
		var ones = new Coords(1, 1, 1);

		for (var b = 0; b < buttonPositions.length; b++)
		{
			var buttonPos = buttonPositions[b];

			this.drawRectangle
			(
				buttonPos,
				buttonSize,			
				"Gray", "White"
			);
	
			this.graphics.beginPath();

			for (var v = 0; v < verticesForButtonArrow.length; v++)
			{
				vertexPos.overwriteWith(verticesForButtonArrow[v]);

				if (b == 1)
				{
					vertexPos.multiplyScalar(-1).add
					(
						ones
					);
				}

				vertexPos.multiply
				(
					buttonSize
				).add
				(
					buttonPos
				);

				if (v == 0)
				{
					this.graphics.moveTo
					(
						vertexPos.x, vertexPos.y
					);
				}
				else
				{
					this.graphics.lineTo
					(
						vertexPos.x, vertexPos.y
					);
				}
			}
			this.graphics.closePath();
			this.graphics.stroke();
		}

		var value = control.value();
		var min = control.min();
		var range = control.range();

		var sliderSize = new Coords(size.x, size.x);
		var slideRangeInPixels = size.y - buttonSize.y * 2 - sliderSize.y;

		var sliderPos = new Coords
		(
			0, 
			buttonSize.y + ((value - min) / range) * slideRangeInPixels
		).add
		(
			pos
		);

		this.drawRectangle
		(
			sliderPos,
			sliderSize,			
			"Gray", "White"
		);
	}

	DisplayHelper.prototype.drawControlSelect = function(control, pos)
	{
		var size = control.size;

		var colorsForeAndBack = ["Gray", "White"];

		this.drawRectangle
		(
			pos, size, 
			colorsForeAndBack[0], colorsForeAndBack[1]
		)

		var optionSelected = control.optionSelected();
		var text;
		if (optionSelected == null)
		{
			text = "[none]";
		}
		else
		{
			text = DataBinding.get(optionSelected, control.bindingExpressionForOptionText);
		}
		
		var textWidth = this.graphics.measureText(text).width;
		var textMarginLeft = (control.size.x - textWidth) / 2;
		var textHeight = this.fontHeightInPixels;
		var textMarginTop = (control.size.y - textHeight) / 2;

		this.graphics.fillStyle = colorsForeAndBack[0];
		this.graphics.fillText
		(
			text,
			pos.x + textMarginLeft,
			pos.y + textMarginTop + textHeight
		);
	}


	DisplayHelper.prototype.drawControlTextBox = function(control, pos)
	{
		var size = control.size;

		var text = control.text();
		var colorsForeAndBack;

		if (control.isHighlighted == true)
		{
			colorsForeAndBack = ["White", "Gray"];
			text += "|";
		}
		else
		{
			colorsForeAndBack = ["Gray", "White"];
		}

		this.drawRectangle
		(
			pos, size, 
			colorsForeAndBack[0], colorsForeAndBack[1]
		)

		var textWidth = this.graphics.measureText(text).width;
		var textMarginLeft = (size.x - textWidth) / 2;
		var textHeight = this.fontHeightInPixels;		
		var textMarginTop = (size.y - textHeight) / 2;

		this.graphics.fillStyle = colorsForeAndBack[0];
		this.graphics.fillText
		(
			text,
			pos.x + textMarginLeft ,
			pos.y + textMarginTop + textHeight
		);				
	}

	DisplayHelper.prototype.drawNetworkForCamera = function(network, camera)
	{
		var drawPos = this.drawPos;
		var drawPosFrom = new Coords(0, 0, 0);
		var drawPosTo = new Coords(0, 0, 0);

		var cameraPos = camera.loc.pos;

		var networkNodes = network.nodes;
		var numberOfNetworkNodes = networkNodes.length;

		var networkLinks = network.links;
		var numberOfNetworkLinks = networkLinks.length;

		this.graphics.fillStyle = "rgba(128, 128, 128, .1)";

		var nodeRadiusActual = NetworkNode.RadiusActual;

		for (var i = 0; i < numberOfNetworkLinks; i++)
		{
			var link = networkLinks[i];
			this.drawNetworkForCamera_Link
			(
				network, camera, link, 
				nodeRadiusActual, drawPos, 
				drawPosFrom, drawPosTo
			);
		}

		for (var i = 0; i < numberOfNetworkNodes; i++)
		{
			var node = networkNodes[i];
			this.drawNetworkForCamera_Node
			(
				node, nodeRadiusActual, camera, drawPos
			);
		}
	}

	DisplayHelper.prototype.drawNetworkForCamera_Link = function
	(
		network, 
		camera, 
		link,
		nodeRadiusActual, 
		drawPos, 
		drawPosFrom, 
		drawPosTo
	)
	{
		var nodesLinked = link.nodesLinked(network);
		var nodeFromPos = nodesLinked[0].loc.pos;
		var nodeToPos = nodesLinked[1].loc.pos;

		camera.convertWorldCoordsToViewCoords
		(
			drawPosFrom.overwriteWith(nodeFromPos)
		);
		
		camera.convertWorldCoordsToViewCoords
		(
			drawPosTo.overwriteWith(nodeToPos)
		);

		var directionFromNode0To1InView = drawPosTo.clone().subtract
		(
			drawPosFrom
		).normalize();

		var perpendicular = directionFromNode0To1InView.clone().perpendicular2D();

		var perspectiveFactorFrom = 
			camera.focalLength / drawPosFrom.z;
		var perspectiveFactorTo = 
			camera.focalLength / drawPosTo.z;
			
		var radiusApparentFrom = 
			nodeRadiusActual * perspectiveFactorFrom;
		var radiusApparentTo = 
			nodeRadiusActual * perspectiveFactorTo;

		this.graphics.beginPath();
		this.graphics.moveTo(drawPosFrom.x, drawPosFrom.y);
		this.graphics.lineTo(drawPosTo.x, drawPosTo.y);
		this.graphics.lineTo
		(
			drawPosTo.x + perpendicular.x * radiusApparentTo,
			drawPosTo.y + perpendicular.y * radiusApparentTo
		);
		this.graphics.lineTo
		(
			drawPosFrom.x + perpendicular.x * radiusApparentFrom, 
			drawPosFrom.y + perpendicular.y * radiusApparentFrom
		);
		this.graphics.fill();

		for (var i = 0; i < link.ships.length; i++)
		{
			var ship = link.ships[i];
			this.drawNetworkForCamera_Link_Ship
			(
				camera, link, ship, drawPos, nodeFromPos, nodeToPos
			);
		}
	}

	DisplayHelper.prototype.drawNetworkForCamera_Link_Ship = function
	(
		camera, link, ship, drawPos, nodeFromPos, nodeToPos
	)
	{
		var forward = link.direction();
		var linkLength = link.length();

		var fractionOfLinkTraversed = ship.loc.pos.x / linkLength; 

		if (ship.vel.x < 0)
		{
			fractionOfLinkTraversed = 1 - fractionOfLinkTraversed;
			forward.multiplyScalar(-1);
		}

		drawPos.overwriteWith
		(
			nodeFromPos
		).multiplyScalar
		(
			1 - fractionOfLinkTraversed
		).add
		(
			nodeToPos.clone().multiplyScalar
			(
				fractionOfLinkTraversed
			)
		);

		var right = forward.clone().perpendicular3D();
		var down = right.clone().crossProduct(forward);

		var scaleFactorLength = 8;
		var scaleFactorBase = scaleFactorLength / 3;
		forward.multiplyScalar(scaleFactorLength);
		right.multiplyScalar(scaleFactorBase);
		down.multiplyScalar(scaleFactorBase);

		var vertices = 
		[
			drawPos.clone().add(forward),
			drawPos.clone().add(right).add(down),
			drawPos.clone().add(right).subtract(down),
			drawPos.clone().subtract(right).subtract(down),
			drawPos.clone().subtract(right).add(down),
		];

		var vertexIndicesForFaces =
		[
			[ 0, 1, 2 ],
			[ 0, 2, 3 ],
			[ 0, 3, 4 ],
			[ 0, 4, 1 ],
		];

		this.graphics.strokeStyle = ship.faction().color.systemColor;
		
		for (var f = 0; f < vertexIndicesForFaces.length; f++)
		{
			var vertexIndicesForFace = vertexIndicesForFaces[f];

			this.graphics.beginPath();
	
			for (var vi = 0; vi < vertexIndicesForFace.length; vi++)
			{
				var vertexIndex = vertexIndicesForFace[vi];
				drawPos.overwriteWith(vertices[vertexIndex]);
				camera.convertWorldCoordsToViewCoords(drawPos);
				var moveToOrLineTo = (vi == 0 ? this.graphics.moveTo : this.graphics.lineTo);
				moveToOrLineTo.call(this.graphics, drawPos.x, drawPos.y);
			}

			this.graphics.closePath();
			this.graphics.stroke();
		}
	}

	DisplayHelper.prototype.drawNetworkForCamera_Node = function
	(
		node, nodeRadiusActual, camera, drawPos
	)
	{
		var nodePos = node.loc.pos;

		drawPos.overwriteWith(nodePos);
		camera.convertWorldCoordsToViewCoords(drawPos);

		var perspectiveFactor = camera.focalLength / drawPos.z;
		var radiusApparent = nodeRadiusActual * perspectiveFactor;

		var alpha = Math.pow(perspectiveFactor, 4); // hack

		//var nodeColor = node.defn.color.systemColor;
		var nodeColor = "rgba(128, 128, 128, " + alpha + ")"

		this.graphics.strokeStyle = nodeColor; 
		this.graphics.fillStyle = nodeColor;

		this.graphics.beginPath();
		this.graphics.arc
		(
			drawPos.x, drawPos.y, 
			radiusApparent, 
			0, 2 * Math.PI, // start and stop angles 
			false // counterClockwise
		);
		this.graphics.stroke();

		this.graphics.fillText
		(
			node.starsystem.name, 
			(drawPos.x + radiusApparent), 
			drawPos.y
		);
	}

	DisplayHelper.prototype.drawLayout = function(layout)
	{
		this.clear();
		this.drawMap(layout.map);
	}

	DisplayHelper.prototype.drawMap = function(map)
	{
		var pos = map.pos;
		var mapSizeInCells = map.sizeInCells;

		var cellPos = new Coords(0, 0);
		var drawPos = this.drawPos;
		var cellSizeInPixels = map.cellSizeInPixels;
		var cellSizeInPixelsHalf = 
			cellSizeInPixels.clone().divideScalar(2);

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPos.y = y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPos.x = x;

				drawPos.overwriteWith
				(
					cellPos
				).multiply
				(
					cellSizeInPixels
				).add
				(
					pos
				);

				var cell = map.cellAtPos(cellPos);
				var cellBody = cell.body;

				var colorFill = 
				(
					cellBody == null 
					? "Transparent" 
					: cellBody.defn.color
				);
				var colorBorder = cell.terrain.color;

				this.graphics.fillStyle = colorFill;
				this.graphics.fillRect
				(
					drawPos.x,
					drawPos.y,
					cellSizeInPixels.x,
					cellSizeInPixels.y
				);

				this.graphics.strokeStyle = colorBorder;
				this.graphics.strokeRect
				(
					drawPos.x,
					drawPos.y,
					cellSizeInPixels.x,
					cellSizeInPixels.y
				);

			}
		}

		var cursor = map.cursor;
		var cursorPos = cursor.pos;
		var cursorIsWithinMap = cursorPos.isWithinRangeMax
		(
			map.sizeInCellsMinusOnes
		);

		if (cursorIsWithinMap == true)
		{
			drawPos.overwriteWith
			(
				cursorPos
			).multiply
			(
				cellSizeInPixels
			).add
			(
				pos
			);			

			this.graphics.strokeStyle = "Cyan";

			if (cursor.bodyDefn == null)
			{
				this.graphics.beginPath();
				this.graphics.moveTo(drawPos.x, drawPos.y);
				this.graphics.lineTo
				(
					drawPos.x + cellSizeInPixels.x, 
					drawPos.y + cellSizeInPixels.y
				);
				this.graphics.moveTo
				(
					drawPos.x + cellSizeInPixels.x, 
					drawPos.y
				);
				this.graphics.lineTo
				(
					drawPos.x, 
					drawPos.y + cellSizeInPixels.y
				);
				this.graphics.stroke();
			}			
			else
			{
				this.graphics.fillStyle = cursor.bodyDefn.color;
				this.graphics.fillRect
				(
					drawPos.x,
					drawPos.y,
					cellSizeInPixels.x,
					cellSizeInPixels.y
				);
			}

			this.graphics.strokeRect
			(
				drawPos.x,
				drawPos.y,
				cellSizeInPixels.x,
				cellSizeInPixels.y
			);
		}
	}

	DisplayHelper.prototype.drawRectangle = function
	(
		pos, size, colorBorder, colorBack
	)
	{
		this.graphics.fillStyle = colorBack;
		this.graphics.fillRect
		(
			pos.x, pos.y,
			size.x, size.y
		);

		if (colorBorder != null)
		{
			this.graphics.strokeStyle = colorBorder;
			this.graphics.strokeRect
			(
				pos.x, pos.y,
				size.x, size.y
			);
		}
	}

	DisplayHelper.prototype.drawStarsystemForCamera = function(starsystem, camera)
	{
		var cameraViewSize = camera.viewSize;
		var cameraPos = camera.loc.pos;

		var drawPos = this.drawPos;
		var drawPosFrom = new Coords(0, 0, 0);
		var drawPosTo = new Coords(0, 0, 0);

		var gridCellSizeInPixels = new Coords(10, 10, 0);
		var gridSizeInCells = new Coords(40, 40, 0); 
		var gridSizeInPixels = gridSizeInCells.clone().multiply
		(
			gridCellSizeInPixels
		);
		var gridSizeInCellsHalf = gridSizeInCells.clone().divideScalar(2);
		var gridSizeInPixelsHalf = gridSizeInPixels.clone().divideScalar(2);

		var graphics = this.graphics;

		graphics.strokeStyle = Color.Instances.CyanHalfTranslucent.systemColor;

		for (var d = 0; d < 2; d++)
		{
			var multiplier = new Coords(0, 0, 0);
			multiplier.dimension_Set(d, gridCellSizeInPixels.dimension(d));

			for (var i = 0 - gridSizeInCellsHalf.x; i <= gridSizeInCellsHalf.x; i++)			
			{
				drawPosFrom.overwriteWith
				(
					gridSizeInPixelsHalf
				).multiplyScalar(-1);
				drawPosTo.overwriteWith(gridSizeInPixelsHalf);

				drawPosFrom.dimension_Set(d, 0);
				drawPosTo.dimension_Set(d, 0);

				drawPosFrom.add(multiplier.clone().multiplyScalar(i));
				drawPosTo.add(multiplier.clone().multiplyScalar(i));

				camera.convertWorldCoordsToViewCoords(drawPosFrom);
				camera.convertWorldCoordsToViewCoords(drawPosTo);

				graphics.beginPath();
				graphics.moveTo(drawPosFrom.x, drawPosFrom.y);
				graphics.lineTo(drawPosTo.x, drawPosTo.y);
				graphics.stroke();
			}
		}

		var bodiesByType =
		[
			[ starsystem.star ],
			starsystem.linkPortals,
			starsystem.planets,
			starsystem.ships,
		];

		for (var t = 0; t < bodiesByType.length; t++)
		{
			var bodies = bodiesByType[t];

			for (var i = 0; i < bodies.length; i++)
			{
				var body = bodies[i];
				this.drawStarsystemForCamera_Body
				(
					camera, 
					body
				);
			}

		}
	}

	DisplayHelper.prototype.drawStarsystemForCamera_Body = function(camera, body)
	{
		var graphics = this.graphics;
		var drawPos = this.drawPos;

		var bodyDefn = body.defn;
		var bodySize = bodyDefn.size;
		var bodySizeHalf = bodyDefn.sizeHalf;

		var bodyPos = body.loc.pos;
		drawPos.overwriteWith(bodyPos);
		camera.convertWorldCoordsToViewCoords(drawPos);

		bodyDefn.visual.draw(drawPos);

		if (bodyPos.z < 0)
		{
			graphics.strokeStyle = Color.Instances.Green.systemColor;
		}
		else
		{
			graphics.strokeStyle = Color.Instances.Red.systemColor;
		}

		graphics.beginPath();
		graphics.moveTo(drawPos.x, drawPos.y);

		drawPos.overwriteWith(bodyPos);
		drawPos.z = 0;
		camera.convertWorldCoordsToViewCoords(drawPos);

		graphics.lineTo(drawPos.x, drawPos.y);
		graphics.stroke();			
	}

	DisplayHelper.prototype.hide = function()
	{
		Globals.Instance.divMain.removeChild(this.canvasLive);		
	}

	DisplayHelper.prototype.initialize = function()
	{
		this.canvasBuffer = document.createElement("canvas");
		this.canvasBuffer.width = this.viewSize.x;
		this.canvasBuffer.height = this.viewSize.y;

		this.graphics = this.canvasBuffer.getContext("2d");
		this.graphics.font = 
			"" + this.fontHeightInPixels + "px sans-serif";

		// hack - double-buffering test
		this.canvasLive = this.canvasBuffer;
		this.graphicsLive = this.graphics;

		this.drawPos = new Coords(0, 0, 0);

		Globals.Instance.divMain.appendChild(this.canvasLive);
	}

	DisplayHelper.prototype.refresh = function()
	{
		this.graphicsLive.drawImage(this.canvasBuffer, 0, 0);
	}

	DisplayHelper.prototype.show = function()
	{
		Globals.Instance.divMain.appendChild(this.canvasLive);
	}
}
