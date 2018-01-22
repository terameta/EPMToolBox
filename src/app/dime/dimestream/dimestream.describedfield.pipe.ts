import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'describedFieldFilter',
	pure: false
})
@Injectable()
export class DescribedFieldFilter implements PipeTransform {
	transform(fields: any[], args: any[]): any {
		if (!fields) { return []; }
		return fields.filter((curItem) => {
			return curItem.isDescribed === 1 || curItem.isDescribed === true;
		});
	}
}
