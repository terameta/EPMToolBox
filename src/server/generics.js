class SuperCharacter {
    constructor(name) {
        this.name = name;
    }
}
class Hero extends SuperCharacter {
}
class Villain extends SuperCharacter {
}
class SuperTeam {
    constructor(members, leader) {
        this.members = members;
        this.leader = leader;
    }
}
const captainAmerica = new Hero('Captain America');
const thor = new Hero('Thor');
const ironMan = new Hero('IronMan');
const avengers = new SuperTeam([captainAmerica, thor, ironMan], captainAmerica);
const members = avengers.members;
const luthor = new Villain('Luthor');
const bizarro = new Villain('Bizarro');
const captainCold = new Villain('Captain Cold');
const legionOfDoom = new SuperTeam([luthor, bizarro, captainCold], luthor);
const villainMembers = legionOfDoom.members;
const megaCrossoverTeam = new SuperTeam([captainAmerica, thor, ironMan, luthor, bizarro, captainCold], captainAmerica);
const crossOverMembers = megaCrossoverTeam.members;
//# sourceMappingURL=generics.js.map