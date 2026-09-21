import type { Options, ThemeConfig } from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';

const config: Config = {
	title: 'agentCourses',
	tagline: 'API documentation for the axc scaffold',
	url: 'https://agentcourses.local',
	baseUrl: '/',
	organizationName: 'agentcourses',
	projectName: 'axc',
	onBrokenLinks: 'throw',
	onBrokenAnchors: 'throw',
	future: {
		experimental_router: 'hash',
	},
	presets: [
		[
			'classic',
			{
				docs: {
					routeBasePath: '/',
					sidebarPath: './sidebars.ts',
				},
				blog: false,
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Options,
		],
	],
	themeConfig: {
		navbar: {
			title: 'agentCourses',
		},
	} satisfies ThemeConfig,
};

export default config;
