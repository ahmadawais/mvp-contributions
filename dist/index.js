#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/.pnpm/tsup@8.5.1_postcss@8.5.6_tsx@4.20.6_typescript@5.9.3/node_modules/tsup/assets/esm_shims.js
import path from "path";
import { fileURLToPath } from "url";
var init_esm_shims = __esm({
  "node_modules/.pnpm/tsup@8.5.1_postcss@8.5.6_tsx@4.20.6_typescript@5.9.3/node_modules/tsup/assets/esm_shims.js"() {
    "use strict";
  }
});

// src/utils/banner.ts
import chalk from "chalk";
var banner;
var init_banner = __esm({
  "src/utils/banner.ts"() {
    "use strict";
    init_esm_shims();
    banner = () => {
      console.log(
        chalk.hex("#00BCF2")(`
\u2588\u2580\u2584\u2580\u2588 \u2580\u2588\u2591\u2588\u2580 \u2588\u2580\u2588
\u2588\u2591\u2580\u2591\u2588 \u2591\u2588\u2584\u2588\u2591 \u2588\u2580\u2580

Contributions CLI
by Ahmad Awais

        `)
      );
    };
  }
});

// src/utils/auth.ts
import Conf from "conf";
var config, getToken, getProfileId, setToken, setProfileId, hasCredentials, clearCredentials;
var init_auth = __esm({
  "src/utils/auth.ts"() {
    "use strict";
    init_esm_shims();
    config = new Conf({
      projectName: "mvp-activity",
      projectSuffix: ""
    });
    getToken = () => {
      return config.get("mvpAccessToken");
    };
    getProfileId = () => {
      return config.get("mvpProfileId");
    };
    setToken = (token) => {
      config.set("mvpAccessToken", token);
    };
    setProfileId = (profileId) => {
      config.set("mvpProfileId", profileId);
    };
    hasCredentials = () => {
      return !!getToken() && !!getProfileId();
    };
    clearCredentials = () => {
      config.delete("mvpAccessToken");
      config.delete("mvpProfileId");
    };
  }
});

