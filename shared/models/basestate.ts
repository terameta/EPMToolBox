import { ObjectMap } from './objectmap';

export interface BaseState<T> {
	items: ObjectMap<T>,
	ids: number[],
	loaded: boolean
}
