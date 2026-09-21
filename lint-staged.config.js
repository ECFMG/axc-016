export default {
	'*': () => [
		'pnpm run check-scripts',
		'pnpm run biome',
		'pnpm exec turbo run typecheck',
		'pnpm exec knip',
		'pnpm run e18e',
		'pnpm exec turbo run test:arch',
		'pnpm exec turbo run test:acceptance',
		'pnpm run audit',
		'pnpm run snyk',
	],
};
