var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function registerOrmModel(model) {
    console.log('registering ORM models', model);
}
function Entity(tableName) {
    return (target) => {
        registerOrmModel(target);
    };
}
function Column(columnName) {
    return (target, propertyKey) => {
        console.log('Column Target:', target);
        console.log('=====');
        console.log('Column Prop Key:', propertyKey);
    };
}
let Todo = class Todo {
    constructor() {
        this.done = false;
    }
};
__decorate([
    Column('DESCR'),
    __metadata("design:type", String)
], Todo.prototype, "description", void 0);
Todo = __decorate([
    Entity('TODOS')
], Todo);
console.log('Deneme');
//# sourceMappingURL=decorators.js.map