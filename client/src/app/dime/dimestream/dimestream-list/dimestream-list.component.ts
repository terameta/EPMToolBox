import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { DimeStreamService } from '../dimestream.service';
import { DimeEnvironmentService } from '../../dimeenvironment/dimeenvironment.service';

@Component( {
	selector: 'app-dimestream-list',
	templateUrl: './dimestream-list.component.html',
	styleUrls: ['./dimestream-list.component.css']
} )
export class DimestreamListComponent implements OnInit {

	// streamList: any[];
	// streamTypeList: any[];
	// environmentList: any[];

	constructor(
		public mainService: DimeStreamService,
		private environmentService: DimeEnvironmentService,
		private toastr: ToastrService,
		// private router: Router
	) { }

	ngOnInit() {
		// this.environmentService.getAll();
		/*this.getAll();
		this.environmentService.getAll().subscribe(
			(curEnvList) => {
				this.environmentList = curEnvList;
				this.environmentList.sort(this.sortByName);
			}, (error) => {
				this.toastr.error(error);
			}
		);
		this.streamService.listTypes().subscribe(
			(typeList) => {
				this.streamTypeList = typeList;
			}, (error) => {
				this.toastr.error(error);
			}
		);*/
	}
	/*

		getAll() {
			this.streamService.getAll().subscribe(
				(streamList: any[]) => {
					this.streamList = streamList;
				}, (error) => {
					console.log(error);
					this.toastr.error(error);
				}
			)
		}

		streamDelete(streamID) {
			this.streamService.delete(streamID).subscribe(
				(result) => {
					this.toastr.info("Stream is now deleted. We are now going back to the stream list.");
					this.getAll();
				}, (error) => {
					this.toastr.error(error);
				}
			);
		}*/
}
