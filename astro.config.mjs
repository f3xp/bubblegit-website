// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'bubblegit',
			description: 'A fast git TUI built on Bubble Tea.',
			logo: { src: './src/assets/bubblegit-small.svg', replacesTitle: true },
			favicon: '/favicon.svg',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/f3xp/bubblegit' }],
			customCss: ['./src/styles/mocha.css'],
			components: {
				ThemeProvider: './src/components/ThemeProvider.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
				Hero: './src/components/Hero.astro',
				SocialIcons: './src/components/SocialIcons.astro',
				Footer: './src/components/Footer.astro',
				PageTitle: './src/components/PageTitle.astro',
				Search: './src/components/Search.astro',
			},
			expressiveCode: { themes: ['catppuccin-mocha'] },
			sidebar: [
				{ label: 'Welcome', items: [{ label: 'Getting started', slug: 'getting-started' }] },
				{
					label: 'Views',
					items: [
						{ label: 'Working tree', slug: 'views/working-tree' },
						{ label: 'Log', slug: 'views/log' },
						{ label: 'Branches', slug: 'views/branches' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Staging and committing', slug: 'staging-and-committing' },
						{ label: 'Keybindings', slug: 'keybindings' },
						{ label: 'Mouse and layout', slug: 'mouse-and-layout' },
					],
				},
			],
		}),
	],
});
