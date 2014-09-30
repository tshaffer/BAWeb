function Thumb(name, url, x, y, dragRect, thumbLoaded, thumbDrawn) {
    this.name = name;
    this.url = url;
    this.x = x;
    this.y = y;
    this.dragRect = dragRect;
    this.thumbLoaded = thumbLoaded;
    this.thumbDrawn = thumbDrawn;

    this.imageDrawn = false;

    this.image = new Image();
    this.image.src = url;
    this.image.thumb = this;

    this.image.onload = function () {
        this.thumb.ImageLoaded();
    }

    Thumb.prototype.ImageLoaded = function () {

        console.log("ImageLoaded invoked on thumb " + this.name);

        this.kgroup = new Kinetic.Group({
            x: this.x,
            y: this.y,
            width: thumbWidth,
            height: thumbHeight,
            draggable: true
        });
        this.kgroup.thumb = this;

        // background
        var rect = new Kinetic.Rect({
            x: 0,
            y: 0,
            width: thumbWidth,
            height: thumbHeight,
            shadowColor: "#808080",
            shadowBlur: 4,
            shadowOffset: 3,
            shadowOpacity: 0.5,
            fill: "white"
        });
        this.kgroup.add(rect);

        // background when selected
        this.kSelectedRect = new Kinetic.Rect({
            x: 1,
            y: 1,
            width: thumbWidth - 2,
            height: thumbHeight - 2,
            fill: "lightblue"
        });
        this.kgroup.add(this.kSelectedRect);
        this.kSelectedRect.hide();

        // border
        var rect = new Kinetic.Rect({
            x: 0,
            y: 0,
            width: thumbWidth,
            height: thumbHeight,
            stroke: "#CBCBCB",
            strokeWidth: 1
        });
        this.kgroup.add(rect);

        // bound drag
        this.kgroup.setDragBoundFunc(
            // 'this' is the kgroup
            function (pos) {
                x = pos.x;
                y = pos.y;
                dragRect = this.thumb.dragRect;
                if (pos.x < dragRect.xMin) {
                    x = dragRect.xMin;
                }
                else if (pos.x > dragRect.xMax) {
                    x = dragRect.xMax;
                }
                if (pos.y < dragRect.yMin) {
                    y = dragRect.yMin;
                }
                else if (pos.y > dragRect.yMax) {
                    y = dragRect.yMax;
                }
                return {
                    x: x,
                    y: y
                }
            });

        // thumbnail
        this.kimage = new Kinetic.Image({
            x: thumbWidth / 2 - (this.image.width / 2),
            y: thumbHeightNoText / 2 - (this.image.height / 2),
            image: this.image,
        });
        this.kgroup.add(this.kimage);

        this.kimage.thumb = this;

        // state name
        this.ktext = new Kinetic.Text({
            y: thumbHeightNoText - 5,
            text: this.name,
            fontSize: 15,
            fontFamily: 'Calibri',
            fill: '#555',
            width: thumbWidth,
            align: 'center'
        });
        this.kgroup.add(this.ktext);
        this.ktext.thumb = this;

        // generic event handlers
        //this.kgroup.on('mouseover', function () {
        //    document.body.style.cursor = 'pointer';
        //});
        //this.kgroup.on('mouseout', function () {
        //    document.body.style.cursor = 'default';
        //});
        this.ktext.on('mouseover', function () {
            document.body.style.cursor = 'pointer';
        });
        this.ktext.on('mouseout', function () {
            document.body.style.cursor = 'default';
        });

        // callback
        this.thumbLoaded();

        stage.draw();

        this.imageDrawn = true;

        if (this.thumbDrawn != null) {
            this.thumbDrawn();
        }
    }

}

Thumb.prototype.GetCurrentPosition = function () {
    if (this.kgroup == undefined) {
        console.log("kgroup is undefined for " + this.name);
    }
    return this.kgroup.getPosition();
}

// MediaStateThumb
function MediaStateThumb(name, url, x, y, mediaState, thumbDrawn) {
    Thumb.call(this, name, url, x, y, mediaStateDragRect, this.ThumbLoadComplete, thumbDrawn); //call super constructor.
    this.transitionViewsIn = new Array();
    this.transitionViewsOut = new Array();
    this.mediaState = mediaState;
    this.selected = false;
}

//subclass extends superclass
MediaStateThumb.prototype = Object.create(Thumb.prototype);
MediaStateThumb.prototype.constructor = MediaStateThumb;