// src/utils/api.ts
var MVP_API_BASE, submitActivity;
var init_api = __esm({
  "src/utils/api.ts"() {
    "use strict";
    init_esm_shims();
    init_auth();
    MVP_API_BASE = "https://mavenapi-prod.azurewebsites.net/api";
    submitActivity = async (activity) => {
      const token = getToken();
      const profileId = getProfileId();
      if (!token || !profileId) {
        throw new Error("MVP credentials not configured. Please run the setup command first.");
      }
      const payload = {
        id: 0,
        activityTypeName: activity.activityTypeName,
        typeName: activity.activityTypeName,
        date: new Date(activity.date).toISOString(),
        description: activity.description,
        privateDescription: activity.privateDescription || activity.description,
        isPrivate: activity.isPrivate || false,
        targetAudience: activity.targetAudience,
        tenant: "MVP",
        title: activity.title,
        url: activity.url,
        userProfileId: parseInt(profileId, 10),
        technologyFocusArea: activity.technologyFocusArea,
        additionalTechnologyAreas: activity.additionalTechnologyAreas || [activity.technologyFocusArea],
        imageUrl: activity.imageUrl || "",
        reach: activity.reach,
        quantity: activity.quantity,
        ...activity.activityTypeName === "Webinar/Online Training/Video/Livestream" && {
          liveStreamViews: activity.liveStreamViews,
          onDemandViews: activity.onDemandViews,
          numberOfSessions: activity.numberOfSessions,
          inPersonAttendees: 0,
          subscriberBase: 0,
          numberOfViews: 0
        },
        ...activity.activityTypeName === "Blog" && {
          numberOfViews: activity.numberOfViews,
          subscriberBase: activity.subscriberBase || 0,
          liveStreamViews: 0,
          onDemandViews: 0,
          numberOfSessions: 0,
          inPersonAttendees: 0
        },
        ...activity.activityTypeName === "Article" && {
          numberOfViews: activity.numberOfViews,
          subscriberBase: activity.subscriberBase || 0,
          liveStreamViews: 0,
          onDemandViews: 0,
          numberOfSessions: 0,
          inPersonAttendees: 0
        },
        ...activity.activityTypeName === "Podcast" && {
          numberOfViews: activity.numberOfListens,
          subscriberBase: activity.subscriberBase || 0,
          liveStreamViews: 0,
          onDemandViews: 0,
          numberOfSessions: 0,
          inPersonAttendees: 0
        },
        ...(activity.activityTypeName === "Speaker/Presenter at Microsoft event" || activity.activityTypeName === "Speaker/Presenter at Third-party event") && {
          inPersonAttendees: activity.inPersonAttendees,
          numberOfSessions: activity.numberOfSessions,
          liveStreamViews: activity.liveStreamViews,
          onDemandViews: activity.onDemandViews,
          subscriberBase: 0,
          numberOfViews: 0
        }
      };
      const response = await fetch(`${MVP_API_BASE}/Activities/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Referer: "https://mvp.microsoft.com/",
          Origin: "https://mvp.microsoft.com",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:143.0) Gecko/20100101 Firefox/143.0",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5"
        },
        body: JSON.stringify({ activity: payload })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`MVP API error (${response.status}): ${errorText}`);
      }
      return response.json();
    };
  }
});

// src/utils/parse-curl.ts
var parseCurl;
var init_parse_curl = __esm({
  "src/utils/parse-curl.ts"() {
    "use strict";
    init_esm_shims();
    parseCurl = (curlCommand) => {
      let token = "";
      let profileId = "";
      const cleanedCurl = curlCommand.replace(/\\\n/g, " ").replace(/\s+/g, " ").trim();
      const authMatch = cleanedCurl.match(/authorization:\s*Bearer\s+([^\s'"\\]+)/i);
      if (authMatch) {
        token = authMatch[1];
      }
      if (!token) {
        const hMatch = cleanedCurl.match(/-H\s+['"]authorization:\s*Bearer\s+([^'"]+)['"]/i);
        if (hMatch) {
          token = hMatch[1];
        }
      }
      const dataRawMatch = cleanedCurl.match(/--data-raw\s+['"](.+?)['"]\s*$/s);
      if (dataRawMatch) {
        try {
          const jsonStr = dataRawMatch[1].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
          const data = JSON.parse(jsonStr);
          if (data.activity && data.activity.userProfileId) {
            profileId = data.activity.userProfileId.toString();
          }
        } catch (e) {
        }
      }
      if (!profileId) {
        const dataMatch = cleanedCurl.match(/--data(?:-raw)?\s+['"](.+?)['"]/s);
        if (dataMatch) {
          try {
            const jsonStr = dataMatch[1].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
            const data = JSON.parse(jsonStr);
            if (data.activity && data.activity.userProfileId) {
              profileId = data.activity.userProfileId.toString();
            }
          } catch (e) {
          }
        }
      }
      if (!profileId) {
        const jsonMatch = cleanedCurl.match(/\{[^}]*"activity"[^}]*"userProfileId"\s*:\s*(\d+)/);
        if (jsonMatch) {
          profileId = jsonMatch[1];
        }
      }
      if (!profileId) {
        const jsonObjectMatch = cleanedCurl.match(/(\{.*"userProfileId"\s*:\s*\d+.*\})/s);
        if (jsonObjectMatch) {
          try {
            const jsonStr = jsonObjectMatch[1].replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
            const data = JSON.parse(jsonStr);
            if (data.activity && data.activity.userProfileId) {
              profileId = data.activity.userProfileId.toString();
            } else if (data.userProfileId) {
              profileId = data.userProfileId.toString();
            }
          } catch (e) {
          }
        }
      }
      if (!token) {
        throw new Error("Could not find authorization token in cURL command. Make sure you copied the entire command including headers.");
      }
      if (!profileId) {
        throw new Error("Could not find userProfileId in cURL command. Make sure the request includes the activity data.");
      }
      return { token, profileId };
    };
  }
});

// src/commands/login.ts
var login_exports = {};
__export(login_exports, {
  login: () => login
});
import * as clack from "@clack/prompts";
import chalk2 from "chalk";
import { exec } from "child_process";
import { promisify } from "util";
import * as readline from "readline";
var execAsync, login;
var init_login = __esm({
  "src/commands/login.ts"() {
    "use strict";
    init_esm_shims();
    init_auth();
    init_banner();
    init_parse_curl();
    execAsync = promisify(exec);
    login = async () => {
      banner();
      clack.intro(chalk2.hex("#00BCF2")("LOGIN TO MVP"));
      const currentToken = getToken();
      const currentProfileId = getProfileId();
      if (currentToken && currentProfileId) {
        clack.log.success("Current credentials found");
        clack.log.info(`Profile ID: ${currentProfileId}`);
        clack.log.info(`Token: ${currentToken.substring(0, 20)}...`);
        const shouldUpdate = await clack.confirm({
          message: "Do you want to update your credentials?"
        });
        if (clack.isCancel(shouldUpdate) || !shouldUpdate) {
          clack.cancel("Operation cancelled.");
          process.exit(0);
        }
      }
      clack.log.step("Step 1: Login to MVP Portal");
      clack.note(
        "We'll open https://mvp.microsoft.com in your browser.\nPlease login with your account.",
        "Instructions"
      );
      const shouldOpenBrowser = await clack.confirm({
        message: "Open MVP portal in browser now?"
      });
      if (clack.isCancel(shouldOpenBrowser)) {
        clack.cancel("Operation cancelled.");
        process.exit(0);
      }
      if (shouldOpenBrowser) {
        try {
          await execAsync("open https://mvp.microsoft.com/en-US/account/");
          clack.log.success("Browser opened!");
        } catch (error) {
          clack.log.warn("Could not open browser automatically");
          console.log(
            chalk2.dim("  Open manually: https://mvp.microsoft.com/en-US/account/")
          );
        }
      }
      console.log("");
      const isLoggedIn = await clack.confirm({
        message: "Have you logged in to the MVP portal?"
      });
      if (clack.isCancel(isLoggedIn) || !isLoggedIn) {
        clack.cancel("Please login first and try again.");
        process.exit(0);
      }
      clack.log.step("Step 2: Go to Add Activity Page");
      clack.note(
        'From the left nav, Click on "Activities" then "Add Activity"',
        "Instructions"
      );
      const onAddActivityPage = await clack.confirm({
        message: "Are you on the Add activity page?"
      });
      if (clack.isCancel(onAddActivityPage) || !onAddActivityPage) {
        clack.cancel("Please navigate to Add activity page and try again.");
        process.exit(0);
      }
      clack.log.step("Step 3: Open DevTools Network Tab");
      clack.note(
        '1. Open DevTools (Cmd+Option+I on Mac or Right click [Inspect])\n2. Click on the "Network" tab',
        "Instructions"
      );
      const devToolsReady = await clack.confirm({
        message: "Is the Network tab open in DevTools?"
      });
      if (clack.isCancel(devToolsReady) || !devToolsReady) {
        clack.cancel("Please open DevTools Network tab and try again.");
        process.exit(0);
      }
      clack.log.step("Step 4: Trigger an API Request");
      clack.note(
        "1. Fill in any field (title, description, etc.)\n2. This will trigger a network request",
        "Instructions"
      );
      const activityFilled = await clack.confirm({
        message: "Have you filled in a field in the activity form?"
      });
      if (clack.isCancel(activityFilled) || !activityFilled) {
        clack.cancel("Please fill in a field and try again.");
        process.exit(0);
      }
      clack.log.step("Step 5: Copy as cURL");
      clack.note(
        `1. In the Network tab, find the request named "Activities/"
   (or to "https://mavenapi-prod.azurewebsites.net/api/Activities/")
2. Right-click on it
3. Select "Copy" \u2192 "Copy as cURL"

\u{1F4A1} We'll automatically extract your token and profile ID from this`,
        "Instructions"
      );
      let success = false;
      let attempts = 0;
      const maxAttempts = 3;
      while (!success && attempts < maxAttempts) {
        attempts++;
        if (attempts > 1) {
          console.log("");
          console.log(chalk2.yellow(`Attempt ${attempts} of ${maxAttempts}`));
        }
        console.log("");
        console.log(chalk2.yellow("\u26A0\uFE0F  Important: Paste the ENTIRE cURL command (it will be very long)"));
        console.log(chalk2.dim("   After pasting, press Enter TWICE to submit"));
        console.log("");
        const curlInput = await new Promise((resolve) => {
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });
          console.log(chalk2.dim("\u25C6 Paste the cURL command here (press Enter TWICE when done):"));
          console.log("");
          let buffer = "";
          let emptyLineCount = 0;
          rl.on("line", (line) => {
            if (line.trim() === "") {
              emptyLineCount++;
              if (emptyLineCount >= 2 && buffer.length > 0) {
                rl.close();
              }
            } else {
              emptyLineCount = 0;
              buffer += line + " ";
            }
          });
          rl.on("close", () => {
            resolve(buffer.trim());
          });
        });
        console.log("");
        console.log(chalk2.dim("\u2713 Input received, parsing..."));
        console.log("");
        if (!curlInput || curlInput.length < 50) {
          clack.log.error("No input received or input too short");
          console.log("");
          console.log(chalk2.yellow("  \u{1F4A1} Make sure you:"));
          console.log(chalk2.yellow("     - Pasted the entire cURL command"));
          console.log(chalk2.yellow("     - Pressed Enter TWICE after pasting"));
          console.log("");
          if (attempts < maxAttempts) {
            console.log(chalk2.cyan("  Let's try again..."));
            continue;
          } else {
            process.exit(1);
          }
        }
        try {
          const { token, profileId } = parseCurl(curlInput);
          console.log("");
          clack.log.success("Successfully extracted credentials!");
          console.log(chalk2.dim(`  Token: ${token.substring(0, 30)}...`));
          console.log(chalk2.dim(`  Profile ID: ${profileId}`));
          console.log("");
          setToken(token);
          setProfileId(profileId);
          console.log("");
          clack.log.info("Credentials stored securely at:");
          console.log(chalk2.dim("  ~/.config/mvp-activity/config.json"));
          console.log("");
          clack.outro(
            chalk2.green("\u2713 Login successful! You can now submit MVP contributions.")
          );
          success = true;
        } catch (error) {
          console.log("");
          clack.log.error(
            chalk2.red(
              `Failed to parse cURL command: ${error instanceof Error ? error.message : "Unknown error"}`
            )
          );
          console.log("");
          const tryManual = await clack.confirm({
            message: "Would you like to enter the token and profile ID manually instead?"
          });
          if (clack.isCancel(tryManual)) {
            clack.cancel("Operation cancelled.");
            process.exit(0);
          }
          if (tryManual) {
            console.log("");
            clack.log.step("Manual Entry Mode");
            clack.note(
              '1. In DevTools Network tab, find the "Activities" request\n2. Click on it and go to the "Headers" tab\n3. Scroll to "Request Headers"\n4. Find "authorization: Bearer <very-long-token>"\n5. Copy everything AFTER "Bearer " (the token)',
              "How to find your token"
            );
            const manualToken = await clack.text({
              message: "Paste your Bearer token here",
              placeholder: "eyJhbGciOiJSU0EtT0FFUCIsImVuYy...",
              validate: (value) => {
                if (!value) return "Token is required";
                if (value.length < 100) return "Token seems too short";
              }
            });
            if (clack.isCancel(manualToken)) {
              clack.cancel("Operation cancelled.");
              process.exit(0);
            }
            console.log("");
            clack.note(
              '1. In the same request, click on the "Payload" tab\n2. Look for "userProfileId": 303014 (your number will be different)\n3. Copy just the number',
              "How to find your Profile ID"
            );
            const manualProfileId = await clack.text({
              message: "Enter your Profile ID",
              placeholder: "303014",
              validate: (value) => {
                if (!value) return "Profile ID is required";
                if (isNaN(Number(value))) return "Profile ID must be a number";
              }
            });
            if (clack.isCancel(manualProfileId)) {
              clack.cancel("Operation cancelled.");
              process.exit(0);
            }
            const cleanToken = manualToken.trim().replace(/^Bearer\s+/i, "");
            console.log("");
            clack.log.success("Credentials received!");
            console.log(chalk2.dim(`  Token: ${cleanToken.substring(0, 30)}...`));
            console.log(chalk2.dim(`  Profile ID: ${manualProfileId}`));
            console.log("");
            setToken(cleanToken);
            setProfileId(manualProfileId);
            console.log("");
            clack.log.info("Credentials stored securely at:");
            console.log(chalk2.dim("  ~/.config/mvp-activity/config.json"));
            console.log("");
            clack.outro(
              chalk2.green("\u2713 Login successful! You can now submit MVP contributions.")
            );
            success = true;
          } else if (attempts < maxAttempts) {
            console.log("");
            console.log(chalk2.cyan("  Let's try the cURL method again..."));
          } else {
            console.log("");
            console.log(chalk2.red("  Maximum attempts reached. Please try running the login command again."));
            process.exit(1);
          }
        }
      }
    };
  }
});

