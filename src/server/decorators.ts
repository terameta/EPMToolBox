function registerOrmModel(model: Function) {
	console.log('registering ORM models', model);
}

function Entity(tableName: string) {
	return (target: Function) => {
		registerOrmModel(target);
	};
}


function Column(columnName: string) {
	return (target: any, propertyKey: string) => {
		console.log('Column Target:', target);
		console.log('=====');
		console.log('Column Prop Key:', propertyKey);
	};
}

@Entity('TODOS')
class Todo {

	@Column('DESCR')
	public description: string;
	public done = false;
}

console.log('Deneme');
