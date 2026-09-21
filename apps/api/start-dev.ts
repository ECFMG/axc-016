import { AzureFunctionsDevRunner } from '@cellix/local-dev';

process.env['AXC_ENVIRONMENT'] ??= 'local';

new AzureFunctionsDevRunner({
	typescript: false,
	scriptRoot: 'deploy/',
	localSettings: {
		values: {
			FUNCTIONS_WORKER_RUNTIME: 'node',
			AzureWebJobsFeatureFlags: 'EnableWorkerIndexing',
			AXC_ENVIRONMENT: process.env['AXC_ENVIRONMENT'] ?? 'local',
		},
	},
}).start();
