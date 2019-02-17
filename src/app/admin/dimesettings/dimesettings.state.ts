import { DimeSetting, DimeSettingObject } from '../../../../shared/model/dime/settings';
import { JSONDeepCopy } from '../../../../shared/utilities/utilityFunctions';

export interface State {
	items: DimeSettingObject,
	isLoaded: boolean
}

const baseState: State = {
	items: {
		emailserver: <DimeSetting>{ name: 'emailserver', host: '', port: 25 },
		systemadmin: <DimeSetting>{ name: 'systemadmin', emailaddress: '' }
	},
	isLoaded: false
};

export const initialState = (): State => JSONDeepCopy( baseState );
