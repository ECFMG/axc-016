import { describe, expect, it } from 'vitest';
import { buildHealthStatus, resolveHealthEnvironment } from './health-status.ts';

describe('buildHealthStatus', () => {
	it('builds the health contract from the supplied clock and environment', () => {
		const now = new Date('2026-09-21T15:04:05.000Z');
		expect(buildHealthStatus({ environment: 'local', now })).toEqual({
			status: 'ok',
			service: 'agentCourses-api',
			projectCode: 'axc',
			environment: 'local',
			timestamp: '2026-09-21T15:04:05.000Z',
		});
	});

	it('uses the current time when a clock is not supplied', () => {
		const before = Date.now();
		const status = buildHealthStatus({ environment: 'production' });
		const parsed = Date.parse(status.timestamp);
		expect(status.status).toBe('ok');
		expect(status.service).toBe('agentCourses-api');
		expect(status.projectCode).toBe('axc');
		expect(status.environment).toBe('production');
		expect(parsed).toBeGreaterThanOrEqual(before);
		expect(parsed).toBeLessThanOrEqual(Date.now());
	});
});

describe('resolveHealthEnvironment', () => {
	it('prefers an explicit local, test, or production mode', () => {
		expect(resolveHealthEnvironment({ AXC_ENVIRONMENT: 'test', NODE_ENV: 'production' })).toBe('test');
		expect(resolveHealthEnvironment({ AXC_ENVIRONMENT: 'local' })).toBe('local');
		expect(resolveHealthEnvironment({ AXC_ENVIRONMENT: 'production' })).toBe('production');
	});

	it('maps NODE_ENV when the explicit mode is absent or unknown', () => {
		expect(resolveHealthEnvironment({ NODE_ENV: 'production' })).toBe('production');
		expect(resolveHealthEnvironment({ NODE_ENV: 'test' })).toBe('test');
		expect(resolveHealthEnvironment({ AXC_ENVIRONMENT: 'staging', NODE_ENV: 'production' })).toBe('production');
		expect(resolveHealthEnvironment({})).toBe('local');
	});
});
