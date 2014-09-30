// TransitionView
function TransitionView(sourceThumb, bsEvent, targetThumb) {
    this.sourceThumb = sourceThumb;
    this.bsEvent = bsEvent;
    this.targetThumb = targetThumb;

    this._imgIcon = bsEvent.icon;
    this._imgIconSelected = bsEvent.iconSelected;
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
    this.kimage.on('dblclick', function () {
        console.log("double click");
        timeOutEventDlg.dialog("open");
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


