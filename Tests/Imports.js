"use strict";
var gf = ThisCouldBeBetter.GameFramework;
// hack
// These classes currently have to come first.
var RandomizerLCG = gf.RandomizerLCG;
// Extensions.
var ArrayHelper = gf.ArrayHelper;
var NumberHelper = gf.NumberHelper;
var StringHelper = gf.StringHelper;
// Controls.
var ControlActionNames = gf.ControlActionNames;
var ControlBase = gf.ControlBase;
var ControlBuilder = gf.ControlBuilder;
var ControlButton = gf.ControlButton;
var ControlContainer = gf.ControlContainer;
var ControlContainerTransparent = gf.ControlContainerTransparent;
var ControlLabel = gf.ControlLabel;
var ControlList = gf.ControlList;
var ControlScrollbar = gf.ControlScrollbar;
var ControlSelect = gf.ControlSelect;
var ControlSelectOption = gf.ControlSelectOption;
var ControlStyle = gf.ControlStyle;
var ControlTextBox = gf.ControlTextBox;
var ControlVisual = gf.ControlVisual;
var DataBinding = gf.DataBinding;
var VenueControls = gf.VenueControls;
var VenueMessage = gf.VenueMessage;
// Display.
var Color = gf.Color;
var Drawable = gf.Drawable;
var Display2D = gf.Display2D;
var DisplayRecorder = gf.DisplayRecorder;
var DisplayTest = gf.DisplayTest;
var VenueFader = gf.VenueFader;
var VenueLayered = gf.VenueLayered;
var VisualCircle = gf.VisualCircle;
var VisualCircleGradient = gf.VisualCircleGradient;
var VisualDirectional = gf.VisualDirectional;
var VisualDynamic = gf.VisualDynamic;
var VisualGroup = gf.VisualGroup;
var VisualImageFromLibrary = gf.VisualImageFromLibrary;
var VisualImageImmediate = gf.VisualImageImmediate;
var VisualImageScaled = gf.VisualImageScaled;
var VisualLine = gf.VisualLine;
var VisualNone = gf.VisualNone;
var VisualOffset = gf.VisualOffset;
var VisualPolygon = gf.VisualPolygon;
var VisualRectangle = gf.VisualRectangle;
var VisualSelect = gf.VisualSelect;
var VisualText = gf.VisualText;
// Display - Visuals - Animation.
var VisualAnimation = gf.VisualAnimation;
// Geometry.
var Camera = gf.Camera;
var CollisionHelper = gf.CollisionHelper;
var Coords = gf.Coords;
var Disposition = gf.Disposition;
var Orientation = gf.Orientation;
var Polar = gf.Polar;
var RangeExtent = gf.RangeExtent;
var Rotation = gf.Rotation;
// Geometry - Shapes.
var Box = gf.Box;
var BoxRotated = gf.BoxRotated;
var Cylinder = gf.Cylinder;
var Edge = gf.Edge;
var Face = gf.Face;
var Hemispace = gf.Hemispace;
var Path = gf.Path;
var Plane = gf.Plane;
var Ray = gf.Ray;
var ShapeContainer = gf.ShapeContainer;
var ShapeGroupAll = gf.ShapeGroupAll;
var ShapeGroupAny = gf.ShapeGroupAny;
var ShapeInverse = gf.ShapeInverse;
var Sphere = gf.Sphere;
// Geometry - Shapes - Map.
var MapLocated = gf.MapLocated;
// Geometry - Shapes - Meshes.
var Mesh = gf.Mesh;
;
var Transform_Locate = gf.Transform_Locate;
var Transform_Orient = gf.Transform_Orient;
var Transform_Translate = gf.Transform_Translate;
var Transforms = gf.Transforms;
// Input.
var ActionToInputsMapping = gf.ActionToInputsMapping;
var Input = gf.Input;
var InputHelper = gf.InputHelper;
// Media.
var Font = gf.Font;
var Image2 = gf.Image2;
var MediaLibrary = gf.MediaLibrary;
var Sound = gf.Sound;
var SoundHelper = gf.SoundHelper;
var VenueVideo = gf.VenueVideo;
var Video = gf.Video;
var VideoHelper = gf.VideoHelper;
var VisualSound = gf.VisualSound;
// Model.
var Entity = gf.Entity;
var EntityBuilder = gf.EntityBuilder;
var Place = gf.Place;
var Universe = gf.Universe;
var UniverseWorldPlaceEntities = gf.UniverseWorldPlaceEntities;
var VenueWorld = gf.VenueWorld;
var World = gf.World;
// Model - Actors.
var Action = gf.Action;
var Activity = gf.Activity;
var ActivityDefn = gf.ActivityDefn;
var Actor = gf.Actor;
// Model - Combat.
var Killable = gf.Killable;
// Model - Physics.
var Constrainable = gf.Constrainable;
var Locatable = gf.Locatable;
// Profiles.
var Profile = gf.Profile;
// Storage.
var FileHelper = gf.FileHelper;
var Serializer = gf.Serializer;
var StorageHelper = gf.StorageHelper;
var VenueFileUpload = gf.VenueFileUpload;
// Storage - Compressor.
var BitStream = gf.BitStream;
var ByteStreamFromString = gf.ByteStreamFromString;
var CompressorLZW = gf.CompressorLZW;
// Tests.
var Assert = gf.Assert;
var TestFixture = gf.TestFixture;
var TestSuite = gf.TestSuite;
// Utility.
var DateTime = gf.DateTime;
var IDHelper = gf.IDHelper;
var PlatformHelper = gf.PlatformHelper;
var RandomizerSystem = gf.RandomizerSystem;
var Reference = gf.Reference;
var TimerHelper = gf.TimerHelper;
var URLParser = gf.URLParser;
var ValueBreak = gf.ValueBreak;
var ValueBreakGroup = gf.ValueBreakGroup;
var VenueTask = gf.VenueTask;
