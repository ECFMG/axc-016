import { registerManagedSerenityWorld, registerWorldLifecycleHooks } from '@cellix/serenity-framework/cucumber';
import { SerenityCast } from '@cellix/serenity-framework/serenity';
import { infrastructure } from './infrastructure.ts';

export const ApiAcceptanceWorld = registerManagedSerenityWorld({
	infrastructure,
	validateState: (state) => {
		if (!state.baseUrl) {
			throw new Error('API acceptance infrastructure did not expose a base URL');
		}
	},
	createCast: () => new SerenityCast({ useNotepad: true }),
});

registerWorldLifecycleHooks({
	scenarioTimeout: 60_000,
	beforeTimeout: 60_000,
	afterTimeout: 30_000,
	before: async (world) => {
		await (world as InstanceType<typeof ApiAcceptanceWorld>).init();
	},
	after: async (world) => {
		await (world as InstanceType<typeof ApiAcceptanceWorld>).cleanup();
	},
	afterAll: async () => {
		await infrastructure.stopAll();
	},
});
