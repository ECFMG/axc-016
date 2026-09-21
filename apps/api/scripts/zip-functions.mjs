import { spawnSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const apiDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const deployDir = join(apiDir, 'deploy');
const zipDir = join(apiDir, 'build');
const zipPath = join(zipDir, 'agentCourses-api.zip');
mkdirSync(zipDir, { recursive: true });
const result = spawnSync('zip', ['-r', '-q', zipPath, '.'], { cwd: deployDir, encoding: 'utf8' });
if (result.status !== 0) {
	console.error(result.stderr || result.stdout || 'zip failed');
	process.exit(result.status ?? 1);
}
const size = statSync(zipPath).size;
if (size <= 0) {
	console.error('Azure Functions package zip is empty');
	process.exit(1);
}
console.log(`Azure Functions package zip: ${zipPath} (${size} bytes)`);
