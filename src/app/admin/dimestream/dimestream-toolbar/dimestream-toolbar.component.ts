import { Component, OnInit } from '@angular/core';
import { DimeStreamService } from '../dimestream.service';
import { DimeTagService } from '../../dimetag/dimetag.service';
import { DimeUIService } from '../../../ngstore/uistate.service';


@Component( {
	selector: 'app-dimestream-toolbar',
	templateUrl: './dimestream-toolbar.component.html',
	styleUrls: ['./dimestream-toolbar.component.css']
} )
export class DimeStreamToolbarComponent implements OnInit {

	constructor(
		public mainService: DimeStreamService,
		public tagService: DimeTagService,
		public uiService: DimeUIService
	) { }

	ngOnInit() {
	}
}
