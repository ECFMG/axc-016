console.log(
	'e18e: warning-level notes about nested package.json exports are a false positive. Node resolves exports in workspace packages, and this repo requires them. Duplicate dependencies come from ported Cellix, Storybook, and Docusaurus. The gate fails on error-level findings.',
);
