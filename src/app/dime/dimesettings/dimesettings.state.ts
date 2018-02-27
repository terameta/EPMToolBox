import { DimeSetting, DimeSettingObject } from '../../../../shared/model/dime/settings';

export interface DimeSettingsState {
	items: DimeSettingObject,
	isLoaded: boolean
}

export const dimeSettingsInitialState: DimeSettingsState = {
	items: {
		emailserver: <DimeSetting>{ name: 'emailserver', host: '', port: 25 },
		systemadmin: <DimeSetting>{ name: 'systemadmin', emailaddress: '' }
	},
	isLoaded: false
};
