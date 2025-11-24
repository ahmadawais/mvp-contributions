import * as clack from '@clack/prompts';
import chalk from 'chalk';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import * as readline from 'node:readline';
import {
	getProfileId,
	getToken,
	setProfileId,
	setToken
} from '../utils/auth.js';
import { banner } from '../utils/banner.js';
import { parseCurl } from '../utils/parse-curl.js';

const execAsync = promisify(exec);

export const login = async () => {
	banner();
	clack.intro(chalk.hex('#00BCF2')('LOGIN TO MVP'));

	const currentToken = getToken();
	const currentProfileId = getProfileId();

	if (currentToken && currentProfileId) {
		clack.log.success('Current credentials found');
		clack.log.info(`Profile ID: ${currentProfileId}`);
		clack.log.info(`Token: ${currentToken.substring(0, 20)}...`);

		const shouldUpdate = await clack.confirm({
			message: 'Do you want to update your credentials?'
		});

		if (clack.isCancel(shouldUpdate) || !shouldUpdate) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}
	}

	clack.log.step('Step 1: Login to MVP Portal');
	clack.note(
		"We'll open https://mvp.microsoft.com in your browser.\nPlease login with your account.",
		'Instructions'
	);

	const shouldOpenBrowser = await clack.confirm({
		message: 'Open MVP portal in browser now?'
	});

	if (clack.isCancel(shouldOpenBrowser)) {
		clack.cancel('Operation cancelled.');
		process.exit(0);
	}

	if (shouldOpenBrowser) {
		try {
			await execAsync('open https://mvp.microsoft.com/en-US/account/');
			clack.log.success('Browser opened!');
		} catch (error) {
			clack.log.warn('Could not open browser automatically');
			console.log(
				chalk.dim('  Open manually: https://mvp.microsoft.com/en-US/account/')
			);
		}
	}

	console.log('');

	const isLoggedIn = await clack.confirm({
		message: 'Have you logged in to the MVP portal?'
	});

	if (clack.isCancel(isLoggedIn) || !isLoggedIn) {
		clack.cancel('Please login first and try again.');
		process.exit(0);
	}

	clack.log.step('Step 2: Go to Add Activity Page');
	clack.note(
		'From the left nav, Click on "Activities" then "Add Activity"',
		'Instructions'
	);

	const onAddActivityPage = await clack.confirm({
		message: 'Are you on the Add activity page?'
	});

	if (clack.isCancel(onAddActivityPage) || !onAddActivityPage) {
		clack.cancel('Please navigate to Add activity page and try again.');
		process.exit(0);
	}

	clack.log.step('Step 3: Open DevTools Network Tab');
	clack.note(
		'1. Open DevTools (Cmd+Option+I on Mac or Right click [Inspect])\n2. Click on the "Network" tab',
		'Instructions'
	);

	const devToolsReady = await clack.confirm({
		message: 'Is the Network tab open in DevTools?'
	});

	if (clack.isCancel(devToolsReady) || !devToolsReady) {
		clack.cancel('Please open DevTools Network tab and try again.');
		process.exit(0);
	}

	clack.log.step('Step 4: Trigger an API Request');
	clack.note(
		'1. Fill in any field (title, description, etc.)\n2. This will trigger a network request',
		'Instructions'
	);

	const activityFilled = await clack.confirm({
		message: 'Have you filled in a field in the activity form?'
	});

	if (clack.isCancel(activityFilled) || !activityFilled) {
		clack.cancel('Please fill in a field and try again.');
		process.exit(0);
	}

	clack.log.step('Step 5: Copy as cURL');
	clack.note(
		'1. In the Network tab, find the request named "Activities/"\n   (or to "https://mavenapi-prod.azurewebsites.net/api/Activities/")\n2. Right-click on it\n3. Select "Copy" → "Copy as cURL"\n\n💡 We\'ll automatically extract your token and profile ID from this',
		'Instructions'
	);

	let success = false;
	let attempts = 0;
	const maxAttempts = 3;

	while (!success && attempts < maxAttempts) {
		attempts++;

		if (attempts > 1) {
			console.log('');
			console.log(chalk.yellow(`Attempt ${attempts} of ${maxAttempts}`));
		}

		console.log('');
		console.log(chalk.yellow('⚠️  Important: Paste the ENTIRE cURL command (it will be very long)'));
		console.log(chalk.dim('   After pasting, press Enter TWICE to submit'));
		console.log('');

		const curlInput = await new Promise<string>((resolve) => {
			const rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout
			});

			console.log(chalk.dim('◆ Paste the cURL command here (press Enter TWICE when done):'));
			console.log('');

			let buffer = '';
			let emptyLineCount = 0;

			rl.on('line', (line) => {
				if (line.trim() === '') {
					emptyLineCount++;
					if (emptyLineCount >= 2 && buffer.length > 0) {
						rl.close();
					}
				} else {
					emptyLineCount = 0;
					buffer += line + ' ';
				}
			});

			rl.on('close', () => {
				resolve(buffer.trim());
			});
		});

		console.log('');
		console.log(chalk.dim('✓ Input received, parsing...'));
		console.log('');

		if (!curlInput || curlInput.length < 50) {
			clack.log.error('No input received or input too short');
			console.log('');
			console.log(chalk.yellow('  💡 Make sure you:'));
			console.log(chalk.yellow('     - Pasted the entire cURL command'));
			console.log(chalk.yellow('     - Pressed Enter TWICE after pasting'));
			console.log('');
			
			if (attempts < maxAttempts) {
				console.log(chalk.cyan('  Let\'s try again...'));
				continue;
			} else {
				process.exit(1);
			}
		}

		try {
			const { token, profileId } = parseCurl(curlInput);

			console.log('');
			clack.log.success('Successfully extracted credentials!');
			console.log(chalk.dim(`  Token: ${token.substring(0, 30)}...`));
			console.log(chalk.dim(`  Profile ID: ${profileId}`));
			console.log('');

			setToken(token);
			setProfileId(profileId);

			console.log('');
			clack.log.info('Credentials stored securely at:');
			console.log(chalk.dim('  ~/.config/mvp-activity/config.json'));
			console.log('');

			clack.outro(
				chalk.green('✓ Login successful! You can now submit MVP contributions.')
			);
			
			success = true;
		} catch (error) {
			console.log('');
			clack.log.error(
				chalk.red(
					`Failed to parse cURL command: ${error instanceof Error ? error.message : 'Unknown error'}`
				)
			);
			console.log('');
			
			const tryManual = await clack.confirm({
				message: 'Would you like to enter the token and profile ID manually instead?'
			});

			if (clack.isCancel(tryManual)) {
				clack.cancel('Operation cancelled.');
				process.exit(0);
			}

			if (tryManual) {
				console.log('');
				clack.log.step('Manual Entry Mode');
				clack.note(
					'1. In DevTools Network tab, find the "Activities" request\n2. Click on it and go to the "Headers" tab\n3. Scroll to "Request Headers"\n4. Find "authorization: Bearer <very-long-token>"\n5. Copy everything AFTER "Bearer " (the token)',
					'How to find your token'
				);

				const manualToken = await clack.text({
					message: 'Paste your Bearer token here',
					placeholder: 'eyJhbGciOiJSU0EtT0FFUCIsImVuYy...',
					validate: (value) => {
						if (!value) return 'Token is required';
						if (value.length < 100) return 'Token seems too short';
					}
				});

				if (clack.isCancel(manualToken)) {
					clack.cancel('Operation cancelled.');
					process.exit(0);
				}

				console.log('');
				clack.note(
					'1. In the same request, click on the "Payload" tab\n2. Look for "userProfileId": 303014 (your number will be different)\n3. Copy just the number',
					'How to find your Profile ID'
				);

				const manualProfileId = await clack.text({
					message: 'Enter your Profile ID',
					placeholder: '303014',
					validate: (value) => {
						if (!value) return 'Profile ID is required';
						if (isNaN(Number(value))) return 'Profile ID must be a number';
					}
				});

				if (clack.isCancel(manualProfileId)) {
					clack.cancel('Operation cancelled.');
					process.exit(0);
				}

				const cleanToken = (manualToken as string).trim().replace(/^Bearer\s+/i, '');

				console.log('');
				clack.log.success('Credentials received!');
				console.log(chalk.dim(`  Token: ${cleanToken.substring(0, 30)}...`));
				console.log(chalk.dim(`  Profile ID: ${manualProfileId}`));
				console.log('');

				setToken(cleanToken);
				setProfileId(manualProfileId as string);

				console.log('');
				clack.log.info('Credentials stored securely at:');
				console.log(chalk.dim('  ~/.config/mvp-activity/config.json'));
				console.log('');

				clack.outro(
					chalk.green('✓ Login successful! You can now submit MVP contributions.')
				);
				
				success = true;
			} else if (attempts < maxAttempts) {
				console.log('');
				console.log(chalk.cyan('  Let\'s try the cURL method again...'));
			} else {
				console.log('');
				console.log(chalk.red('  Maximum attempts reached. Please try running the login command again.'));
				process.exit(1);
			}
		}
	}
};