// src/commands/add.ts
var add_exports = {};
__export(add_exports, {
  add: () => add
});
import * as clack2 from "@clack/prompts";
import chalk3 from "chalk";
import ora from "ora";
var ACTIVITY_TYPES, TARGET_AUDIENCES, ROLES, TECH_AREAS, add;
var init_add = __esm({
  "src/commands/add.ts"() {
    "use strict";
    init_esm_shims();
    init_banner();
    init_api();
    init_auth();
    ACTIVITY_TYPES = [
      "Blog",
      "Book/E-book",
      "Article",
      "Podcast",
      "Webinar/Online Training/Video/Livestream",
      "Content Feedback and Editing",
      "Online Support",
      "Open Source/Project/Sample code/Tools",
      "Product Feedback",
      "Mentorship/Coaching",
      "Speaker/Presenter at Microsoft event",
      "Speaker/Presenter at Third-party event",
      "User Group Owner"
    ];
    TARGET_AUDIENCES = [
      "Developer",
      "Student",
      "IT Pro",
      "Technical Decision Maker",
      "Business Decision Maker",
      "End User"
    ];
    ROLES = [
      "Host",
      "Presenter",
      "Speaker",
      "Panelist",
      "Author",
      "Contributor",
      "Moderator",
      "Organizer",
      "Mentor",
      "Reviewer"
    ];
    TECH_AREAS = [
      "Web Development",
      "Cloud & AI",
      "Developer Tools",
      "Data & Analytics",
      "Mobile Development",
      "DevOps",
      "Security",
      "IoT",
      "Mixed Reality",
      "Gaming",
      "Business Applications",
      "Other"
    ];
    add = async (options) => {
      const isInteractive = options.interactive !== false;
      if (!hasCredentials()) {
        if (isInteractive) {
          banner();
          clack2.intro(chalk3.hex("#00BCF2")("NOT LOGGED IN"));
          clack2.log.warn("You need to login first to submit MVP contributions.");
          const shouldLogin = await clack2.confirm({
            message: "Would you like to login now?"
          });
          if (clack2.isCancel(shouldLogin) || !shouldLogin) {
            clack2.cancel("Operation cancelled.");
            process.exit(0);
          }
          const { login: login2 } = await Promise.resolve().then(() => (init_login(), login_exports));
          await login2();
          console.log("");
          clack2.log.success("Great! Now let's add your contribution.");
          console.log("");
        } else {
          console.error(
            chalk3.red(
              'Error: MVP credentials not configured. Please run "mvp-activity login" first.'
            )
          );
          process.exit(1);
        }
      }
      if (isInteractive) {
        banner();
        clack2.intro(chalk3.hex("#00BCF2")("ADD MVP CONTRIBUTION"));
        clack2.log.info(
          "Submit your Microsoft MVP activities - videos, blogs, speaking engagements, and more."
        );
      }
      let type = options.type;
      let url = options.url || "";
      let date = options.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      let title = options.title || "";
      let description = options.description || "";
      if (isInteractive) {
        const typeInput = await clack2.select({
          message: "Select activity type",
          options: ACTIVITY_TYPES.map((t) => ({ value: t, label: t }))
        });
        if (clack2.isCancel(typeInput)) {
          clack2.cancel("Operation cancelled.");
          process.exit(0);
        }
        type = typeInput;
        const titleInput = await clack2.text({
          message: "Enter title",
          placeholder: "My awesome contribution...",
          validate: (value) => {
            if (!value) return "Title is required";
            if (value.length > 100) return "Title must be 100 characters or less";
          }
        });
        if (clack2.isCancel(titleInput)) {
          clack2.cancel("Operation cancelled.");
          process.exit(0);
        }
        title = titleInput;
        const descriptionInput = await clack2.text({
          message: "Enter description",
          placeholder: "Detailed description of your contribution...",
          validate: (value) => {
            if (!value) return "Description is required";
            if (value.length > 1e3) return "Description must be 1000 characters or less";
          }
        });
        if (clack2.isCancel(descriptionInput)) {
          clack2.cancel("Operation cancelled.");
          process.exit(0);
        }
        description = descriptionInput;
        const urlInput = await clack2.text({
          message: "Enter URL",
          placeholder: "https://...",
          validate: (value) => {
            if (!value) return "URL is required";
            if (!value.startsWith("http")) {
              return "URL must start with http:// or https://";
            }
          }
        });
        if (clack2.isCancel(urlInput)) {
          clack2.cancel("Operation cancelled.");
          process.exit(0);
        }
        url = urlInput;
        const dateInput = await clack2.text({
          message: "Enter date (YYYY-MM-DD)",
          initialValue: date,
          validate: (value) => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
              return "Date must be in YYYY-MM-DD format";
            }
          }
        });
        if (clack2.isCancel(dateInput)) {
          clack2.cancel("Operation cancelled.");
          process.exit(0);
        }
        date = dateInput;
        const audienceInput = await clack2.multiselect({
          message: "Select target audience (space to select, enter to confirm)",
          options: TARGET_AUDIENCES.map((a) => ({ value: a, label: a })),
          required: true
        });
        if (clack2.isCancel(audienceInput)) {
          clack2.cancel("Operation cancelled.");
          process.exit(0);
        }
        const targetAudience = audienceInput;
        const roleInput = await clack2.select({
          message: "Select your role",
          options: ROLES.map((r) => ({ value: r, label: r }))
        });
        if (clack2.isCancel(roleInput)) {
          clack2.cancel("Operation cancelled.");
          process.exit(0);
        }
        const role = roleInput;
        const techAreaInput = await clack2.select({
          message: "Select technology focus area",
          options: TECH_AREAS.map((t) => ({ value: t, label: t }))
        });
        if (clack2.isCancel(techAreaInput)) {
          clack2.cancel("Operation cancelled.");
          process.exit(0);
        }
        const technologyFocusArea = techAreaInput;
        let activity;
        if (type === "Webinar/Online Training/Video/Livestream") {
          const liveStreamViewsInput = await clack2.text({
            message: "Enter livestream views (optional)",
            placeholder: "0",
            validate: (value) => {
              if (value && isNaN(Number(value))) return "Must be a number";
            }
          });
          if (clack2.isCancel(liveStreamViewsInput)) {
            clack2.cancel("Operation cancelled.");
            process.exit(0);
          }
          const onDemandViewsInput = await clack2.text({
            message: "Enter on-demand views (optional)",
            placeholder: "0",
            validate: (value) => {
              if (value && isNaN(Number(value))) return "Must be a number";
            }
          });
          if (clack2.isCancel(onDemandViewsInput)) {
            clack2.cancel("Operation cancelled.");
            process.exit(0);
          }
          const sessionsInput = await clack2.text({
            message: "Enter number of sessions (optional)",
            placeholder: "1",
            validate: (value) => {
              if (value && isNaN(Number(value))) return "Must be a number";
            }
          });
          if (clack2.isCancel(sessionsInput)) {
            clack2.cancel("Operation cancelled.");
            process.exit(0);
          }
          activity = {
            activityTypeName: "Webinar/Online Training/Video/Livestream",
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
          };
        } else if (type === "Blog") {
          const viewsInput = await clack2.text({
            message: "Enter number of views (optional)",
            placeholder: "0",
            validate: (value) => {
              if (value && isNaN(Number(value))) return "Must be a number";
            }
          });
          if (clack2.isCancel(viewsInput)) {
            clack2.cancel("Operation cancelled.");
            process.exit(0);
          }
          const subscribersInput = await clack2.text({
            message: "Enter subscriber base (optional)",
            placeholder: "0",
            validate: (value) => {
              if (value && isNaN(Number(value))) return "Must be a number";
            }
          });
          if (clack2.isCancel(subscribersInput)) {
            clack2.cancel("Operation cancelled.");
            process.exit(0);
          }
          activity = {
            activityTypeName: "Blog",
            title,
            description,
            url,
            date,
            targetAudience,
            role,
            technologyFocusArea,
            numberOfViews: viewsInput ? Number(viewsInput) : 0,
            subscriberBase: subscribersInput ? Number(subscribersInput) : 0
          };
        } else if (type === "Article") {
          const viewsInput = await clack2.text({
            message: "Enter number of views (optional)",
            placeholder: "0",
            validate: (value) => {
              if (value && isNaN(Number(value))) return "Must be a number";
            }
          });
          if (clack2.isCancel(viewsInput)) {
            clack2.cancel("Operation cancelled.");
            process.exit(0);
          }
          const subscribersInput = await clack2.text({
            message: "Enter subscriber base (optional)",
            placeholder: "0",
            validate: (value) => {
              if (value && isNaN(Number(value))) return "Must be a number";
            }
          });
          if (clack2.isCancel(subscribersInput)) {
            clack2.cancel("Operation cancelled.");
            process.exit(0);
          }
          activity = {
            activityTypeName: "Article",
            title,
            description,
            url,
            date,
            targetAudience,
            role,
            technologyFocusArea,
            numberOfViews: viewsInput ? Number(viewsInput) : 0,
            subscriberBase: subscribersInput ? Number(subscribersInput) : 0
          };
        } else if (type === "Podcast") {
          const listensInput = await clack2.text({
            message: "Enter number of listens (optional)",
            placeholder: "0",
            validate: (value) => {
              if (value && isNaN(Number(value))) return "Must be a number";
            }
          });
          if (clack2.isCancel(listensInput)) {
            clack2.cancel("Operation cancelled.");
            process.exit(0);
          }
          const subscribersInput = await clack2.text({
            message: "Enter subscriber base (optional)",
            placeholder: "0",
            validate: (value) => {
              if (value && isNaN(Number(value))) return "Must be a number";
            }
          });
          if (clack2.isCancel(subscribersInput)) {
            clack2.cancel("Operation cancelled.");
            process.exit(0);
          }
          activity = {
            activityTypeName: "Podcast",
            title,
            description,
            url,
            date,
            targetAudience,
            role,
            technologyFocusArea,
            numberOfListens: listensInput ? Number(listensInput) : 0,
            subscriberBase: subscribersInput ? Number(subscribersInput) : 0
          };
        } else if (type === "Speaker/Presenter at Microsoft event" || type === "Speaker/Presenter at Third-party event") {
          const attendeesInput = await clack2.text({
            message: "Enter in-person attendees (optional)",
            placeholder: "0",
            validate: (value) => {
              if (value && isNaN(Number(value))) return "Must be a number";
            }
          });
          if (clack2.isCancel(attendeesInput)) {
            clack2.cancel("Operation cancelled.");
            process.exit(0);
          }
          const liveStreamViewsInput = await clack2.text({
            message: "Enter livestream views (optional)",
            placeholder: "0",
            validate: (value) => {
              if (value && isNaN(Number(value))) return "Must be a number";
            }
          });
          if (clack2.isCancel(liveStreamViewsInput)) {
            clack2.cancel("Operation cancelled.");
            process.exit(0);
          }
          const onDemandViewsInput = await clack2.text({
            message: "Enter on-demand views (optional)",
            placeholder: "0",
            validate: (value) => {
              if (value && isNaN(Number(value))) return "Must be a number";
            }
          });
          if (clack2.isCancel(onDemandViewsInput)) {
            clack2.cancel("Operation cancelled.");
            process.exit(0);
          }
          const sessionsInput = await clack2.text({
            message: "Enter number of sessions (optional)",
            placeholder: "1",
            validate: (value) => {
              if (value && isNaN(Number(value))) return "Must be a number";
            }
          });
          if (clack2.isCancel(sessionsInput)) {
            clack2.cancel("Operation cancelled.");
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
          };
        } else {
          clack2.log.warn(
            `Activity type "${type}" is not yet fully supported. Only Webinar/Video, Blog, Article, Podcast, and Speaking activities are currently implemented.`
          );
          clack2.cancel("Operation cancelled.");
          process.exit(0);
        }
        const shouldSubmit = await clack2.confirm({
          message: "Submit this contribution to Microsoft MVP?"
        });
        if (clack2.isCancel(shouldSubmit) || !shouldSubmit) {
          clack2.cancel("Operation cancelled.");
          process.exit(0);
        }
        const spinner = ora("Submitting activity to Microsoft MVP...").start();
        try {
          const result = await submitActivity(activity);
          spinner.succeed("Activity submitted successfully!");
          clack2.outro(
            chalk3.green(
              `\u2713 Activity submitted! ID: ${result.id || "Success"}`
            )
          );
        } catch (error) {
          spinner.fail("Failed to submit activity");
          clack2.log.error(
            chalk3.red(
              `Error: ${error instanceof Error ? error.message : "Unknown error"}`
            )
          );
          process.exit(1);
        }
      } else {
        if (!type || !title || !description || !url || !date) {
          console.error(
            chalk3.red(
              "Error: --type, --title, --description, --url, and --date are required in non-interactive mode"
            )
          );
          process.exit(1);
        }
        if (!options.audience || !options.role || !options.techArea) {
          console.error(
            chalk3.red(
              "Error: --audience, --role, and --tech-area are required in non-interactive mode"
            )
          );
          process.exit(1);
        }
        const targetAudience = options.audience.split(",").map((a) => a.trim());
        const role = options.role;
        const technologyFocusArea = options.techArea;
        let activity;
        if (type === "Webinar/Online Training/Video/Livestream") {
          activity = {
            activityTypeName: "Webinar/Online Training/Video/Livestream",
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
          };
        } else if (type === "Blog") {
          activity = {
            activityTypeName: "Blog",
            title,
            description,
            url,
            date,
            targetAudience,
            role,
            technologyFocusArea,
            numberOfViews: options.views ? Number(options.views) : 0,
            subscriberBase: options.subscribers ? Number(options.subscribers) : 0
          };
        } else if (type === "Article") {
          activity = {
            activityTypeName: "Article",
            title,
            description,
            url,
            date,
            targetAudience,
            role,
            technologyFocusArea,
            numberOfViews: options.views ? Number(options.views) : 0,
            subscriberBase: options.subscribers ? Number(options.subscribers) : 0
          };
        } else if (type === "Podcast") {
          activity = {
            activityTypeName: "Podcast",
            title,
            description,
            url,
            date,
            targetAudience,
            role,
            technologyFocusArea,
            numberOfListens: options.listens ? Number(options.listens) : 0,
            subscriberBase: options.subscribers ? Number(options.subscribers) : 0
          };
        } else if (type === "Speaker/Presenter at Microsoft event" || type === "Speaker/Presenter at Third-party event") {
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
          };
        } else {
          console.error(
            chalk3.red(
              `Activity type "${type}" is not yet fully supported. Only Webinar/Video, Blog, Article, Podcast, and Speaking activities are currently implemented.`
            )
          );
          process.exit(1);
        }
        const spinner = ora("Submitting activity to Microsoft MVP...").start();
        try {
          const result = await submitActivity(activity);
          spinner.succeed("Activity submitted successfully!");
          console.log(chalk3.green(`\u2713 Activity submitted! ID: ${result.id || "Success"}`));
        } catch (error) {
          spinner.fail("Failed to submit activity");
          console.error(
            chalk3.red(
              `Error: ${error instanceof Error ? error.message : "Unknown error"}`
            )
          );
          process.exit(1);
        }
      }
    };
  }
});

