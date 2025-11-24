import * as clack from '@clack/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { banner } from '../utils/banner.js';
import { submitActivity } from '../utils/api.js';
import { hasCredentials } from '../utils/auth.js';
import type {
	AddOptions,
	MVPActivityType,
	MVPTargetAudience,
	MVPActivityRole,
	MVPVideoActivity,
	MVPBlogActivity,
	MVPArticleActivity,
	MVPPodcastActivity,
	MVPSpeakingActivity
} from '../types/index.js';

const ACTIVITY_TYPES: MVPActivityType[] = [
	'Blog',
	'Book/E-book',
	'Article',
	'Podcast',
	'Webinar/Online Training/Video/Livestream',
	'Content Feedback and Editing',
	'Online Support',
	'Open Source/Project/Sample code/Tools',
	'Product Feedback',
	'Mentorship/Coaching',
	'Speaker/Presenter at Microsoft event',
	'Speaker/Presenter at Third-party event',
	'User Group Owner'
];

const TARGET_AUDIENCES: MVPTargetAudience[] = [
	'Developer',
	'Student',
	'IT Pro',
	'Technical Decision Maker',
	'Business Decision Maker',
	'End User'
];

const ROLES: MVPActivityRole[] = [
	'Host',
	'Presenter',
	'Speaker',
	'Panelist',
	'Author',
	'Contributor',
	'Moderator',
	'Organizer',
	'Mentor',
	'Reviewer'
];

const TECH_AREAS = [
	'Web Development',
	'Cloud & AI',
	'Developer Tools',
	'Data & Analytics',
	'Mobile Development',
	'DevOps',
	'Security',
	'IoT',
	'Mixed Reality',
	'Gaming',
	'Business Applications',
	'Other'
];

