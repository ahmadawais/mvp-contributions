<h4 align="center">
    <a href="https://nodecli.com/?utm_source=FOSS&utm_medium=FOSS&utm_campaign=mvp-activity">
        <img src="https://raw.githubusercontent.com/ahmadawais/mvp-activity/main/image.png" alt="mvp-activity" />
</a>
<br>
<br>

Submit your Microsoft MVP contributions from the command line.

<br>

[![DOWNLOADS](https://img.shields.io/npm/dt/mvp-activity?style=for-the-badge&label=Downloads&colorA=191D20&colorB=18BBF2)](https://www.npmjs.com/package/mvp-activity) [![Learn Node.js CLI Automation](https://img.shields.io/badge/LEARN-NodeCLI.com%20%E2%86%92-gray.svg?style=for-the-badge&colorA=191D20&colorB=18BBF2)](https://nodecli.com/?utm_source=GitHubFOSS) [![Follow @_ahmadawais on X](https://img.shields.io/badge/FOLLOW-@_ahmadawais%20%E2%86%92-gray.svg?style=for-the-badge&colorA=191D20&colorB=18BBF2)](https://x.com/_ahmadawais/)

</h4>

<br>

# CLI: mvp-activity

- 📦 Submit MVP contributions of any type
- 🎯 Interactive mode with guided prompts
- 🤖 Non-interactive mode for automation
- 🔐 Secure credential storage
- ✨ Support for all MVP activity types

<br>

[![📟](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/install.png)](#install)

## Install

```sh
# Recommended.
npx mvp-activity

# OR an alternative global install.
npm install -g mvp-activity
```

<br>

[![⚙️](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/usage.png)](#usage)

## Usage

The CLI supports both **interactive** (default) and **non-interactive** modes for automation.

### Login

First, authenticate with your MVP credentials:

```sh
mvp-activity login
# OR
mvp-activity l
```

This will guide you through:
1. Opening the MVP portal
2. Capturing your authentication token
3. Storing credentials securely

### Add Contributions

#### 💬 Interactive Mode (Default)

Run `mvp-activity add` and answer the prompts:

```sh
mvp-activity add
# OR
mvp-activity a
```

You'll be asked:
- Activity Type
- Title
- Description
- URL
- Date
- Target Audience
- Your Role
- Technology Focus Area
- Activity-specific metrics (views, attendees, sessions, etc.)

#### 🤖 Non-Interactive Mode (Automation)

Perfect for CI/CD pipelines and scripts:

```sh
mvp-activity add \
  -t "Speaker/Presenter at Third-party event" \
  -T "My Conference Talk" \
  -D "Talked about AI agents" \
  -u https://example.com \
  -d 2025-11-24 \
  -a "Developer,Student" \
  -r Speaker \
  --tech-area "Web Development" \
  --attendees 700 \
  --live-views 700 \
  --on-demand-views 700 \
  --sessions 1 \
  -x
```

### Logout

Remove stored credentials:

```sh
mvp-activity logout
```

<br>

[![⚙️](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/usage.png)](#command-reference)

## Command Reference

### Basic Syntax

```sh
mvp-activity <command> [options]
```

### Global Options

| Option | Description |
|--------|-------------|
| `-v, --version` | Output the version number |
| `-h, --help` | Display help for command |

### Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `login` | `l` | Login with MVP credentials |
| `add [options]` | `a` | Add a new contribution (interactive by default) |
| `logout` | - | Logout and delete stored credentials |
| `help [command]` | - | Display help for command |

---

### `login` Command

Authenticate with your Microsoft MVP account.

**Usage:**
```sh
mvp-activity login
mvp-activity l
```

The CLI will guide you through:
1. Opening the MVP portal in your browser
2. Capturing network requests to extract your token
3. Storing credentials securely in `~/.config/mvp-activity/`

---

### `add` Command

Add a new contribution to your Microsoft MVP profile.

**Usage:**
```sh
mvp-activity add [options]
mvp-activity a [options]
```

**Options:**

| Option | Description | Required |
|--------|-------------|----------|
| `-t, --type <type>` | Activity type (see types below) | Yes (non-interactive) |
| `-T, --title <title>` | Activity title | Yes (non-interactive) |
| `-D, --description <description>` | Activity description | Yes (non-interactive) |
| `-u, --url <url>` | Activity URL | Yes (non-interactive) |
| `-d, --date <date>` | Date in YYYY-MM-DD format (default: today) | Yes (non-interactive) |
| `-a, --audience <audience>` | Target audience (comma-separated) | Yes (non-interactive) |
| `-r, --role <role>` | Your role | Yes (non-interactive) |
| `--tech-area <area>` | Technology focus area | Yes (non-interactive) |
| `--attendees <number>` | In-person attendees (for speaking) | No |
| `--live-views <number>` | Livestream views | No |
| `--on-demand-views <number>` | On-demand views | No |
| `--sessions <number>` | Number of sessions | No |
| `--views <number>` | Number of views (for blog/article) | No |
| `--subscribers <number>` | Subscriber base | No |
| `--listens <number>` | Number of listens (for podcast) | No |
| `-x, --no-interactive` | Disable interactive mode | No |
| `-h, --help` | Display help | No |

**Activity Types:**
- `Blog`
- `Book/E-book`
- `Article`
- `Podcast`
- `Webinar/Online Training/Video/Livestream`
- `Content Feedback and Editing`
- `Online Support`
- `Open Source/Project/Sample code/Tools`
- `Product Feedback`
- `Mentorship/Coaching`
- `Speaker/Presenter at Microsoft event`
- `Speaker/Presenter at Third-party event`
- `User Group Owner`

**Target Audiences:**
- `Developer`
- `Student`
- `IT Pro`
- `Technical Decision Maker`
- `Business Decision Maker`
- `End User`

**Roles:**
- `Host`
- `Presenter`
- `Speaker`
- `Panelist`
- `Author`
- `Contributor`
- `Moderator`
- `Organizer`
- `Mentor`
- `Reviewer`

**Technology Focus Areas:**
- `Web Development`
- `Cloud & AI`
- `Developer Tools`
- `Data & Analytics`
- `Mobile Development`
- `DevOps`
- `Security`
- `IoT`
- `Mixed Reality`
- `Gaming`
- `Business Applications`
- `Other`

**Examples:**

```sh
# Interactive mode (default)
mvp-activity add

# Speaking engagement (non-interactive)
mvp-activity add \
  -t "Speaker/Presenter at Third-party event" \
  -T "Command.new - Agent of Agents" \
  -D "Talked about building AI agents without frameworks" \
  -u https://www.youtube.com/watch?v=fcPUqxfrE6Y \
  -d 2025-11-24 \
  -a "Developer,Student" \
  -r Speaker \
  --tech-area "Web Development" \
  --attendees 700 \
  --live-views 700 \
  --on-demand-views 700 \
  --sessions 1 \
  -x

# Blog post (non-interactive)
mvp-activity add \
  -t Blog \
  -T "My Blog Post" \
  -D "Description here" \
  -u https://example.com/blog \
  -d 2025-11-22 \
  -a Developer \
  -r Author \
  --tech-area "Web Development" \
  --views 1000 \
  --subscribers 500 \
  -x

# Video/Webinar (non-interactive)
mvp-activity add \
  -t "Webinar/Online Training/Video/Livestream" \
  -T "My Tutorial Video" \
  -D "Tutorial about Node.js" \
  -u https://youtube.com/watch?v=xyz \
  -d 2025-11-20 \
  -a "Developer,Student" \
  -r Host \
  --tech-area "Developer Tools" \
  --live-views 500 \
  --on-demand-views 2000 \
  --sessions 1 \
  -x
```

---

### `logout` Command

Remove stored MVP credentials.

**Usage:**
```sh
mvp-activity logout
```

<br>

[![📝](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/log.png)](changelog.md)

## Changelog

[❯ Read the changelog here →](changelog.md)

<small>**KEY**: `📦 NEW`, `👌 IMPROVE`, `🐛 FIX`, `📖 DOC`, `🚀 RELEASE`, and `🤖 TEST`

> _I use [Emoji-log](https://github.com/ahmadawais/Emoji-Log), you should try it and simplify your git commits._

</small>

<br>

[![📃](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/license.png)](#license)

## License & Conduct

- Thanks to the Microsoft MVP team for the API.
- MIT © [Ahmad Awais](https://twitter.com/_AhmadAwais/).

<br>

[![🙌](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/connect.png)](#connect)

## Connect

<div align="left">
    <p><a href="https://github.com/ahmadawais"><img alt="GitHub @AhmadAwais" align="center" src="https://img.shields.io/badge/GITHUB-gray.svg?colorB=191D20&style=for-the-badge" /></a>&nbsp;<small><strong>(follow)</strong> To stay up to date on free & open-source software</small></p>
    <p><a href="https://twitter.com/_AhmadAwais/"><img alt="Twitter @_AhmadAwais" align="center" src="https://img.shields.io/badge/X/TWITTER-gray.svg?colorB=191D20&style=for-the-badge" /></a>&nbsp;<small><strong>(follow)</strong> To get #OneDevMinute daily hot tips & trolls</small></p>
    <p><a href="https://www.youtube.com/AhmadAwais"><img alt="YouTube AhmadAwais" align="center" src="https://img.shields.io/badge/YOUTUBE-gray.svg?colorB=191D20&style=for-the-badge" /></a>&nbsp;<small><strong>(subscribe)</strong> To tech talks & #OneDevMinute videos</small></p>
    <p><a href="https://AhmadAwais.com/"><img alt="Blog: AhmadAwais.com" align="center" src="https://img.shields.io/badge/MY%20BLOG-gray.svg?colorB=191D20&style=for-the-badge" /></a>&nbsp;<small><strong>(read)</strong> In-depth & long form technical articles</small></p>
    <p><a href="https://www.linkedin.com/in/_AhmadAwais/"><img alt="LinkedIn @_AhmadAwais" align="center" src="https://img.shields.io/badge/LINKEDIN-gray.svg?colorB=191D20&style=for-the-badge" /></a>&nbsp;<small><strong>(connect)</strong> On the LinkedIn profile y'all</small></p>
</div>
