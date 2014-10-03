var _modifierShiftKeyDown = false;
var _modifierCtrlKeyDown = false;

var mediaLibraryXBorder = 20;
var mediaLibraryYBorder = 10;
var mediaLibraryIntraItemSpacing = 10;

//var thumbLength = 100;
var thumbLength = 80;
var thumbBorder = 5;
var thumbTextHeight = 15;
var thumbWidth = thumbLength + thumbBorder * 2;
var thumbHeightNoText = thumbLength + thumbBorder * 2;
var thumbHeight = thumbLength + thumbBorder * 2 + thumbTextHeight;

var mediaLibraryWidth = mediaLibraryXBorder * 2 + mediaLibraryIntraItemSpacing + thumbWidth * 2;

var toolbarIconSize = 36;
var toolbarItemSize = 44;

var stageWidth = 1500;
var stageHeight = 800;
var toolbarWidth = stageWidth - mediaLibraryWidth;
var canvasWidth = stageWidth - mediaLibraryWidth;
var canvasHeight = stageHeight - toolbarItemSize;

var mediaStateDragRect = {}
mediaStateDragRect.xMin = mediaLibraryWidth;
mediaStateDragRect.xMax = stageWidth - 1;
mediaStateDragRect.yMin = toolbarItemSize;
mediaStateDragRect.yMax = stageHeight - 1;

//var ZoneView = 0;

// temporary
var stage;
var interactiveLayer;
var mediaLibraryLayer;
var StartTransitionDrag;
var mediaStates;
var zoneView;
var ConvertToCanvasCoordinates;
var eventToolbar;
var bsEvents;
var timeOutEventDlg;
var zoneLayoutLayer;
