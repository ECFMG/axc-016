import { spawn } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const apiDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const bundle = join(apiDir, 'deploy/dist/index.js');
if (!existsSync(bundle)) {
	console.error('Built API bundle is missing. Run pnpm run build before pnpm run start.');
	process.exit(1);
}

process.env.AXC_ENVIRONMENT ??= 'local';
const port = process.env.PORT ?? '7071';
writeFileSync(
	join(apiDir, 'deploy/local.settings.json'),
	`${JSON.stringify(
		{
			IsEncrypted: false,
			Values: {
				FUNCTIONS_WORKER_RUNTIME: 'node',
				AzureWebJobsFeatureFlags: 'EnableWorkerIndexing',
				AXC_ENVIRONMENT: process.env.AXC_ENVIRONMENT,
			},
		},
		null,
		2,
	)}\n`,
);

console.log(`Azure Functions host starting built API at http://127.0.0.1:${port}/health`);
const child = spawn('func', ['start', '--script-root', 'deploy/', '--port', port, '--cors', '*'], {
	cwd: apiDir,
	stdio: 'inherit',
	env: process.env,
	detached: process.platform !== 'win32',
});

const stop = (signal) => {
	if (child.pid && process.platform !== 'win32') {
		try {
			process.kill(-child.pid, signal);
			return;
		} catch {
			// The process group is already gone.
		}
	}
	child.kill(signal);
};
process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));
child.on('exit', (code) => {
	process.exit(code ?? 0);
});
