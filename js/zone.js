function Zone(name, x, y, width, height) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.mediaStates = [];
}


Zone.prototype.GetMediaStates = function () {
    return this.mediaStates;
}

