import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

@Component( {
	selector: 'app-welcomedashboard',
	templateUrl: './welcomedashboard.component.html',
	styleUrls: ['./welcomedashboard.component.css']
} )
export class WelcomedashboardComponent implements OnInit {
	curUserRole: string;

	constructor(
		public authService: AuthService,
		private router: Router
	) {
		this.curUserRole = this.authService.getCurrentUser().role;
		if ( this.curUserRole === 'user' ) {
			this.router.navigate( ['/enduser'] );
		}
	}

	ngOnInit() {
	}

}
