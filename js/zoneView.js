function ZoneView(zone) {
    this.zone = zone;
    this.mediaThumbs = [];

    this.creatingTransition = false;

    interactiveLayer.zoneView = this;

    interactiveLayer.on('click tap', function () {
        console.log("interactiveLayer - click/tap");
        zoneView.DeselectMediaStates();
        zoneView.DeselectTransitions();
    });

    interactiveLayer.on('mousemove', function (e) {
        zoneView.MouseMove(e);
    });

    interactiveLayer.on('mouseup', function (e) {
        zoneView.MouseUp(e);
    });
}

ZoneView.prototype.DisplayZone = function (mediaStates) {

    interactiveLayer.destroyChildren();
    rect = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasHeight,
        fill: "#F3F3F3"
    });
    interactiveLayer.add(rect);

    this.mediaThumbs.length = 0;

    var zoneView = this;

    mediaStatesToMediaThumbs = {}

    // draw the thumbs for the media states
    //debugger;
    mediaStates.forEach(function (mediaState) {
        thumb = new MediaStateThumb(mediaState.name, mediaState.playlistItem.url, mediaState.x, mediaState.y, mediaState, zoneView.ThumbDrawn);
        mediaStatesToMediaThumbs[mediaState.name] = thumb;
        zoneView.mediaThumbs.push(thumb);
    });

}

ZoneView.prototype.ThumbDrawn = function () {
    allThumbsDrawn = true;
    zoneView.mediaThumbs.forEach(function (thumb) {
        if (!thumb.imageDrawn) {
            allThumbsDrawn = false;
            return;
        }
    });

    // once all the thumbs have been loaded and drawn, proceed to draw the remaining display items

    if (allThumbsDrawn) {
        // draw the transitions for the media states
        mediaStates.forEach(function (mediaState) {
            mediaState.transitionsOut.forEach(function (transition) {
                sourceThumb = mediaStatesToMediaThumbs[transition.sourceMediaState.name];
                targetThumb = mediaStatesToMediaThumbs[transition.targetMediaState.name];
                transitionView = new TransitionView(transition, sourceThumb, transition.bsEvent, targetThumb);
                sourceThumb.AddTransitionViewOut(transitionView);
                targetThumb.AddTransitionViewIn(transitionView);
                zoneView.DrawEvent(transitionView);
            });
        });
    }
}

ZoneView.prototype.AddMediaState = function (mediaState) {
    thumb = new MediaStateThumb(mediaState.name, mediaState.playlistItem.url, mediaState.x, mediaState.y, mediaState);
    this.mediaThumbs.push(thumb);
}

ZoneView.prototype.SelectThumb = function (thumb) {
    var zoneView = this;
    this.mediaThumbs.forEach(function (mediaThumb) {
        if (thumb === mediaThumb) {
            mediaThumb.Select();
        }
        else
        {
            mediaThumb.Deselect();
        }
    });
}

ZoneView.prototype.DeselectMediaStates = function () {
    this.mediaThumbs.forEach(function (mediaThumb) {
        mediaThumb.Deselect();
    });
}

ZoneView.prototype.DeselectTransitions = function () {
    this.mediaThumbs.forEach(function (mediaThumb) {
        mediaThumb.DeselectTransitions();
    });
}

ZoneView.prototype.StartTransitionDrag = function (thumb) {

    this.sourceThumb = thumb;

    currentPosition = thumb.GetCurrentPosition();
    x0 = currentPosition.x + thumbWidth / 2;
    y0 = currentPosition.y + thumbHeight;

    pos = ConvertToCanvasCoordinates(stage.getMousePosition());

    this.transitionLine = new Kinetic.Line({
        points: [x0, y0, pos.x, pos.y],
        stroke: "black"
    });

    interactiveLayer.add(this.transitionLine);
    stage.draw();

    this.creatingTransition = true;
}

ZoneView.prototype.MouseMove = function (e) {
    if (this.creatingTransition) {
        pos = ConvertToCanvasCoordinates(stage.getMousePosition());
        this.transitionLine.getPoints()[1].x = pos.x;
        this.transitionLine.getPoints()[1].y = pos.y;
        stage.draw();
    }

    e.cancelBubble = true;
}

