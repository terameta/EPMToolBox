import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { DimeStreamService } from '../dimestream.service';


@Component( {
	selector: 'app-dimestreams',
	templateUrl: './dimestreams.component.html',
	styleUrls: ['./dimestreams.component.css']
} )
export class DimeStreamsComponent implements OnInit {

	constructor(
		private dimeStreamService: DimeStreamService,
		private toastrService: ToastrService
	) { }

	ngOnInit() {
	}

}
