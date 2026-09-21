export const healthServiceName = 'agentCourses-api' as const;
export const healthProjectCode = 'axc' as const;

export type HealthEnvironment = 'local' | 'test' | 'production';

export interface HealthStatus {
	status: 'ok';
	service: typeof healthServiceName;
	projectCode: typeof healthProjectCode;
	environment: HealthEnvironment;
	timestamp: string;
}

const healthEnvironments = new Set<HealthEnvironment>(['local', 'test', 'production']);

export function resolveHealthEnvironment(env: Readonly<Record<string, string | undefined>>): HealthEnvironment {
	const explicit = env['AXC_ENVIRONMENT'];
	if (explicit !== undefined && healthEnvironments.has(explicit as HealthEnvironment)) {
		return explicit as HealthEnvironment;
	}
	if (env['NODE_ENV'] === 'production') {
		return 'production';
	}
	if (env['NODE_ENV'] === 'test') {
		return 'test';
	}
	return 'local';
}

export function buildHealthStatus(input: { environment: HealthEnvironment; now?: Date }): HealthStatus {
	const now = input.now ?? new Date();
	return {
		status: 'ok',
		service: healthServiceName,
		projectCode: healthProjectCode,
		environment: input.environment,
		timestamp: now.toISOString(),
	};
}
