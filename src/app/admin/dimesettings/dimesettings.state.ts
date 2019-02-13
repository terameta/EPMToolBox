import { DimeSetting, DimeSettingObject } from '../../../../shared/model/dime/settings';

export interface SettingsState {
	items: DimeSettingObject,
	isLoaded: boolean
}

export const initialSettingsState: SettingsState = {
	items: {
		emailserver: <DimeSetting>{ name: 'emailserver', host: '', port: 25 },
		systemadmin: <DimeSetting>{ name: 'systemadmin', emailaddress: '' }
	},
	isLoaded: false
};
