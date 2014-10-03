// TransitionView
function TransitionView(transition, sourceThumb, bsEvent, targetThumb) {
    this.transition = transition;
    this.sourceThumb = sourceThumb;
    this.bsEvent = bsEvent;
    this.targetThumb = targetThumb;

    this._imgIcon = bsEvent.icon;
    this._imgIconSelected = bsEvent.iconSelected;

    this.selected = false;
}

TransitionView.prototype.CreateGraphics = function () {

    sourceThumbPosition = this.sourceThumb.GetCurrentPosition();

    var sourceRect = {
        X: sourceThumbPosition.x,
        Y: sourceThumbPosition.y,
        Width: thumbWidth,
        Height: thumbHeight
    };

    xSourceCenter = sourceRect.X + (sourceRect.Width / 2);
    xSourceRight = sourceRect.X + sourceRect.Width;
    ySourceTop = sourceRect.Y;
    ySourceBottom = ySourceTop + sourceRect.Height;
    ySourceMiddle = (ySourceTop + ySourceBottom) / 2;

    targetThumbPosition = this.targetThumb.GetCurrentPosition();

    if (this.targetThumb != null) {
        var destinationRect = {
            X: targetThumbPosition.x,
            Y: targetThumbPosition.y,
            Width: thumbWidth,
            Height: thumbHeight
        };

        xDestinationCenter = destinationRect.X + (destinationRect.Width / 2);
        yDestinationTop = destinationRect.Y;
        yDestinationBottom = yDestinationTop + destinationRect.Height;
        yDestinationMiddle = (yDestinationTop + yDestinationBottom) / 2;

        this.CreateLine(xSourceCenter, xDestinationCenter, ySourceBottom, yDestinationTop);

        this.CreateEventImage((xSourceCenter + xDestinationCenter) / 2, (ySourceBottom + yDestinationTop) / 2);
    }
}

TransitionView.prototype.SetImage = function () {
    //imageResourcesNames = this.bsEvent.GetIconResourceNames();
    //this._imgIcon.src = imageResourcesNames.imageResourceName;
    //this._imgIconSelected.src = imageResourcesNames.imageResourceSelectedName;
}

TransitionView.prototype.EraseGraphics = function () {
    this.kimage.destroy();
    this.kline.destroy();
    this.kcircle.destroy();
}

TransitionView.prototype.CreateEventImage = function (x, y) {
    this.SetImage();
    this._image = this._imgIcon;
    x = this.CorrectXPosition(x);
    y = this.CorrectYPosition(y);
    this.kimage = new Kinetic.Image({
        x: x,
        y: y,
        image: this._image,
    });
    this.kimage.transitionView = this;

    this.kimage.on('click', function (e) {
        console.log("event selected");
        this.transitionView.Select();
        e.cancelBubble = true;
    });

    this.kimage.on('dblclick', function () {

        console.log("double click");

        var bsEvent = this.transitionView.bsEvent;

        if (bsEvent.name == "timeout") {

            $('#btnTimeoutEventDlgOK').click(function () {
                console.log("save changes clicked");
                var timeoutInSeconds = $('#txtTimeout')[0].value;
                if (timeoutInSeconds == "") {
                    timeoutInSeconds = $('#txtTimeout')[0].placeholder;
                }
                bsEvent.parameter = timeoutInSeconds;
                console.log("timeout in seconds = " + timeoutInSeconds);
                $('#timeoutEventDlg').modal('hide');
            })

            $('#txtTimeout')[0].value = bsEvent.parameter;
            $('#timeoutEventDlg').modal();
        }
    });

    interactiveLayer.add(this.kimage);
    stage.draw();
}

TransitionView.prototype.CreateLine = function (xSourceCenter, xDestinationCenter, ySourceBottom, yDestinationTop) {
    this.kline = new Kinetic.Line({
        points: [xSourceCenter, ySourceBottom, xDestinationCenter, yDestinationTop],
        stroke: "black"
    });
    interactiveLayer.add(this.kline);

    this.kcircle = new Kinetic.Circle({
        x: xDestinationCenter,
        y: yDestinationTop - 2,
        radius: 4,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 1
    });
    interactiveLayer.add(this.kcircle);

    stage.draw();
}

TransitionView.prototype.CorrectXPosition = function (x) {
    return x -= 24 / 2; // 24 is iconWidth
}

TransitionView.prototype.CorrectYPosition = function (y) {
    return y -= 24 / 2; // 24 is iconHeight
}

TransitionView.prototype.ShowSelectionState = function () {
    if (this.selected) {
        this._image = this._imgIconSelected;
    }
    else {
        this._image = this._imgIcon;
    }
    this.kimage.setImage(this._image);
    stage.draw();
}

TransitionView.prototype.Select = function () {
    interactiveLayer.zoneView.DeselectMediaStates();
    interactiveLayer.zoneView.DeselectTransitions();
    this.selected = true;
    this.ShowSelectionState();
}

TransitionView.prototype.Deselect = function () {
    this.selected = false;
    this.ShowSelectionState();
}

