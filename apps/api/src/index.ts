import { createHealthServices, type HealthEnvironment, type HealthServices, resolveHealthEnvironment } from '@axc/application-services';
import { restHandlerCreator } from '@axc/rest';
import { Cellix } from '@cellix/api-core';

Cellix.initializeInfrastructureServices<{ environment: HealthEnvironment }, HealthServices>(() => {
	// Health does not start infrastructure. Register future Mongoose services here.
})
	.setContext(() => ({ environment: resolveHealthEnvironment(process.env) }))
	.initializeApplicationServices((context) => ({
		forRequest: () => Promise.resolve(createHealthServices(context.environment)),
	}))
	.registerAzureFunctionHttpHandler(
		'http',
		{
			authLevel: 'anonymous',
			methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
			route: '{*segments}',
		},
		restHandlerCreator,
	)
	.startUp();