export const add = async (options: AddOptions) => {
	const isInteractive = options.interactive !== false;

	if (!hasCredentials()) {
		if (isInteractive) {
			banner();
			clack.intro(chalk.hex('#00BCF2')('NOT LOGGED IN'));
			clack.log.warn('You need to login first to submit MVP contributions.');
			
			const shouldLogin = await clack.confirm({
				message: 'Would you like to login now?'
			});

			if (clack.isCancel(shouldLogin) || !shouldLogin) {
				clack.cancel('Operation cancelled.');
				process.exit(0);
			}

			const { login } = await import('./login.js');
			await login();
			
			console.log('');
			clack.log.success('Great! Now let\'s add your contribution.');
			console.log('');
		} else {
			console.error(
				chalk.red(
					'Error: MVP credentials not configured. Please run "mvp-activity login" first.'
				)
			);
			process.exit(1);
		}
	}

	if (isInteractive) {
		banner();
		clack.intro(chalk.hex('#00BCF2')('ADD MVP CONTRIBUTION'));
		clack.log.info(
			'Submit your Microsoft MVP activities - videos, blogs, speaking engagements, and more.'
		);
	}

	let type = options.type as MVPActivityType;
	let url = options.url || '';
	let date = options.date || new Date().toISOString().split('T')[0];
	let title = options.title || '';
	let description = options.description || '';

	if (isInteractive) {
		const typeInput = await clack.select({
			message: 'Select activity type',
			options: ACTIVITY_TYPES.map((t) => ({ value: t, label: t }))
		});

		if (clack.isCancel(typeInput)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		type = typeInput as MVPActivityType;

		const titleInput = await clack.text({
			message: 'Enter title',
			placeholder: 'My awesome contribution...',
			validate: (value) => {
				if (!value) return 'Title is required';
				if (value.length > 100) return 'Title must be 100 characters or less';
			}
		});

		if (clack.isCancel(titleInput)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		title = titleInput as string;

		const descriptionInput = await clack.text({
			message: 'Enter description',
			placeholder: 'Detailed description of your contribution...',
			validate: (value) => {
				if (!value) return 'Description is required';
				if (value.length > 1000) return 'Description must be 1000 characters or less';
			}
		});

		if (clack.isCancel(descriptionInput)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		description = descriptionInput as string;

		const urlInput = await clack.text({
			message: 'Enter URL',
			placeholder: 'https://...',
			validate: (value) => {
				if (!value) return 'URL is required';
				if (!value.startsWith('http')) {
					return 'URL must start with http:// or https://';
				}
			}
		});

		if (clack.isCancel(urlInput)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		url = urlInput as string;

		const dateInput = await clack.text({
			message: 'Enter date (YYYY-MM-DD)',
			initialValue: date,
			validate: (value) => {
				if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
					return 'Date must be in YYYY-MM-DD format';
				}
			}
		});

		if (clack.isCancel(dateInput)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		date = dateInput as string;

		const audienceInput = await clack.multiselect({
			message: 'Select target audience (space to select, enter to confirm)',
			options: TARGET_AUDIENCES.map((a) => ({ value: a, label: a })),
			required: true
		});

		if (clack.isCancel(audienceInput)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		const targetAudience = audienceInput as MVPTargetAudience[];

		const roleInput = await clack.select({
			message: 'Select your role',
			options: ROLES.map((r) => ({ value: r, label: r }))
		});

		if (clack.isCancel(roleInput)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		const role = roleInput as MVPActivityRole;

		const techAreaInput = await clack.select({
			message: 'Select technology focus area',
			options: TECH_AREAS.map((t) => ({ value: t, label: t }))
		});

		if (clack.isCancel(techAreaInput)) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		const technologyFocusArea = techAreaInput as string;

		let activity:
			| MVPVideoActivity
			| MVPBlogActivity
			| MVPArticleActivity
			| MVPPodcastActivity
			| MVPSpeakingActivity
			| any;

		if (type === 'Webinar/Online Training/Video/Livestream') {
			const liveStreamViewsInput = await clack.text({
				message: 'Enter livestream views (optional)',
				placeholder: '0',
				validate: (value) => {
					if (value && isNaN(Number(value))) return 'Must be a number';
				}
			});

			if (clack.isCancel(liveStreamViewsInput)) {
				clack.cancel('Operation cancelled.');
				process.exit(0);
			}

			const onDemandViewsInput = await clack.text({
				message: 'Enter on-demand views (optional)',
				placeholder: '0',
				validate: (value) => {
					if (value && isNaN(Number(value))) return 'Must be a number';
				}
			});

			if (clack.isCancel(onDemandViewsInput)) {
				clack.cancel('Operation cancelled.');
				process.exit(0);
			}

			const sessionsInput = await clack.text({
				message: 'Enter number of sessions (optional)',
				placeholder: '1',
				validate: (value) => {
					if (value && isNaN(Number(value))) return 'Must be a number';
				}
			});

			if (clack.isCancel(sessionsInput)) {
				clack.cancel('Operation cancelled.');
				process.exit(0);
			}

			activity = {
				activityTypeName: 'Webinar/Online Training/Video/Livestream',
				title,
				description,
				url,
				date,
				targetAudience,
				role,
				technologyFocusArea,
				liveStreamViews: liveStreamViewsInput ? Number(liveStreamViewsInput) : 0,
				onDemandViews: onDemandViewsInput ? Number(onDemandViewsInput) : 0,
				numberOfSessions: sessionsInput ? Number(sessionsInput) : 1
			} as MVPVideoActivity;
		} else if (type === 'Blog') {
			const viewsInput = await clack.text({
				message: 'Enter number of views (optional)',
				placeholder: '0',
				validate: (value) => {
					if (value && isNaN(Number(value))) return 'Must be a number';
				}
			});

			if (clack.isCancel(viewsInput)) {
				clack.cancel('Operation cancelled.');
				process.exit(0);
			}

			const subscribersInput = await clack.text({
				message: 'Enter subscriber base (optional)',
				placeholder: '0',
				validate: (value) => {
					if (value && isNaN(Number(value))) return 'Must be a number';
				}
			});

			if (clack.isCancel(subscribersInput)) {
				clack.cancel('Operation cancelled.');
				process.exit(0);
			}

			activity = {
				activityTypeName: 'Blog',
				title,
				description,
				url,
				date,
				targetAudience,
				role,
				technologyFocusArea,
				numberOfViews: viewsInput ? Number(viewsInput) : 0,
				subscriberBase: subscribersInput ? Number(subscribersInput) : 0
			} as MVPBlogActivity;
		} else if (type === 'Article') {
			const viewsInput = await clack.text({
				message: 'Enter number of views (optional)',
				placeholder: '0',
				validate: (value) => {
					if (value && isNaN(Number(value))) return 'Must be a number';
				}
			});

			if (clack.isCancel(viewsInput)) {
				clack.cancel('Operation cancelled.');
				process.exit(0);
			}

			const subscribersInput = await clack.text({
				message: 'Enter subscriber base (optional)',
				placeholder: '0',
				validate: (value) => {
					if (value && isNaN(Number(value))) return 'Must be a number';
				}
			});

			if (clack.isCancel(subscribersInput)) {
				clack.cancel('Operation cancelled.');
				process.exit(0);
			}

			activity = {
				activityTypeName: 'Article',
				title,
				description,
				url,
				date,
				targetAudience,
				role,
				technologyFocusArea,
				numberOfViews: viewsInput ? Number(viewsInput) : 0,
				subscriberBase: subscribersInput ? Number(subscribersInput) : 0
			} as MVPArticleActivity;
		} else if (type === 'Podcast') {
			const listensInput = await clack.text({
				message: 'Enter number of listens (optional)',
				placeholder: '0',
				validate: (value) => {
					if (value && isNaN(Number(value))) return 'Must be a number';
				}
			});

			if (clack.isCancel(listensInput)) {
				clack.cancel('Operation cancelled.');
				process.exit(0);
			}

			const subscribersInput = await clack.text({
				message: 'Enter subscriber base (optional)',
				placeholder: '0',
				validate: (value) => {
					if (value && isNaN(Number(value))) return 'Must be a number';
				}
			});

			if (clack.isCancel(subscribersInput)) {
				clack.cancel('Operation cancelled.');
				process.exit(0);
			}

			activity = {
				activityTypeName: 'Podcast',
				title,
				description,
				url,
				date,
				targetAudience,
				role,
				technologyFocusArea,
				numberOfListens: listensInput ? Number(listensInput) : 0,
				subscriberBase: subscribersInput ? Number(subscribersInput) : 0
			} as MVPPodcastActivity;
		} else if (
			type === 'Speaker/Presenter at Microsoft event' ||
			type === 'Speaker/Presenter at Third-party event'
		) {
			const attendeesInput = await clack.text({
				message: 'Enter in-person attendees (optional)',
				placeholder: '0',
				validate: (value) => {
					if (value && isNaN(Number(value))) return 'Must be a number';
				}
			});

			if (clack.isCancel(attendeesInput)) {
				clack.cancel('Operation cancelled.');
				process.exit(0);
			}

			const liveStreamViewsInput = await clack.text({
				message: 'Enter livestream views (optional)',
				placeholder: '0',
				validate: (value) => {
					if (value && isNaN(Number(value))) return 'Must be a number';
				}
			});

			if (clack.isCancel(liveStreamViewsInput)) {
				clack.cancel('Operation cancelled.');
				process.exit(0);
			}

			const onDemandViewsInput = await clack.text({
				message: 'Enter on-demand views (optional)',
				placeholder: '0',
				validate: (value) => {
					if (value && isNaN(Number(value))) return 'Must be a number';
				}
			});

			if (clack.isCancel(onDemandViewsInput)) {
				clack.cancel('Operation cancelled.');
				process.exit(0);
			}

			const sessionsInput = await clack.text({
				message: 'Enter number of sessions (optional)',
				placeholder: '1',
				validate: (value) => {
					if (value && isNaN(Number(value))) return 'Must be a number';
				}
			});

			if (clack.isCancel(sessionsInput)) {
				clack.cancel('Operation cancelled.');
				process.exit(0);
			}

			activity = {
				activityTypeName: type,
				title,
				description,
				url,
				date,
				targetAudience,
				role,
				technologyFocusArea,
				inPersonAttendees: attendeesInput ? Number(attendeesInput) : 0,
				liveStreamViews: liveStreamViewsInput ? Number(liveStreamViewsInput) : 0,
				onDemandViews: onDemandViewsInput ? Number(onDemandViewsInput) : 0,
				numberOfSessions: sessionsInput ? Number(sessionsInput) : 1
			} as MVPSpeakingActivity;
		} else {
			clack.log.warn(
				`Activity type "${type}" is not yet fully supported. Only Webinar/Video, Blog, Article, Podcast, and Speaking activities are currently implemented.`
			);
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		const shouldSubmit = await clack.confirm({
			message: 'Submit this contribution to Microsoft MVP?'
		});

		if (clack.isCancel(shouldSubmit) || !shouldSubmit) {
			clack.cancel('Operation cancelled.');
			process.exit(0);
		}

		const spinner = ora('Submitting activity to Microsoft MVP...').start();
		try {
			const result = await submitActivity(activity);
			spinner.succeed('Activity submitted successfully!');
			clack.outro(
				chalk.green(
					`✓ Activity submitted! ID: ${result.id || 'Success'}`
				)
			);
		} catch (error) {
			spinner.fail('Failed to submit activity');
			clack.log.error(
				chalk.red(
					`Error: ${error instanceof Error ? error.message : 'Unknown error'}`
				)
			);
			process.exit(1);
		}
	} else {
		if (!type || !title || !description || !url || !date) {
			console.error(
				chalk.red(
					'Error: --type, --title, --description, --url, and --date are required in non-interactive mode'
				)
			);
			process.exit(1);
		}

		if (!options.audience || !options.role || !options.techArea) {
			console.error(
				chalk.red(
					'Error: --audience, --role, and --tech-area are required in non-interactive mode'
				)
			);
			process.exit(1);
		}

		const targetAudience = options.audience.split(',').map(a => a.trim()) as MVPTargetAudience[];
		const role = options.role;
		const technologyFocusArea = options.techArea;

		let activity:
			| MVPVideoActivity
			| MVPBlogActivity
			| MVPArticleActivity
			| MVPPodcastActivity
			| MVPSpeakingActivity
			| any;

		if (type === 'Webinar/Online Training/Video/Livestream') {
			activity = {
				activityTypeName: 'Webinar/Online Training/Video/Livestream',
				title,
				description,
				url,
				date,
				targetAudience,
				role,
				technologyFocusArea,
				liveStreamViews: options.liveViews ? Number(options.liveViews) : 0,
				onDemandViews: options.onDemandViews ? Number(options.onDemandViews) : 0,
				numberOfSessions: options.sessions ? Number(options.sessions) : 1
			} as MVPVideoActivity;
		} else if (type === 'Blog') {
			activity = {
				activityTypeName: 'Blog',
				title,
				description,
				url,
				date,
				targetAudience,
				role,
				technologyFocusArea,
				numberOfViews: options.views ? Number(options.views) : 0,
				subscriberBase: options.subscribers ? Number(options.subscribers) : 0
			} as MVPBlogActivity;
		} else if (type === 'Article') {
			activity = {
				activityTypeName: 'Article',
				title,
				description,
				url,
				date,
				targetAudience,
				role,
				technologyFocusArea,
				numberOfViews: options.views ? Number(options.views) : 0,
				subscriberBase: options.subscribers ? Number(options.subscribers) : 0
			} as MVPArticleActivity;
		} else if (type === 'Podcast') {
			activity = {
				activityTypeName: 'Podcast',
				title,
				description,
				url,
				date,
				targetAudience,
				role,
				technologyFocusArea,
				numberOfListens: options.listens ? Number(options.listens) : 0,
				subscriberBase: options.subscribers ? Number(options.subscribers) : 0
			} as MVPPodcastActivity;
		} else if (
			type === 'Speaker/Presenter at Microsoft event' ||
			type === 'Speaker/Presenter at Third-party event'
		) {
			activity = {
				activityTypeName: type,
				title,
				description,
				url,
				date,
				targetAudience,
				role,
				technologyFocusArea,
				inPersonAttendees: options.attendees ? Number(options.attendees) : 0,
				liveStreamViews: options.liveViews ? Number(options.liveViews) : 0,
				onDemandViews: options.onDemandViews ? Number(options.onDemandViews) : 0,
				numberOfSessions: options.sessions ? Number(options.sessions) : 1
			} as MVPSpeakingActivity;
		} else {
			console.error(
				chalk.red(
					`Activity type "${type}" is not yet fully supported. Only Webinar/Video, Blog, Article, Podcast, and Speaking activities are currently implemented.`
				)
			);
			process.exit(1);
		}

		const spinner = ora('Submitting activity to Microsoft MVP...').start();
		try {
			const result = await submitActivity(activity);
			spinner.succeed('Activity submitted successfully!');
			console.log(chalk.green(`✓ Activity submitted! ID: ${result.id || 'Success'}`));
		} catch (error) {
			spinner.fail('Failed to submit activity');
			console.error(
				chalk.red(
					`Error: ${error instanceof Error ? error.message : 'Unknown error'}`
				)
			);
			process.exit(1);
		}
	}
};
