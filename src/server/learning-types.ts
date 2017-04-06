enum PlayerPosition {
	Guard,
	Forward,
	Center
}

type Player = [string, PlayerPosition];


let kobe: Player = ["Kobe", PlayerPosition.Guard];
let james: Player = ["James", PlayerPosition.Forward];
let shaq: Player = ["Shaq", PlayerPosition.Center];

let players: Player[] = [kobe, james, shaq];

console.log(players);
shaq = undefined;
console.log(PlayerPosition["Guard"]);
console.log(PlayerPosition[0]);
