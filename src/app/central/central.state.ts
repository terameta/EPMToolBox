import { JSONDeepCopy } from '../../../shared/utilities/utilityFunctions';

export interface State {
	selectedTags: { [key: number]: string }
}

const baseState: State = {
	selectedTags: {}
};

export const initialState = (): State => JSONDeepCopy( baseState );
