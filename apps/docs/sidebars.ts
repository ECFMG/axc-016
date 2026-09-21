import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
	docs: [
		{
			type: 'doc',
			id: 'healthcheck',
			label: 'Healthcheck',
		},
		{
			type: 'doc',
			id: 'decisions',
			label: 'Decision records',
		},
	],
};

export default sidebars;
