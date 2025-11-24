#!/usr/bin/env tsx

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import * as readline from 'node:readline';
import { setToken, setProfileId } from '../src/utils/auth.js';

const execAsync = promisify(exec);

async function main() {
	console.log('\n🔑 MVP Token Capture Tool\n');
	console.log('='.repeat(60));
	console.log('\n⚠️  IMPORTANT: You must be logged into the MVP portal BEFORE continuing\n');
	console.log('='.repeat(60));
	console.log('\n📋 INSTRUCTIONS:\n');
	console.log('1. 🌐 Opening your default browser to the MVP portal...');
	console.log('2. ✅ If already logged in, you\'ll see your account immediately');
	console.log('3. 🔐 If not logged in, sign in with your Microsoft account');
	console.log('\n4. 🛠️  Open DevTools:');
	console.log('   - Chrome/Edge/Firefox: Press F12 or Cmd+Option+I (Mac)');
	console.log('   - Safari: Enable in Preferences first, then Cmd+Option+I');
	console.log('\n5. 📊 Click on the \'Network\' tab in DevTools');
	console.log('6. 📝 Navigate to \'Add activity\' or edit an existing activity');
	console.log('7. ✏️  Fill in any field in the form (this generates API calls)');
	console.log('\n8. 🔍 In the Network tab, look for a request to:');
	console.log('   ✅ \'mavenapi-prod.azurewebsites.net\'');
	console.log('   ✅ Method: POST or GET');
	console.log('\n9. 🖱️  Click on that request');
	console.log('10. 📄 Go to the \'Headers\' tab');
	console.log('11. 📜 Scroll to \'Request Headers\'');
	console.log('12. 🔑 Find the \'Authorization\' header');
	console.log('13. 📋 Copy ONLY the token part (after \'Bearer \')');
	console.log('\n' + '='.repeat(60));
	console.log('\n💡 The token looks like this:');
	console.log('   eyJhbGciOiJSU0EtT0FFUCIsImVuYy...(very long string)');
	console.log('\n⚠️  IMPORTANT: Copy ONLY the token, NOT the word \'Bearer\'\n');
	console.log('='.repeat(60) + '\n');

	console.log('⏳ Opening browser in 3 seconds...\n');
	await new Promise((resolve) => setTimeout(resolve, 3000));

	try {
		await execAsync('open https://mvp.microsoft.com/en-US/account/');
		console.log('✅ Browser opened!\n');
	} catch (error) {
		console.log('⚠️  Could not open browser automatically');
		console.log('💡 Open manually: https://mvp.microsoft.com/en-US/account/\n');
	}

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.question('📝 Paste your MVP access token here and press Enter:\n\n', (token) => {
		const cleanToken = token.trim().replace(/^Bearer\s+/i, '');

		if (!cleanToken || cleanToken.length < 50) {
			console.log('\n❌ Invalid token. Token should be very long (hundreds of characters)');
			console.log('💡 Make sure you copied the entire token');
			rl.close();
			process.exit(1);
		}

		console.log('\n✅ Token received!');
		console.log(`📏 Length: ${cleanToken.length} characters`);
		console.log(`🔍 Preview: ${cleanToken.substring(0, 50)}...${cleanToken.substring(cleanToken.length - 20)}\n`);

		rl.question('📝 Now paste your MVP Profile ID (numeric) and press Enter:\n\n', (profileId) => {
			rl.close();

			const cleanProfileId = profileId.trim();

			if (!cleanProfileId || isNaN(Number(cleanProfileId))) {
				console.log('\n❌ Invalid profile ID. Must be a number');
				console.log('💡 Find it in the Network request payload under "userProfileId"');
				process.exit(1);
			}

			console.log('\n✅ Profile ID received!');
			console.log(`🆔 Profile ID: ${cleanProfileId}\n`);

			console.log('💾 Saving credentials...');
			setToken(cleanToken);
			setProfileId(cleanProfileId);

			console.log('\n✅ SUCCESS! Credentials saved!');
			console.log('📝 Saved:');
			console.log('   - MVP Access Token');
			console.log('   - MVP Profile ID\n');
			console.log('🎉 You can now use mvp-activity to submit activities!\n');
			console.log('💡 Try: mvp-activity add\n');
		});
	});
}

main().catch((error) => {
	console.error('❌ Error:', error);
	process.exit(1);
});
