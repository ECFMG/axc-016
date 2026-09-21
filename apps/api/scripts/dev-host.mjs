import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyWorktreeSuffix, buildPortlessUrl, PORTLESS_PORT } from '@cellix/local-dev/urls';

const apiDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(apiDir, '../..');
const worktreeName = process.env.WORKTREE_NAME || basename(repoRoot);
const hostname = applyWorktreeSuffix('api.agentcourses.localhost', worktreeName);
const publicHealthUrl = buildPortlessUrl(hostname, '/health');
const aliasName = hostname.endsWith('.localhost') ? hostname.slice(0, -'.localhost'.length) : hostname;

function reservePort() {
	return new Promise((resolve, reject) => {
		const server = createServer();
		server.unref();
		server.on('error', reject);
		server.listen(0, '127.0.0.1', () => {
			const address = server.address();
			if (address === null || typeof address === 'string') {
				server.close();
				reject(new Error('Could not reserve a local port for the Azure Functions host'));
				return;
			}
			const { port } = address;
			server.close((error) => (error ? reject(error) : resolve(port)));
		});
	});
}

function run(command, args, options = {}) {
	const result = spawnSync(command, args, { stdio: 'inherit', env: process.env, ...options });
	if ((result.status ?? 1) !== 0) {
		process.exit(result.status ?? 1);
	}
}

process.env.AXC_ENVIRONMENT ??= 'local';
const appPort = await reservePort();
process.env.PORT = String(appPort);

console.log(`AXC portless URL: ${publicHealthUrl}`);
console.log(`AXC worktree: ${worktreeName}`);
console.log('Azure Functions host: func start --script-root deploy/');

run('pnpm', ['run', 'build'], { cwd: apiDir });
run('pnpm', ['exec', 'portless', 'proxy', 'start', '--https', '-p', String(PORTLESS_PORT)], { cwd: repoRoot });
// pid 0 alias: a portless-managed route is deleted by hostname when that process
// exits, which races turbo watch and drops the public URL after reload.
run('pnpm', ['exec', 'portless', 'alias', aliasName, String(appPort), '--force'], { cwd: repoRoot });

const child = spawn('node', ['start-dev.ts'], {
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
