import { Component, OnInit } from '@angular/core';

import { AcmUserService } from '../acmuser.service';

@Component({
	selector: 'app-acmuser-list',
	templateUrl: './acmuser-list.component.html',
	styleUrls: ['./acmuser-list.component.css']
})
export class AcmUserListComponent implements OnInit {

	constructor(private mainService: AcmUserService) { }

	ngOnInit() {
	}

}
