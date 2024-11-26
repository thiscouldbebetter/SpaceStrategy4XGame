
import gf = ThisCouldBeBetter.GameFramework;

// hack
// These classes currently have to come first.

import Randomizer = gf.Randomizer;
import RandomizerLCG = gf.RandomizerLCG;

// Extensions.

import ArrayHelper = gf.ArrayHelper;
import NumberHelper = gf.NumberHelper;
import StringHelper = gf.StringHelper;

// hack

import EntityProperty = gf.EntityProperty;

// Controls.

import ControlActionNames = gf.ControlActionNames;
import ControlBase = gf.ControlBase;
import ControlBuilder = gf.ControlBuilder;
import ControlButton = gf.ControlButton;
import ControlCheckbox = gf.ControlCheckbox;
import ControlContainer = gf.ControlContainer;
import ControlContainerTransparent = gf.ControlContainerTransparent;
import ControlLabel = gf.ControlLabel;
import ControlList = gf.ControlList;
import ControlNumber = gf.ControlNumber;
import ControlScrollbar = gf.ControlScrollbar;
import ControlSelect = gf.ControlSelect;
import ControlSelectOption = gf.ControlSelectOption;
import ControlStyle = gf.ControlStyle;
import ControlTabbed = gf.ControlTabbed;
import ControlTextBox = gf.ControlTextBox;
import ControlVisual = gf.ControlVisual;
import Controllable = gf.Controllable;
import DataBinding = gf.DataBinding;
import VenueControls = gf.VenueControls;
import VenueMessage = gf.VenueMessage;

// Display.

import Color = gf.Color;
import Drawable = gf.Drawable;
import Display = gf.Display;
import Display2D = gf.Display2D;
import DisplayFarToNear = gf.DisplayFarToNear;
import DisplayRecorder = gf.DisplayRecorder;
import DisplayTest = gf.DisplayTest;
import VenueFader = gf.VenueFader;
import VenueLayered = gf.VenueLayered;

// Display - Visuals.

import Visual = gf.Visual;
import VisualBase = gf.VisualBase;
import VisualCameraProjection = gf.VisualCameraProjection;
import VisualCircle = gf.VisualCircle;
import VisualCircleGradient = gf.VisualCircleGradient;
import VisualDirectional = gf.VisualDirectional;
import VisualDynamic = gf.VisualDynamic;
import VisualEllipse = gf.VisualEllipse;
import VisualGroup = gf.VisualGroup;
import VisualImageFromLibrary = gf.VisualImageFromLibrary;
import VisualImageImmediate = gf.VisualImageImmediate;
import VisualImageScaled = gf.VisualImageScaled;
import VisualLine = gf.VisualLine;
import VisualNone = gf.VisualNone;
import VisualOffset = gf.VisualOffset;
import VisualPolygon = gf.VisualPolygon;
import VisualRectangle = gf.VisualRectangle;
import VisualRotate = gf.VisualRotate;
import VisualSelect = gf.VisualSelect;
import VisualText = gf.VisualText;

// Display - Visuals - Animation.

import VisualAnimation = gf.VisualAnimation;

// Geometry.

import Camera = gf.Camera;
import Collidable = gf.Collidable;
import Collision = gf.Collision;
import CollisionHelper = gf.CollisionHelper;
import Coords = gf.Coords;
import Disposition = gf.Disposition;
import Orientation = gf.Orientation;
import Polar = gf.Polar;
import RangeExtent = gf.RangeExtent;
import Rotation = gf.Rotation;

// Geometry - Shapes.

import Box = gf.Box;
import BoxRotated = gf.BoxRotated;
import Cylinder = gf.Cylinder;
import Edge = gf.Edge;
import Face = gf.Face;
import Hemispace = gf.Hemispace;
import Path = gf.Path;
import Plane = gf.Plane;
import Point = gf.Point;
import Ray = gf.Ray;
import ShapeContainer = gf.ShapeContainer;
import ShapeGroupAll = gf.ShapeGroupAll;
import ShapeGroupAny = gf.ShapeGroupAny;
import ShapeInverse = gf.ShapeInverse;
import ShapeNone = gf.ShapeNone;
import Sphere = gf.Sphere;

// Geometry - Shapes - Map.

import MapLocated = gf.MapLocated;

// Geometry - Shapes - Meshes.

