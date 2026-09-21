import type { HealthStatus } from '@axc/application-services';
import type { HttpHandler } from '@azure/functions';
import type { AppHost } from '@cellix/api-core';
import { azureHonoHandler } from '@marplex/hono-azurefunc-adapter';
import { Hono } from 'hono';

export interface HealthServices {
	health: () => HealthStatus;
}

export function createRestApp(getHealth: () => HealthStatus | Promise<HealthStatus>): Hono {
	const app = new Hono();
	app.get('/health', async (context) => context.json(await getHealth()));
	return app;
}

export function restHandlerCreator(host: AppHost<HealthServices>): HttpHandler {
	const app = createRestApp(async () => {
		const services = await host.forRequest();
		return services.health();
	});
	return azureHonoHandler((request) => app.fetch(request));
}
