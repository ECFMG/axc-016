import { describe, expect, it } from 'vitest';
import { createRestApp } from './index.ts';

describe('GET /health', () => {
	it('returns the health payload from the injected application service', async () => {
		const app = createRestApp(() => ({
			status: 'ok',
			service: 'agentCourses-api',
			projectCode: 'axc',
			environment: 'test',
			timestamp: '2026-09-21T15:04:05.000Z',
		}));
		const response = await app.request('/health');
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({
			status: 'ok',
			service: 'agentCourses-api',
			projectCode: 'axc',
			environment: 'test',
			timestamp: '2026-09-21T15:04:05.000Z',
		});
	});
});
