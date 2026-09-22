// Starts the Express API and the Vite client together.
// Usage from the project root:  npm run dev
//
// No extra dependency is used, this only relies on Node's own
// child_process module.

const { spawn } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");

const tasks = [
  { name: "api", cwd: path.join(root, "server") },
  { name: "client", cwd: path.join(root, "client") },
];

function prefixOutput(name, data) {
  const lines = String(data)
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => `[${name}] ${line}\n`)
    .join("");

  process.stdout.write(lines);
}

function stopAll() {
  children.forEach((child) => {
    if (child.killed || child.exitCode !== null) {
      return;
    }

    if (process.platform === "win32") {
      // On Windows npm runs through a shell, so the whole tree has to be
      // stopped, otherwise the API keeps running in the background.
      spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
        stdio: "ignore",
      });
    } else {
      child.kill();
    }
  });
}

const children = tasks.map(({ name, cwd }) => {
  // Invoke npm.cmd directly on Windows. The PowerShell `npm` shim can point
  // at a stale global npm installation, which would leave the API unavailable.
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const child = spawn(npmCommand, ["run", "dev"], { cwd });

  child.stdout.on("data", (data) => prefixOutput(name, data));
  child.stderr.on("data", (data) => prefixOutput(name, data));

  child.on("exit", (code) => {
    console.log(`[${name}] stopped (exit code ${code})`);

    // If one of the two stops, stop the other one as well.
    stopAll();
  });

  return child;
});

console.log("[dev] API  -> http://localhost:5000");
console.log("[dev] App  -> http://localhost:5173");
console.log("[dev] Press Ctrl+C to stop both.\n");

process.on("SIGINT", () => {
  stopAll();
  process.exit(0);
});

process.on("SIGTERM", () => {
  stopAll();
  process.exit(0);
});
