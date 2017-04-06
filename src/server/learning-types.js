var PlayerPosition;
(function (PlayerPosition) {
    PlayerPosition[PlayerPosition["Guard"] = 0] = "Guard";
    PlayerPosition[PlayerPosition["Forward"] = 1] = "Forward";
    PlayerPosition[PlayerPosition["Center"] = 2] = "Center";
})(PlayerPosition || (PlayerPosition = {}));
var kobe = ["Kobe", PlayerPosition.Guard];
var james = ["James", PlayerPosition.Forward];
var shaq = ["Shaq", PlayerPosition.Center];
var players = [kobe, james, shaq];
console.log(players);
shaq = undefined;
console.log(PlayerPosition["Guard"]);
console.log(PlayerPosition[0]);
//# sourceMappingURL=learning-types.js.map