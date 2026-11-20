# Testing instructions

## Browser tests for prosocial reactions

The Playwright suite tests the real web picker and persists an Insight reaction
on a dedicated post before removing it. It runs in desktop Chromium, mobile
Chromium, and iPhone-sized WebKit emulation. Use a disposable test account and post; the suite writes to
the configured service. Keep the session file outside version control.

1. Start the local web app (`pnpm web`) or choose a staging URL.
2. Run `pnpm exec playwright codegen --save-storage=.playwright/auth.json
   <app-origin>`, sign in manually in that window, then close it. The saved
   file contains session credentials and is ignored by Git.
3. Set `SPARKABLE_BROWSER_BASE_URL` to the app origin,
   `SPARKABLE_BROWSER_POST_URL` to the dedicated post URL, and
   `SPARKABLE_BROWSER_STORAGE_STATE` to the JSON file path.
4. Run `pnpm test:browser`. Install the browsers first with
   `pnpm exec playwright install chromium webkit` if needed.

For staging, use `https://sparkable-staging.up.railway.app` as the app origin.
Set `SPARKABLE_BROWSER_POST_URL` to a post owned by a dedicated test account,
and run `pnpm test:browser --project=mobile-webkit` for the WebKit check alone.

### Run from GitHub Actions

The `Staging browser tests` workflow runs automatically after Railway reports a
successful Sparkable staging deployment to GitHub. It checks out the deployed
commit, so the tests correspond to the version that is live. It ignores
production deployments and other deployment statuses.

1. In the Sparkable GitHub repository, create an environment named
   `staging-browser-tests` under **Settings → Environments**.
2. Add environment variables `SPARKABLE_TEST_HANDLE` (the dedicated test
   account handle) and `SPARKABLE_BROWSER_POST_URL` (the full URL of its
   dedicated test post).
3. Add an environment secret `SPARKABLE_TEST_PASSWORD` for that account. Enter
   it in GitHub's secret form; never put it in the repository or a chat message.
4. Merge the test code into `staging` and wait for Railway to deploy it. The
   successful deployment triggers the workflow automatically; inspect the run
   under **Actions → Staging browser tests**.

The workflow signs in afresh, runs the browser suite sequentially, uploads
failure screenshots, and removes the temporary session file. CI disables
Playwright network traces because they can contain session tokens. It fails if a required
variable or secret is missing. Keep the test post free of reactions from other
accounts so the count assertions remain predictable.

The suite skips when the post URL or session file is absent. Playwright WebKit
emulation catches engine-specific regressions but does not replace testing
Firefox or Safari on a physical iPhone.

Make sure you've copied `.env.example` to `.env.test` and provided any required
values.

Install dependencies in `/dev-env`

```
cd dev-env && pnpm i
```

## Using Maestro

1. Install Maestro by following [these instructions](https://maestro.mobile.dev/getting-started/installing-maestro). This will help us run the E2E tests.
2. You can write Maestro tests in `/.maestro/flows/` directory by creating a new `.yml` file or by modifying an existing one.
3. You can also use [Maestro Studio](https://maestro.mobile.dev/getting-started/maestro-studio) which automatically generates commands by recording your actions on the app. Therefore, you can create realistic tests without having to manually write any code. Use the `maestro studio` command to start recording your actions.

### Running on Android

You will need to allow your device access to the port that the mock server is running on.

```
adb reverse tcp:3000 tcp:3000
```

### Running Maestro tests

- In one tab, run `pnpm e2e:mock-server`
- In a second tab, run `pnpm e2e:build`
- In a third tab, run `pnpm e2e:run __e2e__`

## Nightly Maestro CI

The `Nightly Maestro E2E` GitHub Actions workflow runs every day at 04:00 UTC
and can also be started from the Actions tab with **Run workflow**. It runs iOS
and Android concurrently, but each platform runs all of `__e2e__/config.yml`
sequentially on one explicitly selected simulator or emulator. The flows share a
stateful mock-server manager, so the suite must not be sharded.

The jobs run Maestro CLI 2.6.1 locally on GitHub Actions; Maestro Cloud is not
used. iOS runs on `macos-26-xlarge` with Xcode 26.4. Android runs on
`Linux-x64-32core`. Both use Java 17 and the Node and pnpm versions declared in
`package.json`. The iOS job selects an iPhone 17 simulator running iOS 26.5;
Android directly provisions and boots a Pixel 6 AVD with the API 35 Google APIs
x86_64 image using the Android SDK command-line tools.
Both development clients use the `e2e` EAS profile and the same reusable local
EAS build action as the release build workflows; the resulting simulator app
and APK are installed directly on the selected devices.

The mock-server manager listens on host port 1986 and creates test services on
port 3000. Metro listens on 8081. Android reverses ports 3000 and 8081 into the
emulator; port 1986 remains host-side because Maestro JavaScript calls it from
the runner. Android uses the existing Docker Compose PostgreSQL 14 and Redis 7
services on ports 5433 and 6380. GitHub-hosted macOS cannot run nested Docker
virtualization, so iOS provisions ephemeral native PostgreSQL 14.x and Redis
7.4.7 on those same ports and starts `pnpm --dir dev-env start:external`.

Each platform uploads a `nightly-e2e-<platform>-<run-id>` artifact for 14 days.
It contains JUnit at `report.xml`, Maestro screenshots, videos, command metadata
and `maestro.log` under `maestro/`, plus Metro, native build, mock-server, service,
dependency, and translation logs. The workflow always uploads what was captured,
including when setup or the native build fails before Maestro starts.

Add the repository secret `E2E_FAILURES_SLACK_WEBHOOK` before enabling the
schedule. The aggregation job runs even when either platform fails and posts one
detailed Slack notification containing both job statuses, failed flow details or
the failed setup phase, the commit and workflow links, and links to both artifact
sets. Successful runs do not post to Slack.

Before relying on the schedule, manually dispatch the workflow and verify both
platforms against live Metro and `dev-env`, Android localhost routing, artifact
uploads on success and failure, one Slack message for a forced failure, and no
Slack message for an all-green run.

## Using Flashlight for Performance Testing
1. Make sure Maestro is installed (optional: only for automated testing) by following the instructions above
2. Install Flashlight by following [these instructions](https://docs.flashlight.dev/)
3. The simplest way to get started is by running `pnpm perf:measure` which will run a live preview of the performance test results. You can [see a demo here](https://github.com/bamlab/flashlight/assets/4534323/4038a342-f145-4c3b-8cde-17949bf52612)
4. The `pnpm perf:test:measure` will run the `scroll.yaml` test located in `__e2e__/maestro/scroll.yaml` and give the results in `.perf/results.json` which can be viewed by running `pnpm perf:results`
5. You can also run your own tests by running `pnpm perf:test <path_to_test>` where `<path_to_test>` is the path to your test file. For example, `pnpm perf:test __e2e__/maestro/scroll.yaml` will run the `scroll.yaml` test located in `__e2e__/maestro/scroll.yaml`.
