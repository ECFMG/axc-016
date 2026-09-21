import { spawn, spawnSync } from 'node:child_process';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyWorktreeSuffix } from '@cellix/local-dev/urls';

const apiDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(apiDir, '../..');
const worktreeName = process.env.WORKTREE_NAME || basename(repoRoot);
const hostname = applyWorktreeSuffix('api.agentcourses.localhost', worktreeName);

process.env.AXC_ENVIRONMENT ??= 'local';
console.log(`AXC portless hostname: https://${hostname}/health`);
console.log(`AXC worktree: ${worktreeName}`);
console.log('Azure Functions host: func start --script-root deploy/');

const build = spawnSync('pnpm', ['run', 'build'], { cwd: apiDir, stdio: 'inherit', env: process.env });
if ((build.status ?? 1) !== 0) {
	process.exit(build.status ?? 1);
}

spawnSync('pnpm', ['exec', 'portless', 'proxy', 'start', '--https', '-p', '1355'], {
	cwd: repoRoot,
	stdio: 'inherit',
	env: process.env,
});

const child = spawn('pnpm', ['exec', 'portless', hostname, '--force', 'node', 'start-dev.ts'], {
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
