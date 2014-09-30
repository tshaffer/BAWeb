function Sign(name) {
    this.name = name;
    this.zoneList = [];
}

//Sign.prototype.CreateZone = function (name) {
//    this.zoneList.push(new Zone(name));
//}

Sign.prototype.AddZone = function (zone) {
    this.zoneList.push(zone);
}

//Sign.prototype.toJSON = function () {
//    poop = JSON.stringify(this.zoneList);
//    return poop;
//}
