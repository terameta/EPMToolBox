"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buildPersonData_1 = require("./buildPersonData");
var message = "Hello World!";
var sayHello = function (message) {
    console.log(message);
};
var sayHello2 = function (message) { return console.log(message); };
sayHello(message);
sayHello2(message);
var Person = (function () {
    function Person(age) {
        var _this = this;
        this.age = age;
        this.growOld = function () { return _this.age++; };
    }
    ;
    return Person;
}());
var person = new Person(5);
setTimeout(person.growOld, 1000);
setTimeout(function () { return console.log("Person's age is " + person.age); }, 2000);
var personData = {
    firstName: 'Ali Rıza',
    lastName: 'Dikici',
    address: 'Motor City',
    phone: '+971555678522'
};
var firstName = "Ali", lastName = "Dikici";
var myPerson = { firstName: firstName, lastName: lastName };
var partialAddress = ["Dubai Motor City", "Fox Hill 1", "Apartment 406"];
var address = partialAddress.concat(["Dubai", "UAE"]);
var personDataResult = buildPersonData_1.buildPersonData(myPerson, partialAddress, address);
console.log(personDataResult);
//# sourceMappingURL=index.js.map