// src/commands/logout.ts
var logout_exports = {};
__export(logout_exports, {
  logout: () => logout
});
import * as clack3 from "@clack/prompts";
import chalk4 from "chalk";
var logout;
var init_logout = __esm({
  "src/commands/logout.ts"() {
    "use strict";
    init_esm_shims();
    init_banner();
    init_auth();
    logout = async () => {
      banner();
      clack3.intro(chalk4.hex("#00BCF2")("LOGOUT FROM MVP"));
      if (!hasCredentials()) {
        clack3.log.warn("No credentials found. You are already logged out.");
        clack3.outro(chalk4.dim("Nothing to do."));
        process.exit(0);
      }
      const shouldLogout = await clack3.confirm({
        message: "Are you sure you want to logout and delete your credentials?"
      });
      if (clack3.isCancel(shouldLogout) || !shouldLogout) {
        clack3.cancel("Operation cancelled.");
        process.exit(0);
      }
      clearCredentials();
      clack3.outro(chalk4.green("\u2713 Logged out successfully! Credentials deleted."));
    };
  }
});

// src/index.ts
init_esm_shims();
init_banner();
import { Command } from "commander";
import { readFileSync } from "fs";
import { fileURLToPath as fileURLToPath2 } from "url";
import { dirname, join } from "path";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname(__filename2);
var packageJson = JSON.parse(
  readFileSync(join(__dirname2, "../package.json"), "utf-8")
);
var program = new Command();
program.name("mvp-activity").description("Submit your Microsoft MVP contributions with ease").version(packageJson.version, "-v, --version", "output the version number").helpOption("-h, --help", "display help for command");
program.command("add").alias("a").description("Add a new MVP contribution (interactive by default)").option("-t, --type <type>", "activity type").option("-u, --url <url>", "activity URL").option("-d, --date <date>", "activity date (YYYY-MM-DD)", (/* @__PURE__ */ new Date()).toISOString().split("T")[0]).option("-T, --title <title>", "activity title").option("-D, --description <description>", "activity description").option("-a, --audience <audience>", "target audience (comma-separated: Developer,Student,IT Pro)").option("-r, --role <role>", "your role (Speaker,Author,Host,etc.)").option("--tech-area <area>", "technology focus area").option("--attendees <number>", "in-person attendees (for speaking)").option("--live-views <number>", "livestream views").option("--on-demand-views <number>", "on-demand views").option("--sessions <number>", "number of sessions").option("--views <number>", "number of views (for blog/article)").option("--subscribers <number>", "subscriber base").option("--listens <number>", "number of listens (for podcast)").option("-x, --no-interactive", "disable interactive mode").action(async (options) => {
  const { add: add2 } = await Promise.resolve().then(() => (init_add(), add_exports));
  await add2(options);
});
program.command("login").alias("l").description("Login with MVP credentials (access token and profile ID)").action(async () => {
  const { login: login2 } = await Promise.resolve().then(() => (init_login(), login_exports));
  await login2();
});
program.command("logout").description("Logout and delete stored credentials").action(async () => {
  const { logout: logout2 } = await Promise.resolve().then(() => (init_logout(), logout_exports));
  await logout2();
});
if (process.argv.length === 2) {
  banner();
  program.help();
}
program.parse();
//# sourceMappingURL=index.js.map