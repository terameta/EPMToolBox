import { Component, OnInit } from '@angular/core';

import { AcmServerService } from '../acmserver.service';

@Component({
	selector: 'app-acmserver-toolbar',
	templateUrl: './acmserver-toolbar.component.html',
	styleUrls: ['./acmserver-toolbar.component.css']
})
export class AcmServerToolbarComponent implements OnInit {

	constructor(private mainService: AcmServerService) { }

	ngOnInit() {
	}

}
