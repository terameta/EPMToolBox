import {buildPersonData} from "./buildPersonData";

const message = "Hello World!";

const sayHello = (message) => {
	console.log(message);
};

const sayHello2 = message => console.log(message);

sayHello(message);

sayHello2(message);
/*
function Person(name){
	let that = this;
	this.name = name;
	this.greet = function(){
		setTimeout( function(){
			console.log("Hello my name is after 1000", that.name);
		}, 1000);

		setTimeout( () => {
			 console.log("Hello my name is after 2000", this.name);
		}, 2000);
	};
}

const person = new Person('Ali');
person.greet();
*/

class Person{
	constructor(public age:number){};
	growOld = () => this.age++;

}

var person = new Person(5);
setTimeout(person.growOld, 1000);
setTimeout( () => console.log(`Person's age is ${person.age}`), 2000 );



const personData = {
	firstName: 'Ali Rıza',
	lastName: 'Dikici',
	address: 'Motor City',
	phone: '+971555678522'
};

const firstName = "Ali", lastName = "Dikici";

const myPerson = { firstName, lastName };

const partialAddress = ["Dubai Motor City", "Fox Hill 1", "Apartment 406"];
const address = [...partialAddress, "Dubai", "UAE"];

const personDataResult = buildPersonData(myPerson, partialAddress, address);
console.log(personDataResult);