MediaStateThumb.prototype.ThumbLoadComplete = function () {

    this.ktext.on('mousedown', function (e) {
        if (this.thumb.mediaState != null) {
            //StartTransitionDrag(this.thumb.mediaState)
            zoneView.StartTransitionDrag(this.thumb);
            this.thumb.kgroup.setDraggable(false);
            mouseDown = true;
        }
    });

    this.kgroup.on('mouseup', function (e) {
        zoneView.MouseUp(e);
    });
    this.ktext.on('mouseup', function (e) {
        zoneView.MouseUp(e);
    });
    this.kimage.on('mouseup', function (e) {
        zoneView.MouseUp(e);
    });

    this.kgroup.on('dragstart', function () {
        // 'this' is the kgroup
        this.thumb.EraseTransitionGraphics();
        stage.draw();
    });

    this.kgroup.on('dragend', function () {
        // 'this' is the kgroup
        this.thumb.RedrawTransitionGraphics();
        this.thumb.mediaState.SetCurrentPosition(this.thumb.GetCurrentPosition());
        //  refresh display
        stage.draw();
    });

    this.kgroup.on('dblclick', function () {
        console.log("double click");
        //dialog.dialog("open");
    });

    this.kgroup.on('click tap', function (evt) {
        console.log("kgroup click");
        this.thumb.MouseDown();
        evt.cancelBubble = true;
    });

    interactiveLayer.add(this.kgroup);

};

MediaStateThumb.prototype.MouseDown = function () {
    if (_modifierCtrlKeyDown) {
        this.ToggleSelectionState();
    }
    else if (!this.selected) {
        zoneView.SelectThumb(this);
    }
}

MediaStateThumb.prototype.ToggleSelectionState = function () {
    this.selected = !this.selected;
    this.ShowSelectionState();
}

MediaStateThumb.prototype.Select = function () {
    this.selected = true;
    this.ShowSelectionState();
}

MediaStateThumb.prototype.Deselect = function () {
    this.selected = false;
    this.ShowSelectionState();
}

MediaStateThumb.prototype.ShowSelectionState = function () {
    if (this.selected) {
        this.kSelectedRect.show();
    }
    else {
        this.kSelectedRect.hide();
    }
    stage.draw();
}

MediaStateThumb.prototype.RestoreDraggability = function () {
    this.kgroup.setDraggable(true);
}

MediaStateThumb.prototype.AddTransitionViewIn = function (transitionView) {
    this.transitionViewsIn.push(transitionView);
}

MediaStateThumb.prototype.AddTransitionViewOut = function (transitionView) {
    this.transitionViewsOut.push(transitionView);
}

MediaStateThumb.prototype.RedrawTransitionGraphics = function () {
    this.transitionViewsIn.forEach(function (transitionView) {
        transitionView.CreateGraphics();
    });

    this.transitionViewsOut.forEach(function (transitionView) {
        transitionView.CreateGraphics();
    });
}

MediaStateThumb.prototype.EraseTransitionGraphics = function () {
    this.transitionViewsIn.forEach(function (transitionView) {
        transitionView.EraseGraphics();
    });

    this.transitionViewsOut.forEach(function (transitionView) {
        transitionView.EraseGraphics();
    });
}

// MediaLibraryThumb
function MediaLibraryThumb(name, url, x, y) {
    Thumb.call(this, name, url, x, y, mediaLibaryItemDragRect, this.ThumbLoadComplete); //call super constructor.
}

//subclass extends superclass
MediaLibraryThumb.prototype = Object.create(Thumb.prototype);
MediaLibraryThumb.prototype.constructor = MediaLibraryThumb;

MediaLibraryThumb.prototype.ThumbLoadComplete = function () {

    this.kgroup.on('dragstart', function () {
        // 'this' is the kgroup
        this.thumb.anchorGroup = this.clone();
        this.thumb.anchorGroup.setPosition(this.thumb.x, this.thumb.y);
        mediaLibraryLayer.add(this.thumb.anchorGroup);
        stage.draw();
    });

    this.kgroup.on('dragend', function () {
        // 'this' is the kgroup
        if (this.getPosition().x > mediaLibraryWidth) {
            //  create new playlist item at dragged location
            var playlistItem = new ImagePlaylistItem(this.thumb.name, this.thumb.url);
            newMediaState = new MediaState(this.thumb.name, playlistItem, this.getPosition().x - mediaLibraryWidth, this.getPosition().y);
            mediaStates.push(newMediaState);
            zoneView.AddMediaState(newMediaState);
        }
        //  move original (a media library item) back to original position
        this.setPosition(this.thumb.x, this.thumb.y);
        //  delete anchorGroup
        this.thumb.anchorGroup.destroy();
        //  refresh display
        stage.draw();
    });

    mediaLibraryLayer.add(this.kgroup);
};