import Mesh = gf.Mesh;;

// Geometry - Transforms.

import Transform = gf.Transform;
import TransformBase = gf.TransformBase;
import Transform_Camera = gf.Transform_Camera;
import Transform_Locate = gf.Transform_Locate;
import Transform_Orient = gf.Transform_Orient;
import Transform_OrientForCamera = gf.Transform_OrientForCamera;
import Transform_Perspective = gf.Transform_Perspective;
import Transform_Translate = gf.Transform_Translate;
import Transform_TranslateInvert = gf.Transform_TranslateInvert;
import Transformable = gf.Transformable;
import TransformableBase = gf.TransformableBase;
import Transforms = gf.Transforms;

// Input.

import ActionToInputsMapping = gf.ActionToInputsMapping;
import Input = gf.Input;
import InputHelper = gf.InputHelper;

// Media.

import Font = gf.Font;
import FontNameAndHeight = gf.FontNameAndHeight;
import Image2 = gf.Image2;
import MediaLibrary = gf.MediaLibrary;
import Sound = gf.Sound;
import SoundFromFile = gf.SoundFromFile;
import SoundHelper = gf.SoundHelper;
import SoundHelperLive = gf.SoundHelperLive;
import TextString = gf.TextString;
import TextStringFromImage = gf.TextStringFromImage;
import VenueVideo = gf.VenueVideo;
import Video = gf.Video;
import VideoHelper = gf.VideoHelper;
import VisualSound = gf.VisualSound;

// Model.

import Entity = gf.Entity;
import EntityBuilder = gf.EntityBuilder;
import EntityPropertyBase = gf.EntityPropertyBase;
import Namable = gf.Namable;
import Place = gf.Place;
import PlaceBase = gf.PlaceBase;
import PlaceDefn = gf.PlaceDefn;
import Universe = gf.Universe;
import UniverseWorldPlaceEntities = gf.UniverseWorldPlaceEntities;
import Venue = gf.Venue;
import VenueDrawnOnlyWhenUpdated = gf.VenueDrawnOnlyWhenUpdated;
import VenueWorld = gf.VenueWorld;
import World = gf.World;
import WorldCreator = gf.WorldCreator;
import WorldDefn = gf.WorldDefn;

// Model - Actors.

import Action = gf.Action;
import Activity = gf.Activity;
import ActivityDefn = gf.ActivityDefn;
import Actor = gf.Actor;

// Model - Combat.

import Killable = gf.Killable;

// Model - Items.

import Item = gf.Item;
import ItemDefn = gf.ItemDefn;
import ItemCategory = gf.ItemCategory;
import ItemHolder = gf.ItemHolder;

// Model - Physics.

import Constrainable = gf.Constrainable;
import Constraint = gf.Constraint;
import Locatable = gf.Locatable;
import Movable = gf.Movable;

// Model - Talk.

import ConversationDefn = gf.ConversationDefn;
import ConversationRun = gf.ConversationRun;
import ConversationScope = gf.ConversationScope;
import TalkNode = gf.TalkNode;
import TalkNodeDefn = gf.TalkNodeDefn;
import Talker = gf.Talker;

// Profiles.

import Profile = gf.Profile;
import SaveStateBase = gf.SaveStateBase;
import SaveStateWorld = gf.SaveStateWorld;

// Storage.

import FileHelper = gf.FileHelper;
import Serializer = gf.Serializer;
import StorageHelper = gf.StorageHelper;
import VenueFileUpload = gf.VenueFileUpload;

// Storage - Compressor.

import BitStream = gf.BitStream;
import ByteStreamFromString = gf.ByteStreamFromString;
import CompressorLZW = gf.CompressorLZW;

// Tests.

import Assert = gf.Assert;
import TestFixture = gf.TestFixture;
import TestSuite = gf.TestSuite;

// Utility.

import DateTime = gf.DateTime;
import IDHelper = gf.IDHelper;
import PlatformHelper = gf.PlatformHelper;
import RandomizerSystem = gf.RandomizerSystem;
import Reference = gf.Reference;
import Stack = gf.Stack;
import TimerHelper = gf.TimerHelper;
import URLParser = gf.URLParser;
import ValueBreak = gf.ValueBreak;
import ValueBreakGroup = gf.ValueBreakGroup;
import VenueTask = gf.VenueTask;