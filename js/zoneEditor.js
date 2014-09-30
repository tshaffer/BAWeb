function ZoneEditor() {
    this.displayedZones = [];
    this.selectedZone = null;
}

ZoneEditor.prototype.CreateDisplayedZone = function (zone) {
    displayedZone = new DisplayedZone(zone.x, zone.y, zone.width, zone.height);
    this.displayedZones.push(displayedZone);
}

ZoneEditor.prototype.AddZone = function (zone) {
    this.CreateDisplayedZone(zone);
    this.selectedZone = this.displayedZones[this.displayedZones.length - 1];
    zoneLayoutLayer.selectedZone = this.selectedZone;
    this.UpdateDisplay();
}

ZoneEditor.prototype.ShowZoneLayout = function (zoneList) {

    this.displayedZones.length = 0;
    zoneLayoutLayer.destroyChildren();
    rect = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: 1000 - mediaLibraryWidth,
        height: 600 - toolbarItemSize,
        fill: "#F3F3F3"
    });
    zoneLayoutLayer.add(rect);

    zoneEditor = this;
    zoneList.forEach(function (zone) {
        zoneEditor.CreateDisplayedZone(zone);
    });

    this.selectedZone = this.displayedZones[0];
    zoneLayoutLayer.selectedZone = this.selectedZone;

    this.UpdateDisplay();

    //zoneLayoutLayer.on('mouseup', function (e) {
    //    console.log("zoneLayoutLayer mouseup");
    //    this.selectedZone.MouseUp();
    //});

    //zoneLayoutLayer.on('mousemove', function (e) {
    //    console.log("zoneLayoutLayer mousemove");
    //    this.selectedZone.HandleDrag();
    //});

    //zoneLayoutLayer.add(selectedZone.kgroup);
    zoneLayoutLayer.show();

    stage.draw();
}

ZoneEditor.prototype.UpdateDisplay = function () {

    zoneEditor = this;
    this.displayedZones.forEach(function (displayedZone) {
        displayedZoneIsSelected = false;
        if (displayedZone === zoneEditor.selectedZone) {
            displayedZoneIsSelected = true;

            zoneLayoutLayer.on('mouseup', function (e) {
                console.log("zoneLayoutLayer mouseup");
                displayedZone.MouseUp();
            });

            zoneLayoutLayer.on('mousemove', function (e) {
                console.log("zoneLayoutLayer mousemove");
                displayedZone.HandleDrag();
            });

            zoneLayoutLayer.add(displayedZone.kgroup);
        }
        displayedZone.UpdateDisplay(displayedZoneIsSelected);
    });

    stage.draw();
}


