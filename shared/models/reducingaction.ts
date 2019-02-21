import { Action } from '@ngrx/store';

export interface ReducingAction<T> extends Action {
	readonly feature: string,
	readonly type: string,
	reducer?( state: T ): T
}
