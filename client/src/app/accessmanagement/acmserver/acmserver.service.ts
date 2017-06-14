import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr/toastr/toastr-service';
import { AuthHttp } from 'angular2-jwt';
import { Headers, Http } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { AcmServer } from '../../../../../shared/model/accessmanagement/server';
import { Injectable } from '@angular/core';

@Injectable()
export class AcmServerService {
	items: Observable<AcmServer[]>;
	private _items: BehaviorSubject<AcmServer[]>;
	private baseUrl: string;
	private dataStore: { items: AcmServer[] };
	private headers = new Headers({ 'Content-Type': 'application/json' });
	private serviceName: string;

	curItem: AcmServer;
	curItemClean = true;

	constructor(
		private http: Http,
		private authHttp: AuthHttp,
		private toastr: ToastrService,
		private router: Router,
		private route: ActivatedRoute,
	) {
		this.baseUrl = '/api/accessmanagement/server';
		this.serviceName = 'Access Management Servers';
		this.dataStore = { items: [] };
		this._items = <BehaviorSubject<AcmServer[]>>new BehaviorSubject([]);
		this.items = this._items.asObservable();
		this.curItem = <AcmServer>{};

		this.getAll(true);
	}

	public getAll = (isSilent?: boolean) => {
		this.fetchAll().subscribe((data) => {
			this.dataStore.items = data;
			this._items.next(Object.assign({}, this.dataStore).items);
			if (!isSilent) { this.toastr.info('Items are loaded.', this.serviceName); }
		}, (error) => {
			this.toastr.error('Failed to get items from server.', this.serviceName);
			console.log(error);
		});
	};
	public fetchAll = () => {
		return this.authHttp.get(this.baseUrl).
			map(response => response.json()).
			catch(error => Observable.throw(error));
	}
	public create = () => {
		this.authHttp.post(this.baseUrl, {}, { headers: this.headers })
			.map(response => response.json()).subscribe(data => {
				this.dataStore.items.push(data);
				this._items.next(Object.assign({}, this.dataStore).items);
				this.resetCurItem();
				this.router.navigate(['/accessmanagement/servers/server-detail', data.id]);
				this.toastr.info('New item is created, navigating to the details', this.serviceName);
			}, (error) => {
				this.toastr.error('Failed to create new item.', this.serviceName);
				console.log(error);
			});
	};
	public getOne = (id: number) => {
		this.fetchOne(id).
			subscribe((data) => {
				let notFound = true;

				this.dataStore.items.forEach((item, index) => {
					if (item.id === data.id) {
						this.dataStore.items[index] = data;
						notFound = false;
					}
				});

				if (notFound) {
					this.dataStore.items.push(data);
				}

				this._items.next(Object.assign({}, this.dataStore).items);
				this.curItem = data;
				this.curItemClean = true;
			}, (error) => {
				this.toastr.error('Failed to get the item.', this.serviceName);
				console.log(error);
			});
	};
	public fetchOne = (id: number) => {
		return this.authHttp.get(this.baseUrl + '/' + id).
			map(response => response.json()).
			catch(error => Observable.throw(error));
	};
	public update = (curItem?: AcmServer) => {
		let shouldUpdate = false;
		if (!curItem) { curItem = this.curItem; shouldUpdate = true; };
		this.authHttp.put(this.baseUrl, curItem, { headers: this.headers }).
			map(response => response.json()).
			subscribe(data => {
				this.dataStore.items.forEach((item, index) => {
					if (item.id === data.id) { this.dataStore.items[index] = data; }
				});

				this._items.next(Object.assign({}, this.dataStore).items);
				this.toastr.info('Item is successfully saved.', this.serviceName);
				// If the update request came from another source, then it is an ad-hoc save of a non-current stream.
				// This shouldn't change the state of the current item.
				if (shouldUpdate) { this.curItemClean = true; }
			}, error => {
				this.toastr.error('Failed to save the item.', this.serviceName);
				console.log(error);
			});
	};
	public delete(id: number, name?: string) {
		const verificationQuestion = this.serviceName + ': Are you sure you want to delete ' + (name !== undefined ? name : 'the item') + '?';
		if (confirm(verificationQuestion)) {
			this.authHttp.delete(this.baseUrl + '/' + id).subscribe(response => {
				this.dataStore.items.forEach((item, index) => {
					if (item.id === id) { this.dataStore.items.splice(index, 1); }
				});

				this._items.next(Object.assign({}, this.dataStore).items);
				this.toastr.info('Item is deleted.', this.serviceName);
				this.router.navigate(['/accessmanagement/servers/server-list']);
				this.resetCurItem();
			}, (error) => {
				this.toastr.error('Failed to delete item.', this.serviceName);
				console.log(error);
			});
		} else {
			this.toastr.info('Item deletion is cancelled.', this.serviceName);
		}
	};

	private resetCurItem = () => {
		this.curItem = <AcmServer>{};
		this.curItemClean = true;
	};

}
