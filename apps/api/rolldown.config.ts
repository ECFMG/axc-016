/// <reference types="node" />
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCellixAzureFunctionsRolldownConfig } from '@cellix/config-rolldown';
import { defineConfig } from 'rolldown';

const apiDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(apiDir, '../..');

export default defineConfig(async () =>
	createCellixAzureFunctionsRolldownConfig({
		repoRoot,
		appPackageName: '@apps/api',
		applicationNamespaces: ['@axc/'],
	}),
);
