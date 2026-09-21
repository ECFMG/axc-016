import { buildHealthStatus, type HealthEnvironment, type HealthStatus } from './health-status.ts';

export type { HealthEnvironment, HealthStatus } from './health-status.ts';
export { buildHealthStatus, healthProjectCode, healthServiceName, resolveHealthEnvironment } from './health-status.ts';

export interface HealthServices {
	health: () => HealthStatus;
}

export function createHealthServices(environment: HealthEnvironment): HealthServices {
	return {
		health: () => buildHealthStatus({ environment }),
	};
}
