#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { banner } from './utils/banner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
	readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

program
	.name('mvp-activity')
	.description('Submit your Microsoft MVP contributions with ease')
	.version(packageJson.version, '-v, --version', 'output the version number')
	.helpOption('-h, --help', 'display help for command');

program
	.command('add')
	.alias('a')
	.description('Add a new MVP contribution (interactive by default)')
	.option('-t, --type <type>', 'activity type')
	.option('-u, --url <url>', 'activity URL')
	.option('-d, --date <date>', 'activity date (YYYY-MM-DD)', new Date().toISOString().split('T')[0])
	.option('-T, --title <title>', 'activity title')
	.option('-D, --description <description>', 'activity description')
	.option('-a, --audience <audience>', 'target audience (comma-separated: Developer,Student,IT Pro)')
	.option('-r, --role <role>', 'your role (Speaker,Author,Host,etc.)')
	.option('--tech-area <area>', 'technology focus area')
	.option('--attendees <number>', 'in-person attendees (for speaking)')
	.option('--live-views <number>', 'livestream views')
	.option('--on-demand-views <number>', 'on-demand views')
	.option('--sessions <number>', 'number of sessions')
	.option('--views <number>', 'number of views (for blog/article)')
	.option('--subscribers <number>', 'subscriber base')
	.option('--listens <number>', 'number of listens (for podcast)')
	.option('-x, --no-interactive', 'disable interactive mode')
	.action(async (options) => {
		const { add } = await import('./commands/add.js');
		await add(options);
	});

program
	.command('login')
	.alias('l')
	.description('Login with MVP credentials (access token and profile ID)')
	.action(async () => {
		const { login } = await import('./commands/login.js');
		await login();
	});

program
	.command('logout')
	.description('Logout and delete stored credentials')
	.action(async () => {
		const { logout } = await import('./commands/logout.js');
		await logout();
	});

if (process.argv.length === 2) {
	banner();
	program.help();
}

program.parse();
