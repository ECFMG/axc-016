import { mkdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ProcessTestServer } from '@cellix/serenity-framework';

const apiDirectory = join(dirname(fileURLToPath(import.meta.url)), '../../../../apps/api');

let port = 0;
let server: ProcessTestServer | undefined;

export const infrastructure = {
	async ensureStarted(): Promise<void> {
		if (server?.isRunning()) {
			return;
		}
		port = await reservePort();
		const deployDir = join(apiDirectory, 'deploy');
		mkdirSync(deployDir, { recursive: true });
		writeFileSync(
			join(deployDir, 'local.settings.json'),
			`${JSON.stringify(
				{
					IsEncrypted: false,
					Values: {
						FUNCTIONS_WORKER_RUNTIME: 'node',
						AzureWebJobsFeatureFlags: 'EnableWorkerIndexing',
						AXC_ENVIRONMENT: 'test',
					},
				},
				null,
				2,
			)}\n`,
		);
		const healthUrl = `http://127.0.0.1:${port}/health`;
		server = new ProcessTestServer({
			serverName: 'agentCourses Azure Functions',
			executable: 'func',
			spawnArgs: ['start', '--script-root', 'deploy/', '--port', String(port), '--cors', '*'],
			cwd: apiDirectory,
			readyMarker: /Functions:/,
			url: healthUrl,
			startupTimeoutMs: 120_000,
		});
		await server.start();
		await waitForHealth(healthUrl);
	},
	getState(): { baseUrl: string } {
		return { baseUrl: `http://127.0.0.1:${port}` };
	},
	async stopAll(): Promise<void> {
		await server?.stop();
		server = undefined;
	},
};

async function waitForHealth(url: string): Promise<void> {
	const deadline = Date.now() + 30_000;
	let lastError: unknown;
	while (Date.now() < deadline) {
		try {
			const response = await fetch(url);
			if (response.ok) {
				return;
			}
			lastError = new Error(`GET ${url} returned ${response.status}`);
		} catch (error) {
			lastError = error;
		}
		await new Promise((resolve) => setTimeout(resolve, 250));
	}
	throw new Error(`Azure Functions host did not serve ${url}`, { cause: lastError });
}

function reservePort(): Promise<number> {
	return new Promise((resolve, reject) => {
		const probe = createServer();
		probe.once('error', reject);
		probe.listen(0, '127.0.0.1', () => {
			const address = probe.address();
			if (address === null || typeof address === 'string') {
				probe.close();
				reject(new Error('Could not reserve a port'));
				return;
			}
			const reserved = address.port;
			probe.close((error) => {
				if (error) {
					reject(error);
				} else {
					resolve(reserved);
				}
			});
		});
	});
}
