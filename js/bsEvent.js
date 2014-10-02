// BSEvent
function BSEvent(name, value, parameter, iconUrl, iconSelectedUrl) {
    this.name = name;
    this.value = value;
    this.parameter = parameter;
    this.iconUrl = iconUrl;
    this.iconSelectedUrl = iconSelectedUrl;

    this.icon = new Image();
    this.icon.src = this.iconUrl;
    this.icon.onload = function () {
        console.log("BSEvent icon loaded");
    }

    this.iconSelected = new Image();
    this.iconSelected.src = this.iconSelectedUrl;
    this.iconSelected.onload = function () {
        console.log("BSEvent iconSelected loaded");
    }
}

BSEvent.prototype.Clone = function () {

    bsEvent = new BSEvent(this.name, this.value, this.parameter, this.iconUrl, this.iconSelectedUrl);
    return bsEvent;
}


