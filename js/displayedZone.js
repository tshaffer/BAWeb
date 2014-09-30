function DisplayedZone(x, y, width, height) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.mouseDown = false;
    this.topLeftHandleDown = false;

    this.kgroup = new Kinetic.Group({
        x: x,
        y: y,
        width: width,
        height: height,
        draggable: true
    });
    this.kgroup.DisplayedZone = this;

    this.rect = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: width,
        height: height,
        stroke: "black",
        strokeWidth: 1,
        fill: "palegreen"
    });
    this.kgroup.add(this.rect);

    this.topLeftHandle = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: 8,
        height: 8,
        fill: "black"
    });
    this.kgroup.add(this.topLeftHandle);

    //this.kgroup.on('mousedown', function () {
    //    console.log("zone1 mousedown");
    //});

    this.kgroup.on('mouseup', function (e) {
        console.log("kgroup mouseup");
        this.DisplayedZone.HandleUp();
        e.cancelBubble = true;
    });

    this.kgroup.on('mousemove', function (e) {
        console.log("kgroup mousemove");
        this.DisplayedZone.HandleDrag();
        e.cancelBubble = true;
    });

    this.topLeftHandle.DisplayedZone = this;

    this.topLeftHandle.on('mousedown', function (e) {
        console.log("topLeftHandle mousedown");
        this.DisplayedZone.HandleDown();
        e.cancelBubble = true;
    });

    this.topLeftHandle.on('mouseup', function (e) {
        console.log("topLeftHandle mouseup");
        this.DisplayedZone.HandleUp();
        e.cancelBubble = true;
    });

    this.topLeftHandle.on('mousemove', function (e) {
        console.log("topLeftHandle mousemove");
        this.DisplayedZone.HandleDrag();
        e.cancelBubble = true;
    });

}

DisplayedZone.prototype.UpdateDisplay = function (zoneIsSelected) {
    if (zoneIsSelected) {
        this.topLeftHandle.show();
    }
    else {
        this.topLeftHandle.hide();
    }
}

DisplayedZone.prototype.HandleDown = function () {
    this.mouseDown = true;
    this.topLeftHandleDown = true;
    handleAnchor = ConvertToCanvasCoordinates(stage.getMousePosition());
    this.anchorXDelta = handleAnchor.x - this.kgroup.getPosition().x;
    this.anchorYDelta = handleAnchor.y - this.kgroup.getPosition().y;
}

DisplayedZone.prototype.HandleUp = function () {
    this.mouseDown = false;
    this.topLeftHandleDown = false;
}

DisplayedZone.prototype.MouseUp = function () {
    this.mouseDown = false;
    this.topLeftHandleDown = false;
}

DisplayedZone.prototype.HandleDrag = function () {
    if (this.mouseDown) {
        // hack - assume top left handle at the moment
        var pos = ConvertToCanvasCoordinates(stage.getMousePosition());

        width = this.kgroup.getWidth();
        height = this.kgroup.getHeight();

        currentPosition = this.kgroup.getPosition();
        widthDelta = pos.x - this.anchorXDelta - currentPosition.x;
        heightDelta = pos.y - this.anchorYDelta - currentPosition.y;

        this.kgroup.setPosition(pos.x - this.anchorXDelta, pos.y - this.anchorYDelta);
        this.kgroup.setSize(width - widthDelta, height - heightDelta);
        this.rect.setSize(width - widthDelta, height - heightDelta);

        stage.draw();
    }
}
