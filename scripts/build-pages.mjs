import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// GitHub's configure-pages action supplies the path, including an empty string
// for user sites or custom domains. Local builds default to this repository.
const basePath = process.env.PAGES_BASE_PATH ?? "/crystal-city";
const result = spawnSync(
  process.execPath,
  [fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url)), "build", "--webpack"],
  {
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    stdio: "inherit",
    env: {
      ...process.env,
      GITHUB_PAGES: "true",
      NEXT_PUBLIC_BASE_PATH: basePath,
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
);
if (result.error) throw result.error;
if (result.signal) process.kill(process.pid, result.signal);
if (result.status !== 0) process.exit(result.status ?? 1);

writeFileSync(new URL("../out/.nojekyll", import.meta.url), "");
