import { Component, OnInit } from '@angular/core';

import { DimeProcessService } from '../dimeprocess.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-dimeprocess-list',
	templateUrl: './dimeprocess-list.component.html',
	styleUrls: ['./dimeprocess-list.component.css']
})
export class DimeprocessListComponent implements OnInit {

	processList: any[] = [];

	constructor(
		private dimeProcessService: DimeProcessService,
		private toastrService: ToastrService
	) { }

	ngOnInit() {
		this.getAll();
		console.log('We are at app-dimeprocess-list');
	}

	getAll() {
		this.dimeProcessService.getAll().subscribe(
			(processList: any[]) => {
				this.processList = processList;
			},
			(error) => {
				this.toastrService.error(error);
			}
		);
	}

}
