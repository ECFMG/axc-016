import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

console.log('dependency script-policy check');

const root = fileURLToPath(new URL('../', import.meta.url));
const failures = [];

function walkPackageJson(dir, acc = []) {
	for (const name of readdirSync(dir)) {
		if (name === 'node_modules' || name === 'dist' || name === 'deploy' || name === 'coverage' || name === 'build' || name === '.turbo') {
			continue;
		}
		const path = join(dir, name);
		const stat = statSync(path);
		if (stat.isDirectory()) {
			walkPackageJson(path, acc);
		} else if (name === 'package.json') {
			acc.push(path);
		}
	}
	return acc;
}

const rootPackage = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const onlyBuilt = rootPackage.pnpm?.onlyBuiltDependencies ?? [];
if (onlyBuilt.length > 0) {
	failures.push(`onlyBuiltDependencies approves dependency builds: ${onlyBuilt.join(', ')}`);
}

const workspace = readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf8');
if (/^allowBuilds:\s*$/m.test(workspace) || /^\s{2}\S[^#\n]*:\s*true\s*$/m.test(workspace)) {
	const approvals = workspace.split('\n').filter((line) => /^\s+\S[^#\n]*:\s*true\s*$/.test(line));
	if (approvals.length > 0) {
		failures.push(`dependency build approvals found:\n${approvals.join('\n')}`);
	}
}

for (const file of ['package-lock.json', 'yarn.lock']) {
	try {
		statSync(join(root, file));
		failures.push(`${file} must not exist; this repo uses pnpm only`);
	} catch {
		// absent
	}
}

for (const file of walkPackageJson(root)) {
	const manifest = JSON.parse(readFileSync(file, 'utf8'));
	for (const section of ['dependencies', 'devDependencies', 'optionalDependencies']) {
		for (const dependency of Object.keys(manifest[section] ?? {})) {
			if (dependency === 'mongodb-memory-server') {
				failures.push(`${file} depends on mongodb-memory-server; use mongodb-memory-server-core`);
			}
		}
	}
}

const forbiddenSnippets = [['snyk', 'monitor'].join(' '), ['--remote-', 'repo-url'].join('')];
function walkSource(dir, acc = []) {
	for (const name of readdirSync(dir)) {
		if (['node_modules', 'dist', 'deploy', 'coverage', 'build', '.turbo', 'target', 'reports', '.docusaurus'].includes(name)) {
			continue;
		}
		const path = join(dir, name);
		const stat = statSync(path);
		if (stat.isDirectory()) {
			walkSource(path, acc);
		} else if (/\.(mjs|js|cjs|ts|tsx|json|yml|yaml|md|toml)$/.test(name)) {
			acc.push(path);
		}
	}
	return acc;
}
for (const file of walkSource(root)) {
	if (file.endsWith('check-dependency-scripts.mjs')) {
		continue;
	}
	const text = readFileSync(file, 'utf8');
	for (const snippet of forbiddenSnippets) {
		if (text.includes(snippet)) {
			failures.push(`${file} contains forbidden Snyk usage`);
		}
	}
}

if (failures.length > 0) {
	console.error('dependency script policy: FAIL');
	for (const failure of failures) {
		console.error(`- ${failure}`);
	}
	process.exit(1);
}

console.log('dependency script policy: PASS (no approved dependency builds; mongodb-memory-server postinstall is not used)');
