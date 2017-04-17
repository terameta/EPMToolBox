enum Editor {
	MARVEL,
	DC
}

interface Hero {
	name: string;
	creationYear: number;
}

abstract class SuperHero implements Hero {
	private static readonly LABEL = 'Hero:';

	constructor(
		readonly name: string,
		protected _editor: Editor,
		public creationYear: number) {
			this.name = name;
	}

	public static createMessage(hero: SuperHero): string {
		return `${SuperHero.LABEL}: ${hero.name} ${hero._editor} ${hero.creationYear}`;
	}
}

interface CanFly {
	fly(message: string): void;
}



class FlyingHero extends SuperHero implements CanFly {
	public fly(message: string) {
		console.log(message + this.creationYear);
	}
}

const superman = new FlyingHero('Superman', Editor.DC, 1938);

superman.fly('Up, up and away!');

const batman: Hero = {
	name: 'Batman',
	creationYear: 1939
};
