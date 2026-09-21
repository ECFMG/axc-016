import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeDependencyRulesTests } from '@cellix/archunit-tests/general';
import { projectFiles } from 'archunit';
import { describe, expect, it } from 'vitest';

describeDependencyRulesTests({
	domainFolder: '../../axc/domain',
	persistenceFolder: '../../axc/persistence',
	applicationServicesFolder: '../../axc/application-services',
	restFolder: '../../axc/rest',
	infrastructurePattern: '../../axc/service-mongoose/**',
	restInfrastructurePattern: '../../axc/service-mongoose/**',
});

const domainForbidden = ['hono', '@azure/functions', '@marplex/hono-azurefunc-adapter', 'mongoose', 'mongodb', '@axc/rest', '@axc/persistence', '@axc/service-mongoose', '@apps/api'];
const applicationForbidden = ['hono', '@azure/functions', '@marplex/hono-azurefunc-adapter', 'mongoose', 'mongodb', '@axc/rest', '@axc/persistence', '@axc/service-mongoose', '@apps/api'];

function sourceFiles(folder: string): string[] {
	const files: string[] = [];
	const walk = (dir: string): void => {
		for (const name of readdirSync(dir)) {
			const path = join(dir, name);
			if (statSync(path).isDirectory()) {
				walk(path);
			} else if (path.endsWith('.ts') && !path.endsWith('.test.ts')) {
				files.push(path);
			}
		}
	};
	walk(folder);
	return files;
}

function importViolations(folder: string, forbidden: readonly string[]): string[] {
	const violations: string[] = [];
	for (const file of sourceFiles(folder)) {
		const text = readFileSync(file, 'utf8');
		for (const specifier of forbidden) {
			if (text.includes(`'${specifier}'`) || text.includes(`"${specifier}"`)) {
				violations.push(`${file} imports ${specifier}`);
			}
		}
	}
	return violations;
}

const domainSource = fileURLToPath(new URL('../../../axc/domain/src', import.meta.url));
const applicationSource = fileURLToPath(new URL('../../../axc/application-services/src', import.meta.url));

describe('axc layer boundaries', () => {
	it('domain does not import REST, Hono, Azure Functions, Mongoose, persistence, or composition', () => {
		expect(importViolations(domainSource, domainForbidden)).toEqual([]);
	});

	it('application services do not import REST, Hono, Azure Functions, Mongoose, persistence, or composition', () => {
		expect(importViolations(applicationSource, applicationForbidden)).toEqual([]);
	});

	it('domain does not depend on the REST folder', async () => {
		await projectFiles().inFolder('../../axc/domain').shouldNot().dependOnFiles().inFolder('../../axc/rest').check();
	});
});