ZoneView.prototype.MouseUp = function (e) {

    mouseDown = false;

    if (this.creatingTransition) {
        this.transitionLine.destroy();
        this.sourceThumb.RestoreDraggability();
        stage.draw();
        this.creatingTransition = false;

        // determine if there is a state (that is not the source media state) at the current mouse position
        thumbUnderMouse = this.ThumbUnderMouse();

        // if there is, create a transition between the source media state and the media state under the mouse
        if (thumbUnderMouse != null && thumbUnderMouse != this.sourceThumb) {
            selectedEventName = eventToolbar.selectedToolbarItem.name;
            if (bsEvents[selectedEventName] != undefined) {
                bsEvent = bsEvents[selectedEventName];
                transition = new Transition(this.sourceThumb.mediaState, bsEvent, thumbUnderMouse.mediaState, this.sourceThumb.mediaState.name, thumbUnderMouse.mediaState.name);
                this.sourceThumb.mediaState.AddTransitionOut(transition);
                thumbUnderMouse.mediaState.AddTransitionIn(transition);
                transitionView = new TransitionView(transition, this.sourceThumb, bsEvent, thumbUnderMouse);
                this.sourceThumb.AddTransitionViewOut(transitionView);
                thumbUnderMouse.AddTransitionViewIn(transitionView);
                this.DrawEvent(transitionView);
            }
        }
    }

    // Cancelling the bubble here caused all drag events to fail
    //e.cancelBubble = true;
}

ZoneView.prototype.DrawEvent = function(transition) {
    transition.CreateGraphics();
}

ZoneView.prototype.ThumbUnderMouse = function() {

    canvasPosition = ConvertToCanvasCoordinates(stage.getMousePosition());

    selectedThumb = null;

    this.mediaThumbs.forEach(function (mediaThumb) {
        pos = mediaThumb.GetCurrentPosition();
        if ((canvasPosition.x >= pos.x) && (canvasPosition.x <= (pos.x + thumbWidth)) &&
             (canvasPosition.y >= pos.y) && (canvasPosition.y <= (pos.y + thumbWidth))) {
            selectedThumb = mediaThumb;
        }
    });

    return selectedThumb;
}

ZoneView.prototype.DeleteSelection = function () {
    this.DeleteSelectedMediaStates();
    this.DeleteSelectedTransition();
    stage.draw();
}

ZoneView.prototype.DeleteSelectedMediaStates = function () {

    var zone = this.zone;

    this.mediaThumbs.forEach(function (mediaThumb) {
        if (mediaThumb.selected) {
            var mediaState = mediaThumb.mediaState;
            console.log("delete media state " + mediaState.name);

            mediaThumb.Erase();

            zone.DeleteMediaState(mediaState);
        }
    });
}

ZoneView.prototype.DeleteSelectedTransition = function () {
    
    var zone = this.zone;

    // get the selected transition by going through each media thumb and seeing if one of its transitions is selected.
    this.mediaThumbs.forEach(function (mediaThumb) {

        transitionView = mediaThumb.GetSelectedTransition();
        if (transitionView != 0) {

// erase transition graphics, remove references to transitionView, then delete the actual transition view object

            // erase transition graphics
            transitionView.EraseGraphics();
            stage.draw();

            // remove transition view from source state's transitions out
            var sourceThumb = transitionView.sourceThumb;
            var transitionViewToDeleteIndex = sourceThumb.transitionViewsOut.indexOf(transitionView);
            if (transitionViewToDeleteIndex >= 0) {
                sourceThumb.transitionViewsOut.splice(transitionViewToDeleteIndex, 1);
            }

            // remove transition view from target state's transitions in
            var targetThumb = transitionView.targetThumb;
            var transitionViewToDeleteIndex = targetThumb.transitionViewsIn.indexOf(transitionView);
            if (transitionViewToDeleteIndex >= 0) {
                targetThumb.transitionViewsIn.splice(transitionViewToDeleteIndex, 1);
            }

            // delete actual transition view object
            var transition = transitionView.transition;
            delete transitionView;

// remove references to transition, then delete the actual transition object
            zone.DeleteTransition(transition);

            return;
        }
    });
}


