import { ActivatedRoute, Router } from '@angular/router';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { ToastrService } from 'ngx-toastr/toastr/toastr-service';
import { AuthHttp } from 'angular2-jwt';

import { DimeStreamService } from '../dimestream/dimestream.service';

import { DimeMatrix } from '../../../../../shared/model/dime/matrix';
import { DimeStream } from '../../../../../shared/model/dime/stream';
import { DimeStreamField } from '../../../../../shared/model/dime/streamfield';

@Injectable()
export class DimeMatrixService {
	private serviceName: string;
	private baseUrl: string;
	private headers = new Headers({ 'Content-Type': 'application/json' });

	private dataStore: { items: DimeMatrix[] };
	private _items: BehaviorSubject<DimeMatrix[]>;
	items: Observable<DimeMatrix[]>;
	itemCount: Observable<number>;
	curItem: DimeMatrix;
	curItemClean: boolean;
	curItemStream: DimeStream;
	curItemStreamFields: DimeStreamField[];

	constructor(
		private http: Http,
		private authHttp: AuthHttp,
		private toastr: ToastrService,
		private router: Router,
		private route: ActivatedRoute,
		private streamService: DimeStreamService
	) {
		this.baseUrl = '/api/dime/matrix';
		this.dataStore = { items: [] };
		this._items = <BehaviorSubject<DimeMatrix[]>>new BehaviorSubject([]);
		this.items = this._items.asObservable();
		this.itemCount = this.items.count();
		this.serviceName = 'Matrices';
		this.resetCurItem();
		this.getAll();
	}

	private resetCurItem = () => {
		this.curItem = { id: 0, name: '', stream: 0 };
		this.curItemClean = true;
		this.curItemStream = { id: 0, name: '', type: 0, environment: 0 };
	};

	getAll = () => {
		console.log('getting matrices');
		this.authHttp.get(this.baseUrl).
			map((response) => {
				return response.json();
			}).
			subscribe((data) => {
				data.sort(this.sortByName);
				this.dataStore.items = data;
				this._items.next(Object.assign({}, this.dataStore).items);
			}, (error) => {
				this.toastr.error('Could not load items.', this.serviceName);
			});
	};
	getOne = (id: number) => {
		this.authHttp.get(this.baseUrl + '/' + id).
			map(response => response.json()).
			subscribe((result) => {
				let notFound = true;

				this.dataStore.items.forEach((item, index) => {
					if (item.id === result.id) {
						this.dataStore.items[index] = result;
						notFound = false;
					}
				});

				if (notFound) {
					this.dataStore.items.push(result);
				}

				this.dataStore.items.sort(this.sortByName);
				this._items.next(Object.assign({}, this.dataStore).items);
				this.curItem = result;
				this.curItemClean = true;
				this.getStreamDefinition(this.curItem.stream);
			}, (error) => {
				this.toastr.error('Failed to get the item.', this.serviceName);
				console.log(error);
			});
	};
	private getStreamDefinition = (id: number) => {
		this.streamService.fetchOne(id).subscribe((result) => {
			this.curItemStream = result;
		}, (error) => {
			this.toastr.error('Failed to fetch stream definition.', this.serviceName);
			console.log(error);
		});
		this.streamService.retrieveFieldsFetch(id).subscribe((result) => {
			this.curItemStreamFields = result;
			// if (!this.curItemFields) { this.getFields(); }
		}, (error) => {
			this.toastr.error('Failed to fetch stream fields list.', this.serviceName);
			console.log(error);
		})
	};

	private sortByName = (e1, e2) => {
		if (e1.name > e2.name) {
			return 1;
		} else if (e1.name < e2.name) {
			return -1;
		} else {
			return 0;
		}
	};

}
