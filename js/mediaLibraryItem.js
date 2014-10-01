function MediaLibraryItem(name, playlistItem, x, y) {
    this.name = name;
    this.playlistItem = playlistItem;
    this.x = x;
    this.y = y;

    this.thumb = new MediaLibraryThumb(name, playlistItem.url, x, y);
}

MediaLibraryItem.prototype.EraseThumb = function () {
    this.thumb.Erase();
}


