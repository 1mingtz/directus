import getLocalType from './get-local-type';
import { Column } from '@directus/schema/dist/types/column';
import { SchemaOverview } from '../types';

export default function getDefaultValue(
	column: SchemaOverview[string]['columns'][string] | Column
) {
	const type = getLocalType(column);

	let defaultValue = column.default_value || null;
	if (defaultValue === null) return null;

	// Check if the default is wrapped in an extra pair of quotes, this happens in SQLite
	if (
		typeof defaultValue === 'string' &&
		defaultValue.startsWith(`'`) &&
		defaultValue.endsWith(`'`)
	) {
		defaultValue = defaultValue.slice(1, -1);
	}

	switch (type) {
		case 'bigInteger':
		case 'integer':
		case 'decimal':
		case 'float':
			return Number(defaultValue);
		case 'boolean':
			return castToBoolean(defaultValue);
		default:
			return defaultValue;
	}
}

function castToBoolean(value: any): boolean {
	if (typeof value === 'boolean') return value;

	if (value === 0 || value === '0') return false;
	if (value === 1 || value === '1') return true;

	if (value === 'false' || value === false) return false;
	if (value === 'true' || value === true) return true;

	return Boolean(value);
}
