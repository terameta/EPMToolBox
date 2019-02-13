import { Component, OnInit } from '@angular/core';

@Component( {
	selector: 'app-dimeschedules',
	templateUrl: './dimeschedules.component.html',
	styleUrls: ['./dimeschedules.component.css']
} )
export class DimeschedulesComponent implements OnInit {

	allowNewServer = false;
	serverCreationStatus = 'No server was created!';
	serverName = 'Default name';
	serverCreated = false;
	isServerOnline = false;

	servers = ['Dev Server', 'Test Server', 'Prod Server'];

	constructor() {
		setTimeout( () => {
			this.allowNewServer = true;
			this.isServerOnline = true;
		}, 5000 );
	}

	ngOnInit() {
	}

	onCreateServer() {
		this.serverCreated = true;
		this.servers.push( this.serverName );
		this.serverCreationStatus = 'Server was created! Server name is ' + this.serverName;
	}

	toggleServerActivity() {
		this.isServerOnline = !this.isServerOnline;
	}

	getServerActivityColor() {
		return this.isServerOnline === true ? 'green' : 'red';
	}

	onUpdateServerName( event: Event ) {
		this.serverName = ( <HTMLInputElement>event.target ).value;
	}

}
