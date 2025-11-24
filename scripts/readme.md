# MVP Token Capture Script

This script helps you capture your Microsoft MVP access token and profile ID from the MVP portal.

## Usage

```bash
pnpm capture-token
```

## What it does

1. Opens your default browser to the MVP portal
2. Provides step-by-step instructions to capture the token from DevTools
3. Saves your token and profile ID securely using `conf`
4. No need to manually edit config files!

## How to get your token

1. Run `pnpm capture-token`
2. Log in to the MVP portal if not already logged in (https://mvp.microsoft.com)
3. Open DevTools (F12 or Cmd+Option+I)
4. Go to Network tab
5. Navigate to "Add activity" and fill any field
6. Find the request to `mavenapi-prod.azurewebsites.net`
7. Copy the Bearer token from the Authorization header
8. Paste it when prompted
9. Also paste your Profile ID when prompted

## Where to find Profile ID

In the same Network request, look at the request payload. You'll see:
```json
{
  "activity": {
    "userProfileId": 12345,
    ...
  }
}
```

Copy that number (e.g., `12345`).

## Security

- Token and Profile ID are stored locally using `conf`
- Stored in: `~/.config/mvp-activity/config.json`
- Never committed to version control
- Only used to authenticate with Microsoft MVP